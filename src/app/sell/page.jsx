import SellItemForm from "../components/SellItemForm";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-12">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFA500]">
          Sell Your Gadget
        </p>

        <h1 className="mt-3 text-4xl font-black text-black md:text-5xl">
          Upload your gadget and negotiate with admin.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-black/60">
          The admin can send a maximum of three price offers. If no price is
          accepted after three trials, the item is rejected and removed.
        </p>
      </section>

      <section className="mt-10">
        <SellItemForm />
      </section>
    </main>
  );
}
