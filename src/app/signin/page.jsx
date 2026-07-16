"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SignIpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

      if (!data.success) {
        setLoading(false);
        alert(data.message || "Google signup failed");
        return;
      }

      router.push("/store");
      router.refresh();
    } catch (error) {
      setLoading(false);
      alert("Something went wrong during Google signup");
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <Loader2
                size={50}
                className="animate-spin text-[#FFA500]"
              />

              <h3 className="mt-4 text-xl font-black text-black">
                Signing You In...
              </h3>

              <p className="mt-2 text-center text-sm text-black/60">
                Authenticating with Google and preparing your account.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-gradient-to-br from-[#FFA500] via-[#FFC107] to-white px-4 py-8">
        <div className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
          <section className="hidden lg:block">
            <h1 className="text-6xl font-black leading-tight text-black">
             Sign In 
            </h1>

            <p className="mt-5 max-w-lg text-lg font-medium text-black/70">
              Sign in into your account to buy, sell, negotiate, inspect and checkout
              gadgets safely.
            </p>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-[#FFC107]">
              <ShoppingBag size={30} />
            </div>

            <h2 className="text-center text-3xl font-black text-black">
          Sign In 
            </h2>

            <p className="mt-2 text-center text-sm text-black/50">
              Continue with Google to start using the store.
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

          
          </section>
        </div>
      </main>
    </>
  );
}