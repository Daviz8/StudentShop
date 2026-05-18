import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

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

    if (saleRequest.status !== "offer_accepted") {
      return NextResponse.json(
        {
          success: false,
          message: "Appointment can only be scheduled after offer is accepted",
        },
        { status: 400 }
      );
    }

    saleRequest.appointment = {
      date: new Date(body.date),
      location: body.location,
      note: body.note || "",
    };

    saleRequest.status = "appointment_scheduled";

    await saleRequest.save();

    return NextResponse.json({
      success: true,
      message: "Appointment scheduled successfully",
      saleRequest,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to schedule appointment",
      },
      { status: 500 }
    );
  }
}