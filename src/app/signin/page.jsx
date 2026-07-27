"use client";

import { useState, Suspense } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";

// 1. Move all main form logic into this inner component
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/store";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
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
        alert(data.message || "Google login failed");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("GOOGLE_LOGIN_ERROR:", error);
      alert("Something went wrong during Google login");
    } finally {
      setLoading(false);
    }
  };

  async function handleEmailLogin(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      alert("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Login failed.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("EMAIL_LOGIN_ERROR:", error);
      alert("Something went wrong during login.");
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
                Authenticating your account.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#FFC107] px-4 py-8">
        <div className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
          <section className="hidden lg:block">
            <h1 className="text-6xl font-black leading-tight text-white">
              Welcome back to StudentShop.
            </h1>

            <p className="mt-5 max-w-lg text-lg font-medium leading-8 text-white/70">
              Login to view products, add items to cart, and checkout safely.
            </p>

            <div className="mt-8 rounded-[2rem] bg-white/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FFC107]">
                Protected Store
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Products are only visible to signed-in users.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-[#FFC107]">
              <ShoppingBag size={30} />
            </div>

            <h2 className="text-center text-3xl font-black text-black">
              Login
            </h2>

            <p className="mt-2 text-center text-sm font-semibold text-black/50">
              Sign in before accessing the store.
            </p>

            <div className="mt-8 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google login failed")}
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

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Email address"
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
                {loading ? <Loader2 className="animate-spin" /> : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-black/60">
              No account yet?{" "}
              <Link href="/signup" className="font-black text-[#FFA500]">
                Create account
              </Link>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

// 2. Export default wrapped in a Suspense Boundary
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Loader2 size={50} className="animate-spin text-[#FFA500]" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}