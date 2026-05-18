import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const offerPrice = Number(body.offerPrice);

    if (!offerPrice || offerPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid offer price is required",
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

    if (
      ["offer_accepted", "appointment_scheduled", "bought", "rejected"].includes(
        saleRequest.status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot negotiate because status is ${saleRequest.status}`,
        },
        { status: 400 }
      );
    }

    if (saleRequest.negotiationCount >= 3) {
      saleRequest.status = "rejected";
      await saleRequest.save();

      await UserSale.findByIdAndDelete(id);

      return NextResponse.json(
        {
          success: false,
          message:
            "Negotiation limit reached. Item has been rejected and deleted.",
        },
        { status: 400 }
      );
    }

    const nextTrial = saleRequest.negotiationCount + 1;

    saleRequest.negotiations.push({
      trialNumber: nextTrial,
      adminOfferPrice: offerPrice,
      message: body.message || "",
      sellerResponse: "pending",
    });

    saleRequest.negotiationCount = nextTrial;
    saleRequest.status = "negotiating";

    await saleRequest.save();

    return NextResponse.json({
      success: true,
      message: `Offer trial ${nextTrial} sent successfully`,
      saleRequest,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send offer",
      },
      { status: 500 }
    );
  }
}