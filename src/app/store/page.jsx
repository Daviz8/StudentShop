import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { getCurrentUser } from "../lib/getCurrentUser";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();

  return data.products || [];
}

export default async function StorePage() {
  const user = await getCurrentUser();

  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
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

      <section className="mx-auto max-w-7xl px-6 py-12">
        {!user && (
          <div className="mb-8 rounded-3xl bg-[#FFC107]/20 p-6">
            <p className="font-bold text-black">
              Sign in to add products to cart, checkout or sell items.
            </p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-3xl bg-[#FFC107]/10 p-10 text-center">
            <p className="font-bold">No products available</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
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