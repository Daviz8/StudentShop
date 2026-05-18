import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";
import Order from "@/src/app/lib/models/Order";

export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const quantity = Number(body.quantity || 1);

    if (quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be at least 1",
        },
        { status: 400 }
      );
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        stock: { $gte: quantity },
      },
      {
        $inc: { stock: -quantity },
      },
      {
        new: true,
      }
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is out of stock or unavailable",
        },
        { status: 400 }
      );
    }

    if (product.stock === 0) {
      product.isActive = false;
      await product.save();
    }

    const order = await Order.create({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      items: [
        {
          product: product._id,
          name: product.name,
          quantity,
          price: product.price,
        },
      ],
      totalAmount: product.price * quantity,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order,
      remainingStock: product.stock,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to buy product",
      },
      { status: 500 }
    );
  }
}