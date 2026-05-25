import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
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

    const saleRequest = await UserSale.findById(id).lean();

    if (!saleRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Sale request not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      saleRequest: JSON.parse(JSON.stringify(saleRequest)),
    });
  } catch (error) {
    console.error("GET_USER_SALE_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch sale request.",
      },
      { status: 500 }
    );
  }
}