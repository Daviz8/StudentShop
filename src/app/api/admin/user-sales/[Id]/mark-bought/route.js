import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

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

    if (saleRequest.status !== "appointment_scheduled") {
      return NextResponse.json(
        {
          success: false,
          message: "Item can only be marked as bought after appointment",
        },
        { status: 400 }
      );
    }

    saleRequest.status = "bought";
    await saleRequest.save();

    await UserSale.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Item marked as bought and removed from sale request list",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to mark item as bought",
      },
      { status: 500 }
    );
  }
}