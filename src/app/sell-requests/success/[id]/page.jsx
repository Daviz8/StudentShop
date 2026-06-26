"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, FileText } from "lucide-react";

export default function SellRequestSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestId = params?.id || "";
  const itemName = searchParams.get("item") || "your item";

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-6 text-center shadow-xl md:p-10">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFA500]/10 text-[#FFA500] animate-bounce">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="mt-6 text-3xl font-black text-black">
          Submission Received!
        </h1>

        <p className="mt-3 text-sm text-black/60">
          Your trade-in request for <b>{itemName}</b> was submitted.
        </p>

        <div className="mt-8 space-y-3">
          {requestId && (
            <button
              onClick={() => router.push(`/sell-requests/${requestId}`)}
              className="w-full rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black"
            >
              Track Request
            </button>
          )}

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-2xl border px-5 py-4 font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
} 