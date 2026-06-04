import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";
import Property from "@/src/app/lib/models/Property";
import Order from "@/src/app/lib/models/Order";
import { initializePaystackTransaction } from "@/src/app/lib/Paystack";

function generateReference() {
  return `SSN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export async function POST(request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "PAYSTACK_SECRET_KEY is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { customer, items, deliveryMethod, shippingFee, escrowFee } = body;

    if (!customer?.fullName || !customer?.phone || !customer?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer full name, email and phone number are required.",
        },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty.",
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
          throw new Error(`${item.name} has an invalid item ID.`);
        }

        const dbItem = await Model.findOne({
          _id: realItemId,
          isActive: true,
          stock: { $gte: Number(item.quantity) },
        }).session(session);

        if (!dbItem) {
          throw new Error(`${item.name} is out of stock or unavailable.`);
        }

        const quantity = Number(item.quantity);
        const lineTotal = Number(dbItem.price) * quantity;

        totalAmount += lineTotal;

        orderItems.push({
          itemType: isProperty ? "property" : "product",
          product: isProperty ? undefined : dbItem._id,
          property: isProperty ? dbItem._id : undefined,
          name: dbItem.name,
          quantity,
          price: Number(dbItem.price),
        });
      }

      totalAmount += Number(shippingFee || 0);
      totalAmount += Number(escrowFee || 0);

      const paymentReference = generateReference();

      const orders = await Order.create(
        [
          {
            customerName: customer.fullName,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            items: orderItems,
            totalAmount,
            status: "pending",
            deliveryMethod,
            deliveryAddress: customer.address || "",
            shippingFee: Number(shippingFee || 0),
            escrowFee: Number(escrowFee || 0),
            paymentProvider: "paystack",
            paymentReference,
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const paystackTransaction = await initializePaystackTransaction({
      email: createdOrder.customerEmail,
      amount: Math.round(Number(createdOrder.totalAmount) * 100),
      reference: createdOrder.paymentReference,
      callbackUrl: `${siteUrl}/payment/callback`,
      metadata: {
        orderId: createdOrder._id.toString(),
        customerName: createdOrder.customerName,
        customerPhone: createdOrder.customerPhone,
      },
    });

    if (!paystackTransaction?.authorization_url) {
      return NextResponse.json(
        {
          success: false,
          message: "Paystack did not return an authorization URL.",
          paystackTransaction,
        },
        { status: 500 }
      );
    }

    createdOrder.paymentAccessCode = paystackTransaction.access_code || "";
    await createdOrder.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment initialized successfully.",
        order: JSON.parse(JSON.stringify(createdOrder)),
        payment: {
          authorizationUrl: paystackTransaction.authorization_url,
          accessCode: paystackTransaction.access_code,
          reference: paystackTransaction.reference,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CHECKOUT_PAYSTACK_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Checkout failed.",
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}