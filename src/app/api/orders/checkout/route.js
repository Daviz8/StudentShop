

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";
import Property from "@/src/app/lib/models/Property";
import Order from "@/src/app/lib/models/Order";
import { initializePaystackTransaction } from "@/src/app/lib/Paystack";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function generateReference() {
  return `SSN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Checkout failed.";
}

function getSiteUrl(request) {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const origin = request.headers.get("origin");

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  return "";
}

function cleanMongoId(value) {
  return String(value || "")
    .replace("property-", "")
    .replace("product-", "")
    .trim();
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

    const siteUrl = getSiteUrl(request);

    if (!siteUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "NEXT_PUBLIC_SITE_URL is missing. Add it to .env.local, for example http://localhost:3000",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      customer = {},
      items = [],
      deliveryMethod = "pickup",
      shippingFee = 0,
      escrowFee = 0,
    } = body;

    if (!customer.fullName || !customer.phone || !customer.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer full name, email and phone number are required.",
        },
        { status: 400 }
      );
    }

    if (deliveryMethod === "standard" && !customer.address) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery address is required for standard delivery.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty.",
        },
        { status: 400 }
      );
    }

    let createdOrder = null;

    await session.withTransaction(async () => {
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const quantity = Number(item.quantity || 1);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error(`${item.name || "Item"} has an invalid quantity.`);
        }

        const isProperty = item.itemType === "property";
        const Model = isProperty ? Property : Product;

        const realItemId = item.originalId || cleanMongoId(item.id);

        if (!realItemId || !mongoose.Types.ObjectId.isValid(realItemId)) {
          throw new Error(`${item.name || "Item"} has an invalid item ID.`);
        }

        const dbItem = await Model.findOne({
          _id: realItemId,
          isActive: true,
          stock: { $gte: quantity },
        }).session(session);

        if (!dbItem) {
          throw new Error(
            `${item.name || "Item"} is out of stock or unavailable.`
          );
        }

        const price = Number(dbItem.price || 0);

        if (!Number.isFinite(price) || price <= 0) {
          throw new Error(`${dbItem.name} has an invalid price.`);
        }

        const lineTotal = price * quantity;

        subtotal += lineTotal;

        orderItems.push({
          itemType: isProperty ? "property" : "product",
          product: isProperty ? undefined : dbItem._id,
          property: isProperty ? dbItem._id : undefined,
          name: dbItem.name,
          image: Array.isArray(dbItem.images) ? dbItem.images[0] || "" : "",
          quantity,
          price,
          lineTotal,
        });
      }

      const safeShippingFee = Number(shippingFee || 0);
      const safeEscrowFee = Number(escrowFee || 0);

      if (safeShippingFee < 0 || safeEscrowFee < 0) {
        throw new Error("Invalid shipping or escrow fee.");
      }

      const totalAmount = subtotal + safeShippingFee + safeEscrowFee;
      const paymentReference = generateReference();

      const orders = await Order.create(
        [
          {
            customerName: customer.fullName,
            customerPhone: customer.phone,
            customerEmail: customer.email,

            items: orderItems,

            subtotal,
            shippingFee: safeShippingFee,
            escrowFee: safeEscrowFee,
            totalAmount,

            status: "pending",
            paymentStatus: "pending",

            deliveryMethod,
            deliveryAddress: customer.address || "",

            paymentProvider: "paystack",
            paymentMethod: "paystack",
            paymentReference,
            paystackReference: paymentReference,

            paymentAccessCode: "",
            paidAt: null,

            notes: customer.notes || "",
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    if (!createdOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order could not be created.",
        },
        { status: 500 }
      );
    }

    const callbackUrl = `${siteUrl}/payment/callback?reference=${encodeURIComponent(
      createdOrder.paymentReference
    )}`;

    const paystackTransaction = await initializePaystackTransaction({
      email: createdOrder.customerEmail,
      amount: Math.round(Number(createdOrder.totalAmount) * 100),
      reference: createdOrder.paymentReference,
      callbackUrl,
      metadata: {
        orderId: createdOrder._id.toString(),
        order_id: createdOrder._id.toString(),
        paymentReference: createdOrder.paymentReference,
        customerName: createdOrder.customerName,
        customerPhone: createdOrder.customerPhone,
        customerEmail: createdOrder.customerEmail,
        deliveryMethod: createdOrder.deliveryMethod,
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
    createdOrder.paystackAccessCode = paystackTransaction.access_code || "";
    createdOrder.paystackAuthorizationUrl =
      paystackTransaction.authorization_url || "";

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
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}