"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const image =
    product.images?.[0]?.url || product.images?.[0] || "/placeholder.png";

  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const productId = product._id.toString();

    const existingItem = currentCart.find((item) => item.id === productId);

    let updatedCart;

    if (existingItem) {
      updatedCart = currentCart.map((item) => {
        if (item.id === productId) {
          const nextQuantity = Math.min(item.quantity + 1, product.stock);

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
          id: productId,
          name: product.name,
          price: product.price,
          image,
          stock: product.stock,
          quantity: 1,
          condition: product.condition || "verified",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-4 h-48 overflow-hidden rounded-2xl bg-[#FFC107]/20">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <h3 className="text-xl font-black text-black">{product.name}</h3>

      <p className="mt-2 line-clamp-2 text-sm text-black/60">
        {product.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-black text-black">
            ₦{Number(product.price).toLocaleString()}
          </p>

          <p className="text-xs font-bold text-black/50">
            {product.stock} left in stock
          </p>
        </div>

        <button
          onClick={addToCart}
          disabled={product.stock < 1}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFA500] px-5 py-3 text-sm font-black text-black hover:bg-[#FFC107] disabled:opacity-50"
        >
          <ShoppingCart size={16} />
          Add
        </button>
      </div>
    </div>
  );
}