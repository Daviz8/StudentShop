"use client";

import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black">
          StudentShop
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="font-semibold hover:text-[#FFA500]">
            Home
          </Link>

          <Link href="/store" className="font-semibold hover:text-[#FFA500]">
            Store
          </Link>

          <Link href="/contact" className="font-semibold hover:text-[#FFA500]">
            Contact Me
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-[#FFA500] px-4 py-2 font-black"
          >
            <ShoppingCart size={18} />
            Cart
          </Link>

          {/* Fixed Ternary Operator Syntax Here */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="rounded-full border px-4 py-2 font-bold"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/signup"
              className="rounded-full bg-black px-5 py-2 font-bold text-white"
            >
              Signup
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="space-y-4 border-t bg-white p-6 md:hidden">
          <Link href="/" className="block" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link href="/store" className="block" onClick={() => setOpen(false)}>
            Store
          </Link>

          <Link href="/contact" className="block" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <Link href="/cart" className="block" onClick={() => setOpen(false)}>
            Cart
          </Link>
        </div>
      )}
    </nav>
  );
}