"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Loader2,
  MessageSquare,
  PackageSearch,
  Tag,
} from "lucide-react";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/user-sales/mine", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load your requests");
      }

      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getLatestOffer = (request) => {
    if (!request.negotiations || request.negotiations.length === 0) {
      return null;
    }

    return request.negotiations[request.negotiations.length - 1];
  };

  const formatDate = (value) => {
    if (!value) return "No date yet";

    return new Date(value).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin" size={20} />
          <p className="font-bold text-black">Loading notifications...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <section className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-black">
            Could not load notifications
          </h1>

          <p className="mt-3 text-sm font-bold text-red-600">{error}</p>

          <Link
            href="/signup"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 font-black text-white"
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-black p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
            Student Shop Nigeria
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Notifications
          </h1>

          <p className="mt-3 max-w-2xl text-white/60">
            See admin price offers and scheduled inspection dates for your
            submitted items.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <PackageSearch className="mx-auto text-black/40" size={48} />

            <h2 className="mt-4 text-2xl font-black text-black">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-black/50">
              When you submit an item and admin sends an offer or schedules
              inspection, it will show here.
            </p>

            <Link
              href="/sell"
              className="mt-6 inline-flex rounded-full bg-[#FFA500] px-6 py-3 font-black text-black hover:bg-[#FFC107]"
            >
              Submit Item
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {requests.map((request) => {
              const latestOffer = getLatestOffer(request);
              const firstImage =
                request.images?.[0]?.url ||
                request.images?.[0] ||
                "/placeholder.png";

              const hasAppointment = !!request.appointment?.date;

              return (
                <div
                  key={request._id}
                  className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-[140px_1fr_auto]"
                >
                  <div className="h-36 overflow-hidden rounded-3xl bg-[#FFC107]/20">
                    <img
                      src={firstImage}
                      alt={request.gadgetName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase text-white">
                        {request.status?.replaceAll("_", " ")}
                      </span>

                      <span className="rounded-full bg-[#FFC107]/30 px-3 py-1 text-xs font-black uppercase text-black">
                        Trials {request.negotiationCount || 0}/3
                      </span>

                      {latestOffer?.sellerResponse === "pending" && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase text-red-700">
                          Action Needed
                        </span>
                      )}

                      {hasAppointment && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
                          Inspection Scheduled
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-black">
                      {request.gadgetName}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-black/60">
                      {request.gadgetDescription ||
                        request.faultsAccessoriesReason ||
                        "No description provided"}
                    </p>

                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="flex items-center gap-2 text-xs font-black uppercase text-black/40">
                          <Tag size={14} />
                          Your Asking Price
                        </p>

                        <p className="mt-1 text-lg font-black text-black">
                          ₦
                          {Number(
                            request.sellerAskingPrice || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#FFC107]/20 p-4">
                        <p className="flex items-center gap-2 text-xs font-black uppercase text-black/40">
                          <MessageSquare size={14} />
                          Admin Offer
                        </p>

                        {latestOffer ? (
                          <>
                            <p className="mt-1 text-lg font-black text-black">
                              ₦
                              {Number(
                                latestOffer.adminOfferPrice || 0
                              ).toLocaleString()}
                            </p>

                            <p className="mt-1 text-xs font-bold uppercase text-black/50">
                              Response: {latestOffer.sellerResponse}
                            </p>
                          </>
                        ) : (
                          <p className="mt-1 flex items-center gap-2 text-sm font-bold text-black/50">
                            <Clock size={14} />
                            Waiting for admin
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl bg-green-50 p-4">
                        <p className="flex items-center gap-2 text-xs font-black uppercase text-green-700">
                          <CalendarDays size={14} />
                          Scheduled Date
                        </p>

                        {hasAppointment ? (
                          <>
                            <p className="mt-1 text-sm font-black text-black">
                              {formatDate(request.appointment.date)}
                            </p>

                            {request.appointment.location && (
                              <p className="mt-1 text-xs font-bold text-black/50">
                                {request.appointment.location}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm font-bold text-black/50">
                            Not scheduled yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center md:justify-end">
                    <Link
                      href={`/sell-requests/${request._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] md:w-auto"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}