/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from "lucide-react";

export default function CartClient() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const saveCartState = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, amount) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const nextQty = Number(item.quantity) + amount;

        if (nextQty >= 1 && nextQty <= Number(item.stock)) {
          return {
            ...item,
            quantity: nextQty,
          };
        }
      }

      return item;
    });

    saveCartState(updatedCart);
  };

  const removeLineItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCartState(updatedCart);
  };

  const clearEntireCart = () => {
    saveCartState([]);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  const serviceFee = cartItems.length > 0 ? 0 : 0;
  const orderTotal = subtotal + serviceFee;

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Trash2 size={24} />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Your Cart is Empty
          </h2>

          <p className="mb-6 mt-2 text-sm leading-relaxed text-slate-500">
            Looks like you have not selected any verified items yet.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Return to Store
            </Link>

            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#FFC107]"
            >
              View Properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/store")}
          className="group mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to Store
        </button>

        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Your Basket
          </h1>

          <button
            type="button"
            onClick={clearEntireCart}
            className="text-xs font-bold text-red-500 transition hover:text-red-600"
          >
            Clear All Items
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl bg-slate-50 object-cover sm:h-24 sm:w-24"
                  />

                  {item.itemType === "property" && item.images?.length > 1 && (
                    <div className="mt-2 flex gap-1">
                      {item.images.slice(0, 3).map((img, index) => (
                        <img
                          key={`${img}-${index}`}
                          src={img}
                          alt={`${item.name} ${index + 1}`}
                          className="h-8 w-8 rounded-md object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#e09200]">
                    {item.itemType === "property" ? "property" : "gadget"} ·{" "}
                    {item.condition}
                  </span>

                  <h2 className="mt-0.5 truncate text-base font-bold text-slate-800 sm:text-lg">
                    {item.name}
                  </h2>

                  {item.location && (
                    <p className="mt-1 truncate text-xs font-bold text-slate-400">
                      {item.location}
                    </p>
                  )}

                  <p className="mt-1 font-black text-slate-900">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    Stock limit: {item.stock}
                  </p>
                </div>

                <div className="flex self-stretch flex-col items-end justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="rounded-md p-1 text-slate-600 transition hover:bg-white disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-6 text-center text-xs font-black text-slate-800">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                      className="rounded-md p-1 text-slate-600 transition hover:bg-white disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black tracking-tight text-slate-900">
              Order Summary
            </h3>

            <div className="space-y-3 border-b border-slate-100 pb-4 text-sm font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Verification / Escrow Fee</span>
                <span className="font-bold text-slate-800">
                  ₦{serviceFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-6 flex items-baseline justify-between pt-4">
              <span className="text-base font-black text-slate-900">Total</span>
              <span className="text-2xl font-black text-slate-900">
                ₦{orderTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFA500] py-4 text-sm font-black text-black shadow-md shadow-amber-500/10 transition hover:bg-[#e09200] active:scale-[0.99]"
            >
              <CreditCard size={16} />
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
