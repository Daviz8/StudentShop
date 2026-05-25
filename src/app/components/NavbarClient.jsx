




"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PackagePlus,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAIN_ADMIN_EMAIL = "okorowhyme234@gmail.com";

export default function NavbarClient({ user }) {
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  const router = useRouter();

  const isLoggedIn = !!user;

  const isAdmin =
    user?.role === "admin" ||
    String(user?.email || "").trim().toLowerCase() === MAIN_ADMIN_EMAIL;

  const closeMenu = () => {
    setOpen(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setOpen(false);
    setNotificationOpen(false);
    router.push("/signup");
    router.refresh();
  };

  const loadAdminNotifications = async () => {
    if (!isAdmin) return;

    try {
      const res = await fetch("/api/user-sales", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("LOAD_ADMIN_NOTIFICATIONS_ERROR:", error);
    }
  };

  const loadUserNotifications = async () => {
    if (!isLoggedIn || isAdmin) return;

    try {
      const res = await fetch("/api/user-sales/mine", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("LOAD_USER_NOTIFICATIONS_ERROR:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminNotifications();
      return;
    }

    loadUserNotifications();
  }, [isLoggedIn, isAdmin]);

  const adminNotifications = useMemo(() => {
    return requests
      .filter((request) =>
        [
          "submitted",
          "negotiating",
          "counter_price_sent",
          "offer_accepted",
          "appointment_scheduled",
        ].includes(request.status)
      )
      .map((request) => {
        const latestOffer =
          request.negotiations?.length > 0
            ? request.negotiations[request.negotiations.length - 1]
            : null;

        return {
          id: request._id,
          title: request.gadgetName || "Submitted item",
          sellerName: request.sellerName || "Customer",
          status: request.status || "submitted",
          latestOffer,
          createdAt: request.createdAt,
        };
      });
  }, [requests]);

  const userNotifications = useMemo(() => {
    return requests.map((request) => {
      const latestOffer =
        request.negotiations?.length > 0
          ? request.negotiations[request.negotiations.length - 1]
          : null;

      const hasPendingOffer = latestOffer?.sellerResponse === "pending";

      const hasAppointment =
        request.appointment?.date &&
        ["appointment_scheduled", "inspection_passed", "bought"].includes(
          request.status
        );

      return {
        id: request._id,
        title: request.gadgetName,
        status: request.status,
        latestOffer,
        hasPendingOffer,
        hasAppointment,
        appointment: request.appointment,
        createdAt: request.createdAt,
      };
    });
  }, [requests]);

  const activeNotifications = isAdmin ? adminNotifications : userNotifications;

  const unreadCount = isAdmin
    ? adminNotifications.length
    : userNotifications.filter(
        (item) => item.hasPendingOffer || item.hasAppointment
      ).length;

  const formatMoney = (value) => {
    return `₦${Number(value || 0).toLocaleString()}`;
  };

  const formatDate = (value) => {
    if (!value) return "No date yet";

    return new Date(value).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (isAdmin) {
    return (
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="text-2xl font-black tracking-tight text-black"
          >
            Student<span className="text-[#FFA500]">Shop</span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/"
              className="font-semibold text-black transition hover:text-[#FFA500]"
            >
              Home
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-full bg-[#FFA500] px-4 py-2 font-black text-black transition hover:bg-[#FFC107]"
            >
              <PackagePlus size={17} />
              Product Upload
            </Link>

            <Link
              href="/admin"
              className="relative flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-black text-black transition hover:bg-black hover:text-white"
            >
              <LayoutDashboard size={17} />
              Dashboard

              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen((prev) => !prev);
                  loadAdminNotifications();
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-[#FFC107]/20"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-14 w-[380px] overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <div>
                      <h3 className="font-black text-black">
                        Admin Notifications
                      </h3>

                      <p className="text-xs font-semibold text-black/50">
                        User trade-in requests and counter prices
                      </p>
                    </div>

                    <Link
                      href="/admin"
                      onClick={() => setNotificationOpen(false)}
                      className="text-xs font-black text-[#e09200]"
                    >
                      View dashboard
                    </Link>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {activeNotifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Clock className="mx-auto text-black/30" size={32} />

                        <p className="mt-3 text-sm font-bold text-black">
                          No new requests
                        </p>

                        <p className="mt-1 text-xs text-black/50">
                          User submissions will appear here.
                        </p>
                      </div>
                    ) : (
                      activeNotifications.slice(0, 6).map((item) => (
                        <Link
                          key={item.id}
                          href={`/admin/sell-requests/${item.id}`}
                          onClick={() => setNotificationOpen(false)}
                          className="block border-b border-black/5 p-5 transition hover:bg-[#FFC107]/10"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate font-black text-black">
                                {item.title}
                              </p>

                              <p className="mt-1 truncate text-xs font-bold text-black/50">
                                From: {item.sellerName}
                              </p>
                            </div>

                            <span className="rounded-full bg-[#FFC107]/30 px-3 py-1 text-[10px] font-black uppercase text-black">
                              {item.status?.replaceAll("_", " ")}
                            </span>
                          </div>

                          {item.status === "submitted" && (
                            <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-black/60">
                              New item submitted for admin review.
                            </p>
                          )}

                          {item.status === "counter_price_sent" &&
                            item.latestOffer?.counterPrice > 0 && (
                              <div className="mt-3 rounded-2xl bg-[#FFC107]/20 p-3">
                                <p className="flex items-center gap-2 text-xs font-black uppercase text-black/40">
                                  <MessageSquare size={14} />
                                  User Counter Price
                                </p>

                                <p className="mt-1 text-lg font-black text-black">
                                  {formatMoney(item.latestOffer.counterPrice)}
                                </p>

                                {item.latestOffer.counterMessage && (
                                  <p className="mt-1 text-xs font-semibold text-black/50">
                                    {item.latestOffer.counterMessage}
                                  </p>
                                )}
                              </div>
                            )}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white">
              <ShieldCheck size={17} className="text-[#FFC107]" />

              <span className="text-sm font-black">Admin</span>
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

          <button
            type="button"
            className="rounded-xl border border-black/10 p-2 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

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
                href="/admin/products"
                className="flex items-center gap-2 rounded-2xl bg-[#FFA500] px-4 py-3 font-black text-black hover:bg-[#FFC107]"
                onClick={closeMenu}
              >
                <PackagePlus size={18} />
                Product Upload
              </Link>

              <Link
                href="/admin"
                className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 font-black text-black hover:bg-[#FFC107]/20"
                onClick={closeMenu}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </span>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="rounded-2xl bg-black px-4 py-3 text-white">
                <div className="flex items-center gap-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || "Admin"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <ShieldCheck size={22} className="text-[#FFC107]" />
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">
                      {user?.name || "Admin"}
                    </p>

                    <p className="truncate text-xs text-white/60">
                      {user?.email}
                    </p>

                    <p className="mt-1 text-xs font-black text-[#FFC107]">
                      Main Admin
                    </p>
                  </div>
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
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-black">
          Student<span className="text-[#FFA500]">Shop</span>
        </Link>

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
            href="/properties"
            className="font-semibold text-black transition hover:text-[#FFA500]"
          >
            Properties
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

          {isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen((prev) => !prev);
                  loadUserNotifications();
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-[#FFC107]/20"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-14 w-[380px] overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <div>
                      <h3 className="font-black text-black">Notifications</h3>

                      <p className="text-xs font-semibold text-black/50">
                        Admin offers and inspection schedules
                      </p>
                    </div>

                    <Link
                      href="/my-requests"
                      onClick={() => setNotificationOpen(false)}
                      className="text-xs font-black text-[#e09200]"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {activeNotifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Clock className="mx-auto text-black/30" size={32} />

                        <p className="mt-3 text-sm font-bold text-black">
                          No notifications yet
                        </p>

                        <p className="mt-1 text-xs text-black/50">
                          Admin offers and schedules will appear here.
                        </p>
                      </div>
                    ) : (
                      activeNotifications.slice(0, 5).map((item) => (
                        <Link
                          key={item.id}
                          href={`/sell-requests/${item.id}`}
                          onClick={() => setNotificationOpen(false)}
                          className="block border-b border-black/5 p-5 transition hover:bg-[#FFC107]/10"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate font-black text-black">
                                {item.title}
                              </p>

                              <p className="mt-1 text-xs font-bold uppercase text-black/40">
                                {item.status?.replaceAll("_", " ")}
                              </p>
                            </div>

                            {item.hasPendingOffer ? (
                              <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-black uppercase text-red-700">
                                New Offer
                              </span>
                            ) : item.hasAppointment ? (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase text-green-700">
                                Scheduled
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">
                                Update
                              </span>
                            )}
                          </div>

                          {item.latestOffer ? (
                            <div className="mt-3 rounded-2xl bg-[#FFC107]/20 p-3">
                              <p className="flex items-center gap-2 text-xs font-black uppercase text-black/40">
                                <MessageSquare size={14} />
                                Admin Offer
                              </p>

                              <p className="mt-1 text-lg font-black text-black">
                                {formatMoney(item.latestOffer.adminOfferPrice)}
                              </p>

                              <p className="mt-1 text-xs font-bold text-black/50">
                                Response: {item.latestOffer.sellerResponse}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs font-bold text-black/50">
                                Waiting for admin offer.
                              </p>
                            </div>
                          )}

                          {item.hasAppointment && (
                            <div className="mt-3 rounded-2xl bg-green-50 p-3">
                              <p className="flex items-center gap-2 text-xs font-black uppercase text-green-700">
                                <CalendarDays size={14} />
                                Inspection Date
                              </p>

                              <p className="mt-1 text-sm font-black text-black">
                                {formatDate(item.appointment.date)}
                              </p>

                              {item.appointment.location && (
                                <p className="mt-1 text-xs font-semibold text-black/50">
                                  {item.appointment.location}
                                </p>
                              )}
                            </div>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            href={isLoggedIn ? "/cart" : "/signup"}
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
            <Link
              href="/signup"
              className="rounded-full bg-black px-5 py-2 font-bold text-white transition hover:bg-[#FFA500] hover:text-black"
            >
              Sign Up
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl border border-black/10 p-2 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

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
              href="/properties"
              className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
              onClick={closeMenu}
            >
              Properties
            </Link>

            <Link
              href="/contact"
              className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
              onClick={closeMenu}
            >
              Contact
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/sell"
                  className="block rounded-2xl px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
                  onClick={closeMenu}
                >
                  Sell
                </Link>

                <Link
                  href="/my-requests"
                  className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 font-bold text-black hover:bg-[#FFC107]/20"
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-2">
                    <Bell size={18} />
                    Notifications
                  </span>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <Link
              href={isLoggedIn ? "/cart" : "/signup"}
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
                <Link
                  href="/signup"
                  className="block rounded-2xl bg-black px-4 py-3 text-center font-black text-white"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}