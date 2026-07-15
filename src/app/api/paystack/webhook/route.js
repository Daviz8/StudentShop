import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import Order from "@/src/app/lib/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyPaystackSignature(rawBody, signature) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing.");
  }

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

function getPaystackAmountInNaira(amountInKobo) {
  return Number(amountInKobo || 0) / 100;
}

export async function POST(request) {
  try {
    const rawBody = await request.text();

    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Paystack signature.",
        },
        { status: 401 }
      );
    }

    const validSignature = verifyPaystackSignature(rawBody, signature);

    if (!validSignature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Paystack signature.",
        },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    console.log("PAYSTACK_WEBHOOK_EVENT:", event.event);

    if (event.event !== "charge.success") {
      return NextResponse.json({
        success: true,
        message: "Webhook received but ignored.",
      });
    }

    await connectDB();

    const paymentData = event.data;

    const reference = paymentData.reference;
    const status = paymentData.status;
    const paidAt = paymentData.paid_at || paymentData.paidAt || new Date();
    const channel = paymentData.channel || "";
    const currency = paymentData.currency || "NGN";
    const amountPaid = getPaystackAmountInNaira(paymentData.amount);

    const metadata = paymentData.metadata || {};
    const orderId = metadata.orderId || metadata.order_id || "";

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment reference missing.",
        },
        { status: 400 }
      );
    }

    if (status !== "success") {
      return NextResponse.json({
        success: true,
        message: "Payment was not successful.",
      });
    }

    const orderQuery = orderId
      ? {
          $or: [
            { _id: orderId },
            { paymentReference: reference },
            { paystackReference: reference },
            { reference },
          ],
        }
      : {
          $or: [
            { paymentReference: reference },
            { paystackReference: reference },
            { reference },
          ],
        };

    const order = await Order.findOne(orderQuery);

    if (!order) {
      console.error("PAYSTACK_WEBHOOK_ORDER_NOT_FOUND:", {
        orderId,
        reference,
      });

      return NextResponse.json({
        success: true,
        message: "Webhook received, but order was not found.",
      });
    }

    if (order.paymentStatus === "paid" || order.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Order already marked as paid.",
      });
    }

    order.paymentStatus = "paid";
    order.status = "paid";

    order.paymentMethod = "paystack";
    order.paymentReference = reference;
    order.paystackReference = reference;

    order.paymentChannel = channel;
    order.currency = currency;
    order.amountPaid = amountPaid;
    order.paidAt = paidAt ? new Date(paidAt) : new Date();

    order.paystackTransactionId = paymentData.id;
    order.paystackAuthorization = paymentData.authorization || {};
    order.paystackCustomer = paymentData.customer || {};
    order.paystackRaw = paymentData;

    await order.save();

    console.log("PAYSTACK_WEBHOOK_ORDER_PAID:", {
      orderId: order._id,
      reference,
      amountPaid,
    });

    return NextResponse.json({
      success: true,
      message: "Payment confirmed and order updated.",
    });
  } catch (error) {
    console.error("PAYSTACK_WEBHOOK_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process Paystack webhook.",
      },
      { status: 500 }
    );
  }
}