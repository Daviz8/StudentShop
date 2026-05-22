import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view this request.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request ID.",
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

    const submittedBy = saleRequest.submittedBy?.toString();

    const isOwner = submittedBy && submittedBy === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to view this request.",
        },
        { status: 403 }
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