import AdminSellRequestCard from "../components/AdminSellRequestCard";

async function getSellRequests() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL

  try {
    const res = await fetch(
      `${baseUrl}/api/user-sales`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data.requests || [];
  } catch (error) {
    console.log(error);

    return [];
  }
}

export default async function AdminPage() {
  const requests = await getSellRequests();

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-6 py-10">
      <section className="mx-auto max-w-6xl">

        <div className="mb-8 rounded-[2rem] bg-black p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
            Main Admin
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-white/60">
            Manage seller gadget submissions,
            negotiations,
            appointments,
            inspections,
            and purchases.
          </p>
        </div>

        {requests.length===0 ? (

          <div className="rounded-3xl bg-[#FFC107]/20 p-10 text-center">
            <p className="font-bold text-black">
              No seller requests available
            </p>
          </div>

        ) : (

          <div className="grid gap-5">

            {requests.map((item)=>(
              <AdminSellRequestCard
                key={item._id}
                item={item}
              />
            ))}

          </div>

        )}

      </section>
    </main>
  );
}