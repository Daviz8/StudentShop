import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { getCurrentUser } from "../lib/getCurrentUser";
import {
  BatteryCharging,
  Building2,
  Grid3X3,
  Headphones,
  Home,
  Laptop,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";

const categories = [
  { label: "All", value: "all", icon: Grid3X3 },
  { label: "Gadgets", value: "Gadget", icon: Zap },
  { label: "Accessories", value: "Accessories", icon: Wrench },
  { label: "Phones", value: "Phones", icon: Smartphone },
  { label: "Powerbanks", value: "Powerbanks", icon: BatteryCharging },
  { label: "Audio", value: "Audio", icon: Headphones },
  { label: "Laptops", value: "Laptops", icon: Laptop },
  { label: "Home Essentials", value: "Home Essentials", icon: Home },
  { label: "Properties", value: "properties", icon: Building2 },
];

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return [];
  }
}

export default async function StorePage({ searchParams }) {
  const user = await getCurrentUser();
  const products = await getProducts();

  // Await searchParams for compatibility with Next.js 15+
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.category || "all";

  // Filter products by selected category
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() === activeCategory.toLowerCase() ||
            product.itemType?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
                Student Shop
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">
                Available Gadgets
              </h1>

              <p className="mt-3 text-white/60">
                {user
                  ? `Welcome ${user.name}`
                  : "Browse gadgets and sign in to buy or sell"}
              </p>
            </div>

            {!user ? (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/signup"
                  className="w-full rounded-full border border-white px-6 py-3 text-center font-black transition hover:bg-white hover:text-black sm:w-auto"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="w-full rounded-full bg-[#FFA500] px-6 py-3 text-center font-black text-black transition hover:bg-[#FFC107] sm:w-auto"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/cart"
                  className="w-full rounded-full bg-[#FFA500] px-6 py-3 text-center font-black text-black transition hover:bg-[#FFC107] sm:w-auto"
                >
                  Cart
                </Link>

                <Link
                  href="/sell"
                  className="w-full rounded-full border border-white px-6 py-3 text-center font-black transition hover:bg-white hover:text-black sm:w-auto"
                >
                  Sell
                </Link>

                <form action="/api/auth/logout" method="POST">
                  <button className="w-full rounded-full border border-white/30 px-6 py-3 text-center font-black transition hover:bg-white hover:text-black sm:w-auto">
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Bar Section */}
      <section className="border-b border-black/10 bg-[#f8f8f8] px-6 py-4">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive =
              activeCategory.toLowerCase() === cat.value.toLowerCase();

            return (
              <Link
                key={cat.value}
                href={cat.value === "all" ? "?" : `?category=${cat.value}`}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-black transition ${
                  isActive
                    ? "border-[#FFA500] bg-[#FFA500] text-black shadow-sm"
                    : "border-black/10 bg-white text-black/70 hover:border-[#FFA500] hover:text-black"
                }`}
              >
                <Icon className="size-4" />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {!user && (
          <div className="mb-8 rounded-3xl bg-[#FFC107]/20 p-6">
            <p className="font-bold text-black">
              Sign in to add products to cart, checkout or sell items.
            </p>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-[#FFC107]/10 p-10 text-center">
            <p className="font-bold text-black">
              No products available in this category
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}