"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function SignInPage() {
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
        alert(data.message || "Google signin failed");
        return;
      }

      router.push("/store");
      router.refresh();
    } catch (error) {
      alert("Something went wrong during Google signin");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFA500] to-[#FFC107]">
      <div className="mx-auto flex min-h-screen max-w-md items-center p-8">
        <section className="w-full rounded-[30px] bg-white p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-3xl bg-black p-5 text-[#FFC107]">
              <LogIn />
            </div>
          </div>

          <h1 className="text-center text-3xl font-black">Welcome Back</h1>

          <p className="mt-2 text-center text-black/50">
            Continue with Google
          </p>

          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google signin failed")}
              theme="outline"
              size="large"
              text="signin_with"
              shape="pill"
            />
          </div>

          <p className="mt-6 text-center text-sm text-black/50">
            New here?{" "}
            <Link href="/signup" className="font-black text-black">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
