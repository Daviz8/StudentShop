import Link from "next/link";
import PropertyCard from "../components/PropertyCard";
import { getCurrentUser } from "../lib/getCurrentUser";

async function getProperties() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/properties`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data.properties || [];
}

export default async function PropertiesPage() {
  const user = await getCurrentUser();

  const properties =
    await getProperties();

  return (
    <main className="min-h-screen bg-white">

      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
                Student Shop Properties
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                Buy useful student properties
              </h1>

              <p className="mt-4 max-w-2xl text-white/60">
                Find generators, beds,
                mattresses, tables,
                chairs and student
                essentials.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/store"
                className="rounded-full border border-white px-6 py-3 text-center font-black hover:bg-white hover:text-black"
              >
                Gadgets
              </Link>

              <Link
                href={
                  user
                    ? "/cart"
                    : "/signin"
                }
                className="rounded-full bg-[#FFA500] px-6 py-3 text-center font-black text-black hover:bg-[#FFC107]"
              >
                Cart
              </Link>
            </div>

          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">

        {!user && (
          <div className="mb-8 rounded-3xl bg-[#FFC107]/20 p-6">

            <p className="font-bold text-black">
              Sign in to add
              properties to cart,
              checkout or sell.
            </p>

          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>
            <h2 className="text-3xl font-black">
              Available Properties
            </h2>

            <p className="mt-2 text-black/60">
              Browse all available
              student properties.
            </p>
          </div>

          <Link
            href="/sell"
            className="rounded-full bg-black px-6 py-3 text-white font-black hover:bg-[#FFA500] hover:text-black"
          >
            Sell Your Item
          </Link>

        </div>

        {properties.length===0 ? (

          <div className="rounded-3xl bg-[#FFC107]/10 p-10 text-center">
            No properties available
          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {properties.map(
              (property)=>(
                <PropertyCard
                  key={property._id}
                  property={property}
                  isAuthenticated={
                    !!user
                  }
                />
              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}