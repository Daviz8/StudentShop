import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyPaystackTransaction } from "../../lib/Paystack";
import { connectDB } from "../../lib/db";
import Order from "../../lib/models/Order";

export const dynamic = "force-dynamic";

function getReference(searchParams) {
  const referenceParam = searchParams?.reference || searchParams?.trxref;

  if (Array.isArray(referenceParam)) {
    return String(referenceParam[0] || "").trim();
  }

  return String(referenceParam || "").trim();
}

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Payment verification failed.";
}

export default async function PaymentCallbackPage({ searchParams }) {
  const params = await searchParams;
  const reference = getReference(params);

  let status = "failed";
  let message = "Payment verification failed.";
  let orderId = "";

  try {
    if (!reference) {
      throw new Error("Payment reference is missing.");
    }

    await connectDB();

    const paymentData = await verifyPaystackTransaction(reference);

    const order = await Order.findOne({
      $or: [
        { paymentReference: reference },
        { paystackReference: reference },
        { reference },
      ],
    });

    if (!order) {
      throw new Error("Order not found for this payment reference.");
    }

    orderId = order._id.toString();

    if (order.status === "paid" || order.paymentStatus === "paid") {
      status = "success";
      message = "Payment already confirmed. Your order is paid.";
    } else if (paymentData.status === "success") {
      order.status = "paid";
      order.paymentStatus = "paid";

      order.paymentProvider = "paystack";
      order.paymentMethod = "paystack";

      order.paymentReference = reference;
      order.paystackReference = reference;

      order.amountPaid = Number(paymentData.amount || 0) / 100;
      order.currency = paymentData.currency || "NGN";
      order.paidAt = paymentData.paid_at
        ? new Date(paymentData.paid_at)
        : new Date();

      order.paystackTransactionId = paymentData.id;
      order.paystackChannel = paymentData.channel || "";
      order.paystackData = paymentData;
      order.paystackRaw = paymentData;

      await order.save();

      status = "success";
      message = "Payment successful. Your order has been confirmed.";
    } else {
      order.status = "failed";
      order.paymentStatus = "failed";
      order.paystackData = paymentData;
      order.paystackRaw = paymentData;

      await order.save();

      status = "failed";
      message = `Payment was not successful. Status: ${paymentData.status}`;
    }
  } catch (error) {
    console.error("PAYMENT_CALLBACK_ERROR:", error);
    message = getErrorMessage(error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
      <section className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
        {status === "success" ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={42} />
          </div>
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
            <XCircle size={42} />
          </div>
        )}

        <h1 className="mt-6 text-3xl font-black text-black">
          {status === "success" ? "Payment Successful" : "Payment Failed"}
        </h1>

        <p className="mt-3 text-black/60">{message}</p>

        {reference ? (
          <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-black/50">
            Reference: {reference}
          </p>
        ) : null}

        {orderId ? (
          <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-black/60">
            Order ID: {orderId}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3">
          <Link
            href="/store"
            className="inline-flex w-full justify-center rounded-2xl bg-[#FFA500] px-6 py-4 font-black text-black hover:bg-[#FFC107]"
          >
            Back to Store
          </Link>

          <Link
            href="/cart"
            className="inline-flex w-full justify-center rounded-2xl border border-black/10 px-6 py-4 font-black text-black hover:bg-black hover:text-white"
          >
            Back to Cart
          </Link>
        </div>
      </section>
    </main>
  );
}