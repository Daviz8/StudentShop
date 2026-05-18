import { auth } from "../lib/auth";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { Lock } from "lucide-react";

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
  const session = await auth;

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFC107]/10 px-6">
        <section className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-[#FFC107]">
            <Lock size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-black text-black">
            Sign up to use the store
          </h1>

          <p className="mt-3 text-black/60">
            You need to create an account before buying gadgets, adding items to
            cart, or checking out.
          </p>

          <Link
            href="/signup"
            className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#FFA500] px-6 py-4 font-black text-black hover:bg-[#FFC107]"
          >
            Sign up now
          </Link>
        </section>
      </main>
    );
  }

  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
            The best Student Store
          </p>

          <h1 className="mt-3 text-5xl font-black">Available Gadgets and Items</h1>

          <p className="mt-3 text-white/60">
            Welcome, {session.user?.name || session.user?.email}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/cart"
              className="rounded-full bg-[#FFA500] px-5 py-3 font-black text-black hover:bg-[#FFC107]"
            >
              View Cart
            </Link>

            <Link
              href="/sell"
              className="rounded-full border border-white/20 px-5 py-3 font-black text-white hover:bg-white hover:text-black"
            >
              Sell 
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {products.length === 0 ? (
          <div className="rounded-3xl bg-[#FFC107]/10 p-10 text-center">
            <p className="font-bold text-black">No products available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
