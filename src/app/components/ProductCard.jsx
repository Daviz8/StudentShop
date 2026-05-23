"use client";

import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, isAuthenticated }) {
  const router = useRouter();

  const productId = product._id?.toString() || product.id?.toString();

  const image =
    product.images?.[0]?.url || product.images?.[0] || "/placeholder.png";

  const addToCart = () => {
    if (!isAuthenticated) {
      router.push(`/signin?returnTo=/products/${productId}`);
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
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${productId}`} className="block">
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
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-black text-black">
            ₦{Number(product.price).toLocaleString()}
          </p>

          <p className="text-xs font-bold text-black/50">
            {product.stock} left in stock
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${productId}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-3 text-sm font-black text-black hover:bg-black hover:text-white"
          >
            <Eye size={16} />
          </Link>

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
  );
}
