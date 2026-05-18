/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export default function AdminSellRequestDetailPage({ params }) {
  const [item, setItem] = useState(null);

  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");

  const [loading, setLoading] = useState(false);

  const id = params?.id;

  const loadItem = async () => {
    try {
      const res = await fetch(`/api/user-sales/${id}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setItem(data.saleRequest);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to load request");
    }
  };

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const sendOffer = async () => {
    if (!offerPrice) {
      return alert("Enter offer price");
    }

    setLoading(true);

    const res = await fetch(
      `/api/admin/user-sales/${id}/offer`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerPrice,
          message: offerMessage,
        }),
      }
    );

    const data = await res.json();

    setLoading(false);

    alert(data.message);

    if (data.success) {
      setOfferPrice("");
      setOfferMessage("");
      loadItem();
    }
  };

  const scheduleAppointment = async () => {
    if (
      !appointmentDate ||
      !appointmentLocation
    ) {
      return alert(
        "Appointment date and location required"
      );
    }

    setLoading(true);

    const res = await fetch(
      `/api/admin/user-sales/${id}/schedule`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          date: appointmentDate,
          location: appointmentLocation,
          note: appointmentNote,
        }),
      }
    );

    const data = await res.json();

    setLoading(false);

    alert(data.message);

    if (data.success) {
      loadItem();
    }
  };

  const markBought = async () => {
    const res = await fetch(
      `/api/admin/user-sales/${id}/mark-bought`,
      {
        method:"PATCH",
      }
    );

    const data = await res.json();

    alert(data.message);

    if (data.success) {
      window.location.href="/admin";
    }
  };

  const rejectItem = async () => {
    const confirmed = confirm(
      "Reject and delete item?"
    );

    if (!confirmed) return;

    const res = await fetch(
      `/api/admin/user-sales/${id}/reject`,
      {
        method:"PATCH",
      }
    );

    const data = await res.json();

    alert(data.message);

    if (data.success) {
      window.location.href="/admin";
    }
  };

  if (!item) {
    return (
      <main className="min-h-screen bg-white p-10">
        <p className="font-bold">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-10">

      <section className="mx-auto max-w-5xl">

        <a
          href="/admin"
          className="mb-6 inline-block font-black"
        >
          ← Back to admin
        </a>

        {/* DETAILS */}

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row justify-between">

            <div>

              <h1 className="text-4xl font-black">
                {item.gadgetName}
              </h1>

              <p className="mt-2 text-black/60">
                {item.gadgetDescription}
              </p>

              <div className="mt-5 grid gap-2 text-sm">

                <p>
                  <strong>Seller:</strong>{" "}
                  {item.sellerName}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {item.sellerPhone}
                </p>

                <p>
                  <strong>Asking Price:</strong>
                  ₦
                  {Number(
                    item.sellerAskingPrice
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Condition:</strong>{" "}
                  {item.condition}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {item.status}
                </p>

                <p>
                  <strong>Negotiation:</strong>{" "}
                  {item.negotiationCount}/3
                </p>

              </div>

            </div>

            <button
              onClick={rejectItem}
              className="h-fit rounded-full bg-black px-5 py-3 font-black text-white hover:bg-red-600"
            >
              Reject & Delete
            </button>

          </div>

        </div>

        {/* IMAGE GALLERY */}

        {item.images?.length > 0 && (

          <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-black text-black">
              Uploaded Pictures
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">

              {item.images.map((image,index)=>(

                <a
                  key={image.publicId || index}
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-3xl bg-[#FFC107]/20 block"
                >

                  <img
                    src={image.url}
                    alt={item.gadgetName}
                    className="h-64 w-full object-cover transition hover:scale-105"
                  />

                </a>

              ))}

            </div>

          </div>

        )}

        {/* NEGOTIATION HISTORY */}

        <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-black">
            Negotiation History
          </h2>

          <div className="mt-4 grid gap-3">

            {item.negotiations?.length===0 ? (

              <p>No offer sent yet.</p>

            ) : (

              item.negotiations?.map(
                (negotiation)=>(

                <div
                  key={negotiation._id}
                  className="rounded-2xl border p-4"
                >

                  <div className="flex justify-between">

                    <p className="font-black">
                      Trial{" "}
                      {negotiation.trialNumber}
                    </p>

                    <span className="rounded-full bg-[#FFC107] px-3 py-1 text-xs font-black">

                      {negotiation.sellerResponse}

                    </span>

                  </div>

                  <p className="mt-3 text-xl font-black">

                    ₦
                    {Number(
                      negotiation.adminOfferPrice
                    ).toLocaleString()}

                  </p>

                  {negotiation.message && (

                    <p className="mt-2 text-sm text-black/60">
                      {negotiation.message}
                    </p>

                  )}

                </div>

              ))

            )}

          </div>

        </div>

        {/* Keep your remaining offer/schedule/buy sections below unchanged */}

      </section>

    </main>
  );
}