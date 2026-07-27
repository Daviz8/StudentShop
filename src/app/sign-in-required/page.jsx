import Link from "next/link";
import {
  LockKeyhole,
  ShoppingBag,
  ArrowRight,
  Home,
  UserPlus,
} from "lucide-react";

export const metadata = {
  title: "Sign In Required | StudentShop Nigeria",
  description: "Please sign in to access the StudentShop store.",
};

export default function SignInRequiredPage() {
  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-4 py-10">
      <section className="mx-auto flex min-h-[85vh] max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFC107]">
              <LockKeyhole className="size-4" />
              Store Access Locked
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
              Sign in first
              <br />
              to view the store.
            </h1>

            <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-black/60 sm:text-lg">
              StudentShop protects product access so only signed-in users can
              view available items, add products to cart, and checkout safely.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signin"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#FFA500] px-7 text-sm font-black text-black transition hover:bg-[#FFC107]"
              >
                Sign In Now
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-7 text-sm font-black text-black transition hover:bg-black hover:text-white"
              >
                Create Account
                <UserPlus className="size-4" />
              </Link>
            </div>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 text-sm font-black text-black/50 transition hover:text-black"
            >
              <Home className="size-4" />
              Go back home
            </Link>
          </div>

          <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl">
            <div className="rounded-[2rem] bg-black p-8 text-white">
              <div className="mx-auto flex size-24 items-center justify-center rounded-[2rem] bg-[#FFC107] text-black">
                <ShoppingBag className="size-12" />
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FFC107]">
                  Error 404
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                  Store Not Available
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                  This page is only available after you sign in to your
                  StudentShop account.
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Step 01
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Sign in or create an account
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Step 02
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Browse products and properties
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Step 03
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Add to cart and checkout safely
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}