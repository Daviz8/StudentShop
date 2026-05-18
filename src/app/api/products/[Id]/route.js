import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findById(id);

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
      product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}