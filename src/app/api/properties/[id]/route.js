import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import Property from "@/src/app/lib/models/Property";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid property ID",
        },
        { status: 400 }
      );
    }

    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: "Property not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property: JSON.parse(JSON.stringify(property)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch property",
      },
      { status: 500 }
    );
  }
}