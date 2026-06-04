"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, FileText } from "lucide-react";

export default function SellRequestSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestId = searchParams.get("id") || "";
  const itemName = searchParams.get("item") || "your item";

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2.5rem] border border-black/10 bg-white p-6 text-center shadow-xl md:p-10">
        
        {/* Animated Icon Container */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFA500]/10 text-[#FFA500] animate-bounce">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>

        {/* Success Header */}
        <h1 className="mt-6 text-3xl font-black text-black tracking-tight">
          Submission Received!
        </h1>
        
        <p className="mt-3 text-sm leading-relaxed text-black/60">
          Awesome! Your trade-in request for <span className="font-bold text-black">"{itemName}"</span> has been successfully sent to Student Shop Nigeria.
        </p>

        {/* Process Roadmap Card */}
        <div className="mt-8 rounded-2xl bg-black p-5 text-left text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC107]">
            What happens next?
          </p>
          
          <ul className="mt-3 space-y-3 text-xs">
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">1</span>
              <span>Our team reviews your item details and provided images.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">2</span>
              <span>We will contact you via Phone or WhatsApp with an initial valuation offer.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {requestId && (
            <button
              onClick={() => router.push(`/sell-requests/${requestId}`)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText size={18} />
              Track Request Status
              <ArrowRight size={16} />
            </button>
          )}

          <button
            onClick={() => router.push("/")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-4 font-bold text-black transition-colors hover:bg-black/5"
          >
            <ShoppingBag size={18} />
            Return to Homepage
          </button>
        </div>

        {/* Footer Support Tag */}
        <p className="mt-8 text-xs text-black/40">
          Need immediate support? Reach out to us directly on WhatsApp.
        </p>
      </div>
    </div>
  );
}