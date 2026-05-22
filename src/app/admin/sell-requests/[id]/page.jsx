"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Phone,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

export default function AdminSellRequestDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.url || "";
  };

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `₦${amount.toLocaleString()}`;
  };

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

  const sendOffer = async () => {
    if (!offerPrice || Number(offerPrice) <= 0) {
      alert("Enter a valid offer price");
      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(`/api/admin/user-sales/${id}/offer`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerPrice,
          message: offerMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send offer");
      }

      alert(data.message || "Offer sent successfully");
      setOfferPrice("");
      setOfferMessage("");
      await loadItem();
    } catch (err) {
      alert(err.message || "Failed to send offer");
    } finally {
      setActionLoading(false);
    }
  };

  const scheduleAppointment = async () => {
    if (!appointmentDate || !appointmentLocation) {
      alert("Appointment date and location are required");
      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(`/api/admin/user-sales/${id}/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: appointmentDate,
          location: appointmentLocation,
          note: appointmentNote,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to schedule appointment");
      }

      alert(data.message || "Appointment scheduled successfully");
      setAppointmentDate("");
      setAppointmentLocation("");
      setAppointmentNote("");
      await loadItem();
    } catch (err) {
      alert(err.message || "Failed to schedule appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const markBought = async () => {
    const confirmed = confirm("Mark this item as bought and remove it?");
    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/admin/user-sales/${id}/mark-bought`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to mark as bought");
      }

      alert(data.message || "Item marked as bought");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      alert(err.message || "Failed to mark item as bought");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectItem = async () => {
    const confirmed = confirm("Reject and delete this request?");
    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/admin/user-sales/${id}/reject`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to reject item");
      }

      alert(data.message || "Item rejected successfully");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      alert(err.message || "Failed to reject item");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin" size={20} />
          <p className="font-bold text-black">Loading request...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto text-red-600" size={42} />
          <h1 className="mt-4 text-2xl font-black text-black">
            Could not load request
          </h1>
          <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 font-black text-white"
          >
            Back to Admin
          </Link>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10">
        <p className="font-bold text-black">Request not found</p>
      </main>
    );
  }

  const images = item.images || [];
  const canSendOffer =
    !["offer_accepted", "appointment_scheduled", "bought", "rejected"].includes(
      item.status
    ) && Number(item.negotiationCount || 0) < 3;

  const canScheduleAppointment = item.status === "offer_accepted";
  const canCompleteInspection = item.status === "appointment_scheduled";

  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 font-black text-black"
        >
          <ArrowLeft size={18} />
          Back to admin
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FFA500]">
                    Trade-In Request
                  </p>

                  <h1 className="mt-2 text-3xl font-black text-black">
                    {item.gadgetName}
                  </h1>

                  <p className="mt-2 text-sm leading-relaxed text-black/60">
                    {item.gadgetDescription ||
                      item.faultsAccessoriesReason ||
                      "No description provided"}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-black px-4 py-2 text-xs font-black uppercase text-white">
                  {item.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Seller"
                  value={item.sellerName}
                  icon={<UserRound size={16} />}
                />
                <InfoItem
                  label="Phone"
                  value={item.sellerPhone}
                  icon={<Phone size={16} />}
                />
                <InfoItem
                  label="Asking Price"
                  value={formatMoney(item.sellerAskingPrice)}
                />
                <InfoItem
                  label="Negotiation Trials"
                  value={`${item.negotiationCount || 0}/3`}
                />
                <InfoItem label="Email" value={item.sellerEmail || "N/A"} />
                <InfoItem label="City / Area" value={item.cityArea || "N/A"} />
                <InfoItem label="ID Type" value={item.idType || "N/A"} />
                <InfoItem
                  label="Category"
                  value={
                    item.otherCategory ||
                    item.category?.replaceAll("_", " ") ||
                    "N/A"
                  }
                />
                <InfoItem
                  label="Condition"
                  value={item.condition?.replaceAll("_", " ") || "N/A"}
                />
                <InfoItem
                  label="Brand / Model"
                  value={item.brandModel || "N/A"}
                />
                <InfoItem
                  label="Colour / Variant"
                  value={item.colorVariant || "N/A"}
                />
                <InfoItem
                  label="Serial / IMEI"
                  value={item.serialOrImei || "N/A"}
                />
              </div>
            </div>

            {images.length > 0 && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon size={20} />
                  <h2 className="text-xl font-black text-black">
                    Uploaded Images
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
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
                          className="h-64 w-full object-cover transition hover:scale-105"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-black">
                Customer Trade-In Details
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Return Preference"
                  value={item.returnPreference?.replaceAll("_", " ") || "N/A"}
                />
                <InfoItem
                  label="Desired Item"
                  value={item.desiredItem || "N/A"}
                />
                <InfoItem
                  label="Top-Up Amount"
                  value={formatMoney(item.topUpAmount)}
                />
                <InfoItem
                  label="Heard From"
                  value={item.heardFrom?.replaceAll("_", " ") || "N/A"}
                />
                <InfoItem
                  label="Referral Code"
                  value={item.referralCode || "N/A"}
                />
                <InfoItem
                  label="Referred By"
                  value={item.referredBy || "N/A"}
                />
              </div>

              {item.additionalNotes && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-black/40">
                    Additional Notes
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-black/70">
                    {item.additionalNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-black">
                Negotiation History
              </h2>

              <div className="mt-4 space-y-3">
                {item.negotiations?.length > 0 ? (
                  item.negotiations.map((negotiation) => (
                    <div
                      key={negotiation._id}
                      className="rounded-2xl border border-black/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-black text-black">
                          Trial {negotiation.trialNumber}
                        </p>

                        <span className="rounded-full bg-[#FFC107]/40 px-3 py-1 text-xs font-black uppercase text-black">
                          {negotiation.sellerResponse}
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-black text-black">
                        {formatMoney(negotiation.adminOfferPrice)}
                      </p>

                      {negotiation.message && (
                        <p className="mt-2 text-sm text-black/60">
                          {negotiation.message}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-black/50">
                    No offer has been sent yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            {canSendOffer && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-black">
                  Send Admin Offer
                </h2>

                <p className="mt-2 text-sm text-black/50">
                  You can send a maximum of 3 offers. Current trial count is{" "}
                  {item.negotiationCount || 0}/3.
                </p>

                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Offer price"
                  className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Optional offer message"
                  className="mt-4 min-h-28 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <button
                  type="button"
                  onClick={sendOffer}
                  disabled={actionLoading}
                  className="mt-4 w-full rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] disabled:opacity-60"
                >
                  {actionLoading ? "Sending..." : "Send Offer"}
                </button>
              </div>
            )}

            {canScheduleAppointment && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} />
                  <h2 className="text-xl font-black text-black">
                    Schedule Inspection
                  </h2>
                </div>

                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <input
                  value={appointmentLocation}
                  onChange={(e) => setAppointmentLocation(e.target.value)}
                  placeholder="Inspection location"
                  className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <textarea
                  value={appointmentNote}
                  onChange={(e) => setAppointmentNote(e.target.value)}
                  placeholder="Optional appointment note"
                  className="mt-4 min-h-24 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <button
                  type="button"
                  onClick={scheduleAppointment}
                  disabled={actionLoading}
                  className="mt-4 w-full rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] disabled:opacity-60"
                >
                  {actionLoading ? "Scheduling..." : "Schedule Appointment"}
                </button>
              </div>
            )}

            {canCompleteInspection && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-black">
                  Inspection Decision
                </h2>

                <p className="mt-2 text-sm text-black/50">
                  After physical inspection, mark the item as bought or reject
                  it.
                </p>

                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={markBought}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-black text-white disabled:opacity-60"
                  >
                    <CheckCircle2 size={18} />
                    Mark as Bought
                  </button>

                  <button
                    type="button"
                    onClick={rejectItem}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 font-black text-white disabled:opacity-60"
                  >
                    <Trash2 size={18} />
                    Reject Item
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] bg-black p-6 text-white shadow-sm">
              <BadgeCheck className="text-[#FFC107]" size={28} />

              <h2 className="mt-3 text-xl font-black">Agreement Status</h2>

              <p className="mt-2 text-sm text-white/60">
                {item.agreedToTerms
                  ? "Customer confirmed ownership and accepted the trade-in terms."
                  : "Customer agreement was not recorded."}
              </p>
            </div>

            <button
              type="button"
              onClick={rejectItem}
              disabled={actionLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 font-black text-white disabled:opacity-60"
            >
              <Trash2 size={18} />
              Reject & Delete Request
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/40">
        {icon}
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold capitalize text-black">
        {value || "N/A"}
      </p>
    </div>
  );
}