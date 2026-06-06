import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanId(value) {
  if (!value || typeof value !== "string") return "";

  return decodeURIComponent(value)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

async function getIdFromRequest(request, context) {
  try {
    const params = context?.params ? await context.params : {};
    const paramId = cleanId(params?.id);

    if (paramId) return paramId;
  } catch {
    // fallback below
  }

  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    // /api/user-sales/:id
    const userSalesIndex = parts.findIndex((part) => part === "user-sales");

    if (userSalesIndex !== -1 && parts[userSalesIndex + 1]) {
      return cleanId(parts[userSalesIndex + 1]);
    }

    return "";
  } catch {
    return "";
  }
}


const MAIN_ADMIN_EMAIL = "studentshopng.info@gmail.com";

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
   
       const id = await getIdFromRequest(request, context);
   
       if (!id || !mongoose.Types.ObjectId.isValid(id)) {
         console.error("INVALID_USER_SALE_ID:", {
           receivedId: id,
           url: request.url,
         });
   
         return NextResponse.json(
           {
             success: false,
             message: "Invalid sale request ID.",
             receivedId: id || null,
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