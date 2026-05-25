import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";


function isAdmin(user) {
  return (
    user?.role === "admin" ||
    String(user?.email || "").trim().toLowerCase() === MAIN_ADMIN_EMAIL
  );
}

export async function PATCH(request, context) {
  try {
    const user = await getCurrentUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access only.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const params = await context.params;
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid sale request ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const adminOfferPrice = Number(
      body.adminOfferPrice || body.offerPrice || 0
    );

    const message = String(body.message || "").trim();

    if (!adminOfferPrice || adminOfferPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid offer price is required.",
        },
        { status: 400 }
      );
    }

    const saleRequest = await UserSale.findById(id);

    if (!saleRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Sale request not found.",
        },
        { status: 404 }
      );
    }

    const negotiationCount = Number(saleRequest.negotiationCount || 0);

    if (negotiationCount >= 3) {
      saleRequest.status = "rejected";
      await saleRequest.save();

      return NextResponse.json(
        {
          success: false,
          message: "Negotiation limit reached. This request is rejected.",
        },
        { status: 400 }
      );
    }

    // Close any previous pending offer before adding a new one
    saleRequest.negotiations = (saleRequest.negotiations || []).map((item) => {
      if (item.sellerResponse === "pending") {
        item.sellerResponse = "rejected";
        item.respondedAt = new Date();
      }

      return item;
    });

    saleRequest.negotiationCount = negotiationCount + 1;
    saleRequest.status = "negotiating";

    saleRequest.negotiations.push({
      trialNumber: saleRequest.negotiationCount,
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