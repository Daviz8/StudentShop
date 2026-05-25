import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    let product = null;

    // If the id is a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    // Optional fallback if your product has slug or custom id field
    if (!product) {
      product = await Product.findOne({
        $or: [{ slug: id }, { id: id }],
      }).lean();
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: JSON.parse(JSON.stringify(product)),
    });
  } catch (error) {
    console.error("GET_PRODUCT_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}