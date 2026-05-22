"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
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
        alert(data.message || "Google signup failed");
        return;
      }

      router.push("/store");
      router.refresh();
    } catch (error) {
      alert("Something went wrong during Google signup");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFA500] via-[#FFC107] to-white px-4 py-8">
      <div className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <h1 className="text-6xl font-black leading-tight text-black">
            Join Student Shop Nigeria.
          </h1>

          <p className="mt-5 max-w-lg text-lg font-medium text-black/70">
            Create an account to buy, sell, negotiate, inspect and checkout
            gadgets safely.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-[#FFC107]">
            <ShoppingBag size={30} />
          </div>

          <h2 className="text-center text-3xl font-black text-black">
            Create Account
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

          <p className="mt-6 text-center text-sm text-black/50">
            Already have an account?{" "}
            <Link href="/signup" className="font-black text-black">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
