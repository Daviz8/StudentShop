"use client";

import { useState } from "react";
import { Eye, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, isAuthenticated }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const productId = product._id?.toString() || product.id?.toString();

  const image =
    product.images?.[0]?.url || product.images?.[0] || "/placeholder.png";

  const addToCart = () => {
    if (!isAuthenticated) {
      router.push("/signup?returnTo=/store");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const cartId = `product-${productId}`;

    const existingItem = currentCart.find((item) => item.id === cartId);

    let updatedCart;

    if (existingItem) {
      updatedCart = currentCart.map((item) => {
        if (item.id === cartId) {
          const nextQuantity = Math.min(
            Number(item.quantity) + 1,
            Number(product.stock)
          );

          return {
            ...item,
            quantity: nextQuantity,
          };
        }

        return item;
      });
    } else {
      updatedCart = [
        ...currentCart,
        {
          id: cartId,
          originalId: productId,
          itemType: "product",
          name: product.name,
          price: Number(product.price),
          image,
          images: [image],
          stock: Number(product.stock),
          quantity: 1,
          condition: product.condition || "verified",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  return (
    <>
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full text-left"
        >
          <div className="mb-4 h-48 overflow-hidden rounded-2xl bg-[#FFC107]/20">
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition hover:scale-105"
            />
          </div>

          <h3 className="text-xl font-black text-black">{product.name}</h3>

          <p className="mt-2 line-clamp-2 text-sm text-black/60">
            {product.description}
          </p>
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-black text-black">
              ₦{Number(product.price).toLocaleString()}
            </p>

            <p className="text-xs font-bold text-black/50">
            Available
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-3 text-sm font-black text-black hover:bg-black hover:text-white"
            >
              <Eye size={16} />
            </button>

            <button
              type="button"
              onClick={addToCart}
              disabled={product.stock < 1}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFA500] px-5 py-3 text-sm font-black text-black hover:bg-[#FFC107] disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              Add
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-black hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="grid gap-0 md:grid-cols-2">
              <div className="min-h-[300px] bg-[#FFC107]/20">
                <img
                  src={image}
                  alt={product.name}
                  className="h-full min-h-[300px] w-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FFA500]">
                  {product.category || "Gadget"}
                </p>

                <h2 className="mt-3 text-3xl font-black text-black">
                  {product.name}
                </h2>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  {product.description || "No description available."}
                </p>

                <div className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-5">
                  <div>
                    <p className="text-xs font-black uppercase text-black/40">
                      Price
                    </p>

                    <p className="mt-1 text-3xl font-black text-black">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-black uppercase text-black/40">
                        Stock
                      </p>

                      <p className="mt-1 font-black text-black">
                        {product.stock} left
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-black uppercase text-black/40">
                        Condition
                      </p>

                      <p className="mt-1 font-black capitalize text-black">
                        {product.condition || "verified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-black/10 px-5 py-4 font-black text-black hover:bg-black hover:text-white"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={product.stock < 1}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] disabled:opacity-50"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>

                {!isAuthenticated && (
                  <p className="mt-4 rounded-2xl bg-[#FFC107]/20 p-4 text-sm font-bold text-black">
                    You can view this product, but you need to sign in before
                    adding it to cart or checking out.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}