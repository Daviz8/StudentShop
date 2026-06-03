import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL;

function isAdmin(user) {
  return (
    user?.role === "admin" ||
    String(user?.email || "").trim().toLowerCase() ===
      String(MAIN_ADMIN_EMAIL || "").toLowerCase()
  );
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { success: false, message: "Admin access only." },
        { status: 403 }
      );
    }

    await connectDB();

    const id = params?.id;

    // ✅ safer validation
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid sale request ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const adminOfferPrice = Number(body.adminOfferPrice ?? body.offerPrice);

    const message = String(body.message || "").trim();

    if (!Number.isFinite(adminOfferPrice) || adminOfferPrice <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid offer price is required." },
        { status: 400 }
      );
    }

    const saleRequest = await UserSale.findById(id);

    if (!saleRequest) {
      return NextResponse.json(
        { success: false, message: "Sale request not found." },
        { status: 404 }
      );
    }

    const negotiationCount = Number(saleRequest.negotiationCount || 0);

    // 🚨 hard stop after 3 tries
    if (negotiationCount >= 3) {
      saleRequest.status = "rejected";
      await saleRequest.save();

      return NextResponse.json(
        {
          success: false,
          message: "Negotiation limit reached. Request rejected.",
        },
        { status: 400 }
      );
    }

    // close previous pending negotiations safely
    saleRequest.negotiations = (saleRequest.negotiations || []).map((n) => {
      if (n.sellerResponse === "pending") {
        return {
          ...n.toObject?.(),
          sellerResponse: "rejected",
          respondedAt: new Date(),
        };
      }
      return n;
    });

    const nextTrial = negotiationCount + 1;

    saleRequest.negotiationCount = nextTrial;
    saleRequest.status = "negotiating";

    saleRequest.negotiations.push({
      trialNumber: nextTrial,
      adminOfferPrice,
      message,
      sellerResponse: "pending",
      createdAt: new Date(),
    });

    await saleRequest.save();

    return NextResponse.json({
      success: true,
      message: "Offer sent successfully.",
      saleRequest: JSON.parse(JSON.stringify(saleRequest)),
    });
  } catch (error) {
    console.error("ADMIN_SEND_OFFER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send offer.",
      },
      { status: 500 }
    );
  }
}