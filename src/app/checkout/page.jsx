"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Truck, MapPin, User, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const updateCustomer = (key, value) => {
    setCustomer((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  const escrowFee = cartItems.length > 0 ? 1500 : 0;

  const shippingFee =
    cartItems.length > 0 && deliveryMethod === "standard" ? 3000 : 0;

  const orderTotal = subtotal + escrowFee + shippingFee;

  const payNow = async () => {
    if (!customer.fullName || !customer.email || !customer.phone) {
      alert("Please enter your full name, email and phone number");
      return;
    }

    if (deliveryMethod === "standard" && !customer.address) {
      alert("Please enter your delivery address");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          deliveryMethod,
          shippingFee,
          escrowFee,
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Payment initialization failed");
        return;
      }

      localStorage.setItem("pending_order_id", data.order._id);
      window.location.href = data.payment.authorizationUrl;
    } catch (error) {
      console.error("PAYSTACK_CHECKOUT_ERROR:", error);
      alert("Something went wrong while starting payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <button
            onClick={() => router.push("/cart")}
            className="group mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Return to Basket
          </button>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Checkout
          </h1>

          <div className="mt-8 space-y-8">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-base font-black uppercase tracking-wider text-slate-800">
                <User size={18} className="text-slate-400" />
                Contact Details
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={customer.fullName}
                  onChange={(e) => updateCustomer("fullName", e.target.value)}
                  type="text"
                  placeholder="Full name"
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white focus:ring-1 focus:ring-slate-950"
                />

                <input
                  value={customer.email}
                  onChange={(e) => updateCustomer("email", e.target.value)}
                  type="email"
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white focus:ring-1 focus:ring-slate-950"
                />

                <input
                  value={customer.phone}
                  onChange={(e) => updateCustomer("phone", e.target.value)}
                  type="tel"
                  placeholder="Phone number"
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white focus:ring-1 focus:ring-slate-950 md:col-span-2"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 text-base font-black uppercase tracking-wider text-slate-800">
                <MapPin size={18} className="text-slate-400" />
                Delivery Address
              </h2>

              <textarea
                value={customer.address}
                onChange={(e) => updateCustomer("address", e.target.value)}
                placeholder="Enter your accurate hostel address, lodge name, or off-campus delivery point"
                rows="3"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 text-base font-black uppercase tracking-wider text-slate-800">
                <Truck size={18} className="text-slate-400" />
                Delivery Method
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    value: "standard",
                    title: "Standard Delivery",
                    desc: "1-2 working days",
                  },
                  {
                    value: "pickup",
                    title: "Campus Pickup",
                    desc: "At designated store hub",
                  },
                  {
                    value: "none",
                    title: "None",
                    desc: "No handling required",
                  },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition ${
                      deliveryMethod === method.value
                        ? "border-slate-950 bg-slate-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {method.title}
                      </span>

                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === method.value}
                        onChange={() => setDeliveryMethod(method.value)}
                        className="accent-slate-950"
                      />
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      {method.desc}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="sticky top-24 h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-black tracking-tight text-slate-900">
            Order Summary
          </h2>

          <div className="mb-4 max-h-60 divide-y divide-slate-100 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-800">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-slate-400">
                    Qty: {item.quantity}
                  </p>
                </div>

                <span className="shrink-0 font-black text-slate-900">
                  ₦
                  {(
                    Number(item.price) * Number(item.quantity)
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-b border-slate-100 pb-4 text-sm font-medium text-slate-500">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-800">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Escrow Protection Fee</span>
              <span className="font-bold text-slate-800">
                ₦{escrowFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Cost</span>
              <span className="font-bold text-slate-800">
                {shippingFee > 0 ? `₦${shippingFee.toLocaleString()}` : "Free"}
              </span>
            </div>
          </div>

          <div className="mb-6 flex items-baseline justify-between pt-4">
            <span className="text-base font-black text-slate-900">
              Total Due
            </span>

            <span className="text-2xl font-black text-slate-900">
              ₦{orderTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={payNow}
            disabled={loading || cartItems.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-4 text-sm font-black text-white shadow-md transition hover:bg-green-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            <CheckCircle2 size={16} />
            {loading ? "Starting Payment..." : "Pay"}
          </button>
        </aside>
      </div>
    </main>
  );
}