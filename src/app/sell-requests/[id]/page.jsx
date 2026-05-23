"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  XCircle,
} from "lucide-react";

export default function UserSellRequestPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [error, setError] = useState("");

  const loadItem = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/user-sales/${id}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success || !data?.saleRequest) {
        throw new Error(data?.message || "Failed to load request");
      }

      setItem(data.saleRequest);
    } catch (err) {
      setError(err.message || "Something went wrong while loading request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const respondToOffer = async (response) => {
    const confirmed = confirm(
      response === "accepted"
        ? "Accept this admin offer?"
        : "Reject this admin offer?"
    );

    if (!confirmed) return;

    try {
      setResponding(true);

      const res = await fetch(`/api/user-sales/${id}/respond`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to respond to offer");
      }

      alert(data.message || "Response sent successfully");

      if (response === "rejected" && Number(item?.negotiationCount || 0) >= 3) {
        router.push("/my-requests");
        router.refresh();
        return;
      }

      await loadItem();
    } catch (err) {
      alert(err.message || "Failed to respond to offer");
    } finally {
      setResponding(false);
    }
  };

  const formatMoney = (value) => {
    return `₦${Number(value || 0).toLocaleString()}`;
  };

  const formatDate = (value) => {
    if (!value) return "Not scheduled yet";

    return new Date(value).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.url || "";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin" size={20} />
          <p className="font-bold text-black">Loading offer...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <section className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto text-red-600" size={42} />

          <h1 className="mt-4 text-2xl font-black text-black">
            Could not load offer
          </h1>

          <p className="mt-2 text-sm font-bold text-red-600">{error}</p>

          <Link
            href="/my-requests"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 font-black text-white"
          >
            Back to Notifications
          </Link>
        </section>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <section className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-black">Request not found</h1>

          <Link
            href="/my-requests"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 font-black text-white"
          >
            Back to Notifications
          </Link>
        </section>
      </main>
    );
  }

  const latestOffer = item?.negotiations?.[item.negotiations.length - 1];
  const hasPendingOffer = latestOffer?.sellerResponse === "pending";
  const images = item?.images || [];
  const hasAppointment = !!item?.appointment?.date;

  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/my-requests"
          className="mb-6 inline-flex items-center gap-2 font-black text-black"
        >
          <ArrowLeft size={18} />
          Back to Notifications
        </Link>

        <div className="rounded-[2rem] bg-black p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
            Admin Offer
          </p>

          <h1 className="mt-3 text-4xl font-black">{item.gadgetName}</h1>

          <p className="mt-3 text-white/60">
            View the admin price offer, accept or reject it, and check your
            scheduled inspection date.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-black">Your Request</h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Status" value={item.status?.replaceAll("_", " ")} />

                <Info
                  label="Your Asking Price"
                  value={formatMoney(item.sellerAskingPrice)}
                />

                <Info
                  label="Condition"
                  value={item.condition?.replaceAll("_", " ") || "N/A"}
                />

                <Info
                  label="Negotiation Trials"
                  value={`${item.negotiationCount || 0}/3`}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-black/40">
                  Description
                </p>

                <p className="mt-2 text-sm leading-relaxed text-black/70">
                  {item.gadgetDescription ||
                    item.faultsAccessoriesReason ||
                    "No description provided"}
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-black">
                  Uploaded Images
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {images.map((image, index) => {
                    const imageUrl = getImageUrl(image);

                    if (!imageUrl) return null;

                    return (
                      <a
                        key={image.publicId || imageUrl || index}
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-2xl bg-[#FFC107]/20"
                      >
                        <img
                          src={imageUrl}
                          alt={`${item.gadgetName} ${index + 1}`}
                          className="h-40 w-full object-cover transition hover:scale-105"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-black">Latest Offer</h2>

              {!latestOffer ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                  <Clock className="text-black/40" size={28} />

                  <p className="mt-3 font-bold text-black">
                    No admin offer yet.
                  </p>

                  <p className="mt-1 text-sm text-black/50">
                    Once admin reviews your item, the offer will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-[#FFC107]/20 p-5">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={20} />

                    <p className="font-black text-black">
                      Trial {latestOffer.trialNumber}
                    </p>
                  </div>

                  <p className="mt-3 text-4xl font-black text-black">
                    {formatMoney(latestOffer.adminOfferPrice)}
                  </p>

                  {latestOffer.message && (
                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      {latestOffer.message}
                    </p>
                  )}

                  <p className="mt-3 text-xs font-black uppercase text-black/50">
                    Response: {latestOffer.sellerResponse}
                  </p>

                  {hasPendingOffer && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => respondToOffer("accepted")}
                        disabled={responding}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-black text-white disabled:opacity-60"
                      >
                        <CheckCircle2 size={18} />
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => respondToOffer("rejected")}
                        disabled={responding}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 font-black text-white disabled:opacity-60"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays size={20} />
                <h2 className="text-xl font-black text-black">
                  Scheduled Inspection
                </h2>
              </div>

              {hasAppointment ? (
                <div className="mt-4 rounded-2xl bg-green-50 p-5">
                  <p className="text-xs font-black uppercase text-green-700">
                    Date and time
                  </p>

                  <p className="mt-1 text-lg font-black text-black">
                    {formatDate(item.appointment.date)}
                  </p>

                  {item.appointment.location && (
                    <>
                      <p className="mt-4 text-xs font-black uppercase text-green-700">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-bold text-black/70">
                        {item.appointment.location}
                      </p>
                    </>
                  )}

                  {item.appointment.note && (
                    <>
                      <p className="mt-4 text-xs font-black uppercase text-green-700">
                        Note
                      </p>

                      <p className="mt-1 text-sm font-bold text-black/70">
                        {item.appointment.note}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                  <p className="font-bold text-black">Not scheduled yet.</p>

                  <p className="mt-1 text-sm text-black/50">
                    If you accept the offer, admin can schedule an inspection
                    date.
                  </p>
                </div>
              )}
            </div>

            {item.negotiations?.length > 0 && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-black">
                  Offer History
                </h2>

                <div className="mt-4 space-y-3">
                  {item.negotiations.map((offer) => (
                    <div
                      key={offer._id}
                      className="rounded-2xl border border-black/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-black text-black">
                          Trial {offer.trialNumber}
                        </p>

                        <span className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase text-white">
                          {offer.sellerResponse}
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-black text-black">
                        {formatMoney(offer.adminOfferPrice)}
                      </p>

                      {offer.message && (
                        <p className="mt-2 text-sm text-black/60">
                          {offer.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-black/40">{label}</p>

      <p className="mt-1 break-words text-sm font-bold capitalize text-black">
        {value || "N/A"}
      </p>
    </div>
  );
}
