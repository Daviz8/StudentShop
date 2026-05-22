import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";
import Property from "@/src/app/lib/models/Property";
import Order from "@/src/app/lib/models/Order";

export async function POST(request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const body = await request.json();

    const { customer, items, deliveryMethod, shippingFee, escrowFee } = body;

    if (!customer?.fullName || !customer?.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name and phone number are required",
        },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 }
      );
    }

    let createdOrder;

    await session.withTransaction(async () => {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const isProperty = item.itemType === "property";
        const Model = isProperty ? Property : Product;

        const realItemId =
          item.originalId ||
          String(item.id || "")
            .replace("property-", "")
            .replace("product-", "");

        if (!realItemId) {
          throw new Error(`${item.name} has an invalid item ID`);
        }

        const dbItem = await Model.findOneAndUpdate(
          {
            _id: realItemId,
            isActive: true,
            stock: { $gte: Number(item.quantity) },
          },
          {
            $inc: {
              stock: -Number(item.quantity),
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!dbItem) {
          throw new Error(`${item.name} is out of stock or unavailable`);
        }

        if (dbItem.stock === 0) {
          dbItem.isActive = false;
          await dbItem.save({ session });
        }

        const lineTotal = Number(dbItem.price) * Number(item.quantity);
        totalAmount += lineTotal;

        orderItems.push({
          itemType: isProperty ? "property" : "product",
          product: isProperty ? undefined : dbItem._id,
          property: isProperty ? dbItem._id : undefined,
          name: dbItem.name,
          quantity: Number(item.quantity),
          price: Number(dbItem.price),
        });
      }

      totalAmount += Number(shippingFee || 0);
      totalAmount += Number(escrowFee || 0);

      const orders = await Order.create(
        [
          {
            customerName: customer.fullName,
            customerPhone: customer.phone,
            customerEmail: customer.email || "",
            items: orderItems,
            totalAmount,
            status: "pending",
            deliveryMethod,
            deliveryAddress: customer.address || "",
            shippingFee: Number(shippingFee || 0),
            escrowFee: Number(escrowFee || 0),
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Checkout failed",
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}