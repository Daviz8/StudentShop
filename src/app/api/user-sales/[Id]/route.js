import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const id = params?.id;

    // 🔍 debug logs (safe for production debugging, remove later if needed)
    console.log("ID RECEIVED:", id);
    console.log("LENGTH:", id?.length);
    console.log("VALID OBJECTID:", mongoose.Types.ObjectId.isValid(id));

    // 🚨 validate ID early
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid sale request ID.",
        },
        { status: 400 }
      );
    }

    // fetch record
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

    return NextResponse.json({
      success: true,
      saleRequest: saleRequest.toObject(),
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