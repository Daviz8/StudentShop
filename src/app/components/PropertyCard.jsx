"use client";

import { ShoppingCart, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertyCard({ property, isAuthenticated }) {
  const router = useRouter();

  const images = property.images || [];
  const firstImage = images[0] || "/placeholder.png";
  const secondImage = images[1] || firstImage;
  const thirdImage = images[2] || firstImage;

  const addToCart = () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const propertyId = property._id.toString();
    const cartId = `property-${propertyId}`;

    const existingItem = currentCart.find((item) => item.id === cartId);

    let updatedCart;

    if (existingItem) {
      updatedCart = currentCart.map((item) => {
        if (item.id === cartId) {
          const nextQuantity = Math.min(
            Number(item.quantity) + 1,
            Number(property.stock)
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
          originalId: propertyId,
          itemType: "property",
          name: property.name,
          price: Number(property.price),
          image: firstImage,
          images: [firstImage, secondImage, thirdImage],
          stock: Number(property.stock),
          quantity: 1,
          condition: property.condition || "used",
          location: property.location || "",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid h-64 grid-cols-3 gap-1 bg-[#FFC107]/20 p-1">
        <div className="col-span-2 h-full overflow-hidden rounded-l-[1.6rem]">
          <img
            src={firstImage}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="grid h-full grid-rows-2 gap-1">
          <div className="overflow-hidden rounded-tr-[1.6rem]">
            <img
              src={secondImage}
              alt={`${property.name} second view`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="overflow-hidden rounded-br-[1.6rem]">
            <img
              src={thirdImage}
              alt={`${property.name} third view`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#FFC107]/30 px-3 py-1 text-xs font-black uppercase text-black">
            {property.category}
          </span>

          <span className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase text-white">
            {property.condition?.replace("_", " ")}
          </span>
        </div>

        <h3 className="text-xl font-black text-black">{property.name}</h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/60">
          {property.description}
        </p>

        {property.location && (
          <p className="mt-3 flex items-center gap-2 text-xs font-bold text-black/50">
            <MapPin size={14} />
            {property.location}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-black">
              ₦{Number(property.price).toLocaleString()}
            </p>

            <p className="text-xs font-bold text-black/50">
              {property.stock} available
            </p>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={property.stock < 1}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFA500] px-5 py-3 text-sm font-black text-black transition hover:bg-[#FFC107] disabled:opacity-50"
          >
            <ShoppingCart size={16} />
            {isAuthenticated ? "Add" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
