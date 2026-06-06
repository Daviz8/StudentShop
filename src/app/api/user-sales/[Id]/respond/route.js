import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";
import { deleteCloudinaryImages } from "@/src/app/lib/deleteCloudinaryImages";


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


export async function PATCH(request, context) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to respond to this offer.",
        },
        { status: 401 }
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

    const response = body.response;

    if (!["accepted", "rejected"].includes(response)) {
      return NextResponse.json(
        {
          success: false,
          message: "Response must be accepted or rejected.",
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

    const submittedBy = saleRequest.submittedBy?.toString();

    if (submittedBy !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to respond to this offer.",
        },
        { status: 403 }
      );
    }

    const latestNegotiation = saleRequest.negotiations[saleRequest.negotiations.length - 1];

    if (!latestNegotiation) {
      return NextResponse.json(
        {
          success: false,
          message: "No admin offer found to respond to.",
        },
        { status: 400 }
      );
    }

    if (latestNegotiation.sellerResponse !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "This offer has already been responded to.",
        },
        { status: 400 }
      );
    }

    latestNegotiation.sellerResponse = response;
    latestNegotiation.respondedAt = new Date();

    if (response === "accepted") {
      saleRequest.status = "offer_accepted";
      saleRequest.acceptedPrice = latestNegotiation.adminOfferPrice;

      await saleRequest.save();

      return NextResponse.json({
        success: true,
        message:
          "Offer accepted successfully. Admin can now schedule your inspection.",
        saleRequest,
      });
    }

    if (response === "rejected" && saleRequest.negotiationCount >= 3) {
      await deleteCloudinaryImages(saleRequest.images);
      await UserSale.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message:
          "Third offer rejected. Negotiation limit reached. The request has been closed.",
      });
    }

    saleRequest.status = "negotiating";
    await saleRequest.save();

    return NextResponse.json({
      success: true,
      message: "Offer rejected. Admin may send another offer.",
      saleRequest,
    });
  } catch (error) {
    console.error("RESPOND_TO_OFFER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to respond to offer.",
      },
      { status: 500 }
    );
  }
}