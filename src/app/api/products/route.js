import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Product from "../../lib/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
      stock: { $gt: 0 },
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const product = await Product.create({
      name: body.name,
      description: body.description,
      category: body.category,
      price: Number(body.price),
      stock: Number(body.stock),
      images: body.images || [],
    });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create product",
      },
      { status: 500 }
    );
  }
}