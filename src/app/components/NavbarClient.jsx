"use client";

import Link from "next/link";
import { Menu, X, ShoppingCart, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarClient({ user }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isLoggedIn = !!user;

  const closeMenu = () => {
    setOpen(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setOpen(false);
    router.push("/signin");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-black">
          Student<span className="text-[#FFA500]">Shop</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-semibold text-black transition hover:text-[#FFA500]"
          >
            Home
          </Link>

          <Link
            href="/store"
            className="font-semibold text-black transition hover:text-[#FFA500]"
          >
            Store
          </Link>

          <Link
            href="/contact"
            className="font-semibold text-black transition hover:text-[#FFA500]"
          >
            Contact
          </Link>

          {isLoggedIn && (
            <Link
              href="/sell"
              className="font-semibold text-black transition hover:text-[#FFA500]"
            >
              Sell
            </Link>
          )}

          <Link
            href={isLoggedIn ? "/cart" : "/signin"}
            className="flex items-center gap-2 rounded-full bg-[#FFA500] px-4 py-2 font-black text-black transition hover:bg-[#FFC107]"
          >
            <ShoppingCart size={18} />
            Cart
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-2">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <UserRound size={18} />
                )}

                <span className="max-w-[120px] truncate text-sm font-bold text-black">
                  {user?.name || "Account"}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-bold text-black transition hover:bg-black hover:text-white"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="rounded-full border border-black/10 px-5 py-2 font-bold text-black transition hover:bg-black hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-black px-5 py-2 font-bold text-white transition hover:bg-[#FFA500] hover:text-black"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-xl border border-black/10 p-2 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-black/10 bg-white px-6 py-5 md:hidden">
          <div className="space-y-3">
            <Link
              href="/"
              className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              href="/store"
              className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
              onClick={closeMenu}
            >
              Store
            </Link>

            <Link
              href="/contact"
              className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
              onClick={closeMenu}
            >
              Contact
            </Link>

            {isLoggedIn && (
              <Link
                href="/sell"
                className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
                onClick={closeMenu}
              >
                Sell
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/cart" : "/signin"}
              className="flex items-center gap-2 rounded-2xl bg-[#FFA500] px-4 py-3 font-black text-black hover:bg-[#FFC107]"
              onClick={closeMenu}
            >
              <ShoppingCart size={18} />
              Cart
            </Link>

            <div className="border-t border-black/10 pt-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-black px-4 py-3 text-white">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <UserRound size={20} />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">
                        {user?.name || "Account"}
                      </p>

                      {user?.email && (
                        <p className="truncate text-xs text-white/60">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 font-black text-black hover:bg-black hover:text-white"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    href="/signin"
                    className="rounded-2xl border border-black/10 px-4 py-3 text-center font-black text-black"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="rounded-2xl bg-black px-4 py-3 text-center font-black text-white"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}