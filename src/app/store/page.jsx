"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Armchair,
  BatteryCharging,
  BookOpen,
  Building2,
  Grid3X3,
  Headphones,
  Home,
  Laptop,
  Loader2,
  Search,
  ShoppingCart,
  Smartphone,
  Zap,
} from "lucide-react";

const categories = [
  {
    label: "All",
    value: "all",
    icon: Grid3X3,
  },
  {
    label: "Gadgets",
    value: "Gadget",
    icon: Zap,
  },
  {
    label: "Phones",
    value: "Phones",
    icon: Smartphone,
  },
  {
    label: "Powerbanks",
    value: "Powerbanks",
    icon: BatteryCharging,
  },
  {
    label: "Audio",
    value: "Audio",
    icon: Headphones,
  },
  {
    label: "Laptops",
    value: "Laptops",
    icon: Laptop,
  },
  {
    label: "Furniture",
    value: "Furniture",
    icon: Armchair,
  },
  {
    label: "Home Essentials",
    value: "Home Essentials",
    icon: Home,
  },
  {
    label: "Books",
    value: "Books",
    icon: BookOpen,
  },
  {
    label: "Properties",
    value: "properties",
    icon: Building2,
  },
];

function money(value) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

function formatCondition(value) {
  if (!value) return "";

  return String(value).replaceAll("_", " ");
}

export default function StorePage() {
  const router = useRouter();

  const [authChecking, setAuthChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const queryUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (q.trim()) {
      params.set("q", q.trim());
    }

    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }

    return `/api/store?${params.toString()}`;
  }, [q, activeCategory]);

  useEffect(() => {
    let alive = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!alive) return;

        if (!res.ok || !data.success || !data.user) {
          router.replace("/sign-in-required");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("STORE_AUTH_CHECK_ERROR:", error);
        router.replace("/sign-in-required");
      } finally {
        if (alive) {
          setAuthChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    let alive = true;

    async function loadStore() {
      setLoading(true);

      try {
        const res = await fetch(queryUrl, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!alive) return;

        if (!res.ok || !data.success) {
          setItems([]);
          return;
        }

        setItems(data.items || []);
      } catch (error) {
        console.error("LOAD_STORE_ERROR:", error);

        if (alive) {
          setItems([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadStore();

    return () => {
      alive = false;
    };
  }, [queryUrl, authorized]);

  function addToCart(item) {
    const currentCart = JSON.parse(
      localStorage.getItem("student_shop_cart") || "[]"
    );

    const existingIndex = currentCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingIndex >= 0) {
      const currentQuantity = Number(currentCart[existingIndex].quantity || 1);

      if (currentQuantity >= Number(item.stock || 1)) {
        alert("You cannot add more than the available stock.");
        return;
      }

      currentCart[existingIndex].quantity = currentQuantity + 1;
    } else {
      currentCart.push({
        id: item.id,
        originalId: item.originalId,
        itemType: item.itemType,
        name: item.name,
        price: item.price,
        image: item.images?.[0] || "",
        quantity: 1,
      });
    }

    localStorage.setItem("student_shop_cart", JSON.stringify(currentCart));

    alert("Added to cart.");
  }

  if (authChecking || !authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-4">
        <section className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-[#FFA500]" size={44} />

          <h1 className="mt-5 text-2xl font-black text-black">
            Checking Access...
          </h1>

          <p className="mt-2 text-sm font-semibold text-black/50">
            Please wait while we confirm your account.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <section className="bg-black px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FFC107]">
            StudentShop Nigeria
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Everything students need,{" "}
            <span className="text-[#FFA500]">all in one place.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/65">
            Search products, gadgets, phones, audio devices, furniture,
            properties and student-friendly essentials.
          </p>

          <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 shadow-xl">
            <Search className="ml-3 size-5 text-black/40" />

            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search phones, powerbanks, audio, properties..."
              className="h-12 flex-1 bg-transparent text-sm font-bold text-black outline-none placeholder:text-black/35"
            />

            <button
              type="button"
              className="hidden h-12 rounded-xl bg-[#FFA500] px-6 text-sm font-black text-black transition hover:bg-[#FFC107] sm:inline-flex sm:items-center"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 bg-white px-4 py-5">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto pb-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={[
                  "flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-black transition",
                  active
                    ? "border-[#FFA500] bg-[#FFA500] text-black"
                    : "border-black/10 bg-white text-black/65 hover:border-[#FFA500] hover:text-black",
                ].join(" ")}
              >
                <Icon className="size-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-black">
                {categories.find((item) => item.value === activeCategory)
                  ?.label || "Available Items"}
              </h2>

              <p className="mt-1 text-sm font-semibold text-black/50">
                {loading
                  ? "Loading..."
                  : `${items.length} item${items.length === 1 ? "" : "s"} found`}
              </p>
            </div>

            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="w-fit rounded-full border border-black/10 px-4 py-2 text-xs font-black text-black/60 transition hover:bg-black hover:text-white"
              >
                Clear search
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm"
                >
                  <div className="h-48 animate-pulse bg-black/5" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-black/10" />
                    <div className="h-5 w-4/5 animate-pulse rounded-full bg-black/10" />
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-black/10" />
                    <div className="h-10 w-full animate-pulse rounded-2xl bg-black/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 bg-black/5">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm font-black text-black/30">
                        No Image
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-[#FFA500] px-3 py-1 text-xs font-black capitalize text-black">
                      {item.itemType}
                    </div>

                    {Number(item.stock || 0) <= 0 ? (
                      <div className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                        Out of stock
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#FFA500]">
                      {item.category}
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-lg font-black text-black">
                      {item.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-black/55">
                      {item.description}
                    </p>

                    {item.location ? (
                      <p className="mt-2 text-xs font-bold text-black/45">
                        Location: {item.location}
                      </p>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-lg font-black text-black">
                        {money(item.price)}
                      </p>

                      {item.condition ? (
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black capitalize text-black/60">
                          {formatCondition(item.condition)}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-xs font-bold text-black/40">
                      Stock: {item.stock}
                    </p>

                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      disabled={Number(item.stock || 0) <= 0}
                      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-black text-white transition hover:bg-[#FFA500] hover:text-black disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/40"
                    >
                      <ShoppingCart className="size-4" />
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-10 text-center">
              <h3 className="text-2xl font-black text-black">
                No items found
              </h3>

              <p className="mt-2 text-sm font-semibold text-black/50">
                Try searching another item or selecting another category.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
