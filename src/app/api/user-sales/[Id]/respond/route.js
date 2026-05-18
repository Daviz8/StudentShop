import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const response = body.response;

    if (!["accepted", "rejected"].includes(response)) {
      return NextResponse.json(
        {
          success: false,
          message: "Response must be accepted or rejected",
        },
        { status: 400 }
      );
    }

    const saleRequest = await UserSale.findById(id);

    if (!saleRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Sale request not found",
        },
        { status: 404 }
      );
    }

    const latestNegotiation =
      saleRequest.negotiations[saleRequest.negotiations.length - 1];

    if (!latestNegotiation) {
      return NextResponse.json(
        {
          success: false,
          message: "No offer found to respond to",
        },
        { status: 400 }
      );
    }

    if (latestNegotiation.sellerResponse !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "This offer has already been responded to",
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
        message: "Offer accepted. Admin can now schedule inspection.",
        saleRequest,
      });
    }

    if (response === "rejected" && saleRequest.negotiationCount >= 3) {
      saleRequest.status = "rejected";
      await saleRequest.save();

      await UserSale.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message:
          "Third offer rejected. Negotiation limit reached. Item has been rejected and deleted.",
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
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to respond to offer",
      },
      { status: 500 }
    );
  }
}