import { redirect } from "next/navigation";
import SellItemForm from "../components/SellItemForm";
import { getCurrentUser } from "../lib/getCurrentUser";

export default async function SellPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-12">
      <section className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFA500]">
          Student Shop Nigeria
        </p>

        <h1 className="mt-3 text-4xl font-black text-black md:text-5xl">
          Sell, Swap, or Trade In Your Item
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-black/60">
          Fill the form below. You must be signed in before submitting any item
          for sale, swap, or trade-in.
        </p>
      </section>

      <section className="mt-10">
        <SellItemForm />
      </section>
    </main>
  );
}