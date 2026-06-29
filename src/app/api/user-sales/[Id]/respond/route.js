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

//TODO Test patch request in Prod.
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
      return NextResponse.json(
        {
          success: false,
          message: "Invalid sale request ID.",
        },
        { status: 400 }
      );
    }

    const {
      response,
      counterPrice,
      counterMessage,
    } = await request.json();

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

    if (saleRequest.submittedBy?.toString() !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to respond to this offer.",
        },
        { status: 403 }
      );
    }

    const latestNegotiation =
      saleRequest.negotiations[saleRequest.negotiations.length - 1];

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

    if (response === "accepted") {
      latestNegotiation.set({
        sellerResponse: "accepted",
        respondedAt: new Date(),
        counterPrice: 0,
        counterMessage: "",
      });

      saleRequest.status = "offer_accepted";
      saleRequest.acceptedPrice = latestNegotiation.adminOfferPrice;

      saleRequest.markModified("negotiations");

      await saleRequest.save();

      return NextResponse.json({
        success: true,
        message:
          "Offer accepted successfully. Admin can now schedule your inspection.",
        saleRequest,
      });
    }

    // REJECTED

    latestNegotiation.set({
      sellerResponse: "rejected",
      respondedAt: new Date(),
      counterPrice: Number(counterPrice || 0),
      counterMessage: counterMessage?.trim() || "",
    });

    if (Number(counterPrice || 0) > 0) {
      saleRequest.status = "counter_price_sent";
    } else {
      saleRequest.status = "negotiating";
    }

    saleRequest.markModified("negotiations");

    await saleRequest.save();

    if (saleRequest.negotiationCount >= 3) {
      await deleteCloudinaryImages(saleRequest.images);
      await UserSale.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        finalRejected: true,
        message:
          "Third offer rejected. Negotiation limit reached. The request has been closed.",
      });
    }

    return NextResponse.json({
      success: true,
      message:
        Number(counterPrice || 0) > 0
          ? "Counter price sent successfully."
          : "Offer rejected. Admin may send another offer.",
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