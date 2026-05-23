import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Property from "../../lib/models/Property";

export async function GET() {
  try {
    await connectDB();

    const properties = await Property.find({
      isActive: true,
      stock: { $gt: 0 },
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      properties,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || !body.description || !body.price || !body.stock) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, price and stock are required",
        },
        { status: 400 }
      );
    }

    if (!body.images || body.images.length < 1 || body.images.length > 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Property must have between 1 and 3 images",
        },
        { status: 400 }
      );
    }

    const property = await Property.create({
      name: body.name,
      description: body.description,
      category: body.category || "Property",
      condition: body.condition || "used",
      price: Number(body.price),
      stock: Number(body.stock),
      location: body.location || "",
      images: body.images,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Property created successfully",
        property,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create property",
      },
      { status: 500 }
    );
  }
}
