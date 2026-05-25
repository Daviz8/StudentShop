import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

export const dynamic = "force-dynamic";

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

    const response = String(body.response || "").trim();
    const counterPrice = Number(body.counterPrice || 0);
    const counterMessage = String(body.counterMessage || "").trim();

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

    const submittedByEmail = String(saleRequest.submittedByEmail || "")
      .trim()
      .toLowerCase();

    const sellerEmail = String(saleRequest.sellerEmail || "")
      .trim()
      .toLowerCase();

    const userEmail = String(user.email || "").trim().toLowerCase();

    const isOwner =
      submittedBy === String(user.id) ||
      submittedByEmail === userEmail ||
      sellerEmail === userEmail;

    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to respond to this offer.",
        },
        { status: 403 }
      );
    }

    const negotiations = saleRequest.negotiations || [];
    const latestNegotiation = negotiations[negotiations.length - 1];

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

    const latestTrialNumber = Number(
      latestNegotiation.trialNumber || saleRequest.negotiationCount || 0
    );

    const isFinalAdminOffer = latestTrialNumber >= 3;

    latestNegotiation.sellerResponse = response;
    latestNegotiation.respondedAt = new Date();

    if (response === "accepted") {
      saleRequest.status = "offer_accepted";
      saleRequest.acceptedPrice = latestNegotiation.adminOfferPrice;

      await saleRequest.save();

      return NextResponse.json({
        success: true,
        finalRejected: false,
        message:
          "Offer accepted successfully. Admin can now schedule your inspection.",
        saleRequest: JSON.parse(JSON.stringify(saleRequest)),
      });
    }

    if (response === "rejected") {
      /*
        Final rejection:
        Do NOT delete the request.
        Keep it in DB so admin can see "rejected" and delete manually.
      */
      if (isFinalAdminOffer) {
        saleRequest.status = "rejected";

        await saleRequest.save();

        return NextResponse.json({
          success: true,
          finalRejected: true,
          message:
            "Final offer rejected. This request has been closed and sent back to admin as rejected.",
          saleRequest: JSON.parse(JSON.stringify(saleRequest)),
        });
      }

      /*
        Normal rejection with counter price:
        Only allowed before final offer.
      */
      if (counterPrice > 0) {
        latestNegotiation.counterPrice = counterPrice;
        latestNegotiation.counterMessage = counterMessage;
        saleRequest.status = "counter_price_sent";

        await saleRequest.save();

        return NextResponse.json({
          success: true,
          finalRejected: false,
          message: "Offer rejected and counter price sent to admin.",
          saleRequest: JSON.parse(JSON.stringify(saleRequest)),
        });
      }

      /*
        Normal rejection without counter:
        Admin may still send another offer if trial count is less than 3.
      */
      saleRequest.status = "negotiating";

      await saleRequest.save();

      return NextResponse.json({
        success: true,
        finalRejected: false,
        message: "Offer rejected. Admin may send another offer.",
        saleRequest: JSON.parse(JSON.stringify(saleRequest)),
      });
    }
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