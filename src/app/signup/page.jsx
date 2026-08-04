"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Google signup failed");
        return;
      }

      router.push("/store");
      router.refresh();
    } catch (error) {
      console.error("GOOGLE_SIGNUP_ERROR:", error);
      alert("Something went wrong during Google signup");
    } finally {
      setLoading(false);
    }
  };

  async function handleEmailSignup(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Name, email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Signup failed.");
        return;
      }

      router.push("/store");
      router.refresh();
    } catch (error) {
      console.error("EMAIL_SIGNUP_ERROR:", error);
      alert("Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <Loader2 size={50} className="animate-spin text-[#FFA500]" />

              <h3 className="mt-4 text-xl font-black text-black">
                Signing You In...
              </h3>

              <p className="mt-2 text-center text-sm font-semibold text-black/60">
                Preparing your StudentShop account.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen bg-gradient-to-br from-[#FFA500] via-[#FFC107] to-white px-4 py-8">
        <div className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
          <section className="hidden lg:block">
            <h1 className="text-6xl font-black leading-tight text-black">
              Join StudentShop Nigeria.
            </h1>

            <p className="mt-5 max-w-lg text-lg font-medium leading-8 text-black/70">
              Create an account to buy, sell, negotiate, inspect and checkout
              gadgets safely.
            </p>

            <div className="mt-8 rounded-[2rem] bg-black/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/50">
                Secure Access
              </p>
              <p className="mt-2 text-lg font-black text-black">
                You must sign in before accessing the store.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-[#FFC107]">
              <ShoppingBag size={30} />
            </div>

            <h2 className="text-center text-3xl font-black text-black">
              Create Account
            </h2>

            <p className="mt-2 text-center text-sm font-semibold text-black/50">
              Sign up to access the StudentShop store.
            </p>

            <div className="mt-8 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google signup failed")}
                theme="outline"
                size="large"
                text="continue_with"
                shape="pill"
              />
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-black/35">
                or
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Full name"
                className="h-14 w-full rounded-2xl border border-black/10 px-4 text-sm font-semibold text-black outline-none focus:border-[#FFA500]"
              />

              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Email address"
                className="h-14 w-full rounded-2xl border border-black/10 px-4 text-sm font-semibold text-black outline-none focus:border-[#FFA500]"
              />

              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="Phone number"
                className="h-14 w-full rounded-2xl border border-black/10 px-4 text-sm font-semibold text-black outline-none focus:border-[#FFA500]"
              />

              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="Password"
                className="h-14 w-full rounded-2xl border border-black/10 px-4 text-sm font-semibold text-black outline-none focus:border-[#FFA500]"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#FFA500] text-sm font-black text-black transition hover:bg-[#FFC107] disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-black/60">
              Already have an account?{" "}
              <Link href="/signin" className="font-black text-[#FFA500]">
                Login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
