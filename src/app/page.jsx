"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const gadgets = [
  { label: "Laptop", emoji: "💻", top: "-10%", left: "-10%" },
  { label: "Phone", emoji: "📱", top: "-5%", right: "-10%" },
  { label: "Tablet", emoji: "📟", bottom: "-10%", left: "-5%" },
  { label: "Headset", emoji: "🎧", bottom: "-5%", right: "-10%" },
];

export default function Home() {
  const router = useRouter();

  const randomRoute = () => {
    const routes = ["/store", "/properties"];
    const randomIndex = Math.floor(Math.random() * routes.length);
    router.push(routes[randomIndex]);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#FFA500] via-[#FFC107] to-[#f59e0b] text-black">
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 py-10 lg:grid lg:grid-cols-2 lg:gap-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_45%)]"
        />

        {/* LEFT CONTENT */}
        <div className="relative z-20 order-2 mt-8 text-center lg:order-1 lg:mt-0 lg:text-left">

          {/* TOP BADGES */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold text-[#FFC107]"
            >
              Student Shop Nigeria
            </motion.p>
          </div>

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-5xl font-black leading-tight tracking-tight md:text-6xl font-Mont"
          >
            Buy, Sell, Swap
            <br />
            Easily.
          </motion.h1>

          {/* TEXT STACK */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="mt-6 space-y-2 text-3xl font-black text-black md:text-5xl font-Mont"
          >
            {["WE BUY", "WE SELL", "WE SWAP", "WE DASH"].map((text) => (
              <motion.div
                key={text}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  show: { opacity: 1, x: 0 },
                }}
                className="drop-shadow-sm"
              >
                {text}
              </motion.div>
            ))}
          </motion.div>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mx-auto mt-5 max-w-xl text-base font-medium text-black/80 lg:mx-0 font-Mont"
          >
            A fast student-focused marketplace for gadgets,
            properties, swaps, verified sales, inspections,
            secure payments, and delivery.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <button
              onClick={() => router.push("/signup")}
              className="cursor-pointer rounded-2xl bg-black px-8 py-4 text-base font-black text-white shadow-xl transition hover:scale-105"
            >
              Get Started
            </button>

            <button
              onClick={randomRoute}
              className="cursor-pointer rounded-2xl border-2 border-black bg-white/80 px-8 py-4 text-base font-black text-black shadow-xl backdrop-blur transition hover:scale-105"
            >
              Explore Marketplace
            </button>
          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: [0, -14, 0],
          }}
          transition={{
            opacity: { duration: 0.7 },
            scale: { duration: 0.7 },
            rotate: { duration: 0.7 },
            y: {
              delay: 1,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="relative z-20 order-1 mx-auto flex w-full max-w-md justify-center lg:order-2"
        >
          {gadgets.map((item, index) => (
            <motion.div
              key={item.label}
              className="absolute z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-xl backdrop-blur md:h-24 md:w-24 md:text-3xl lg:h-28 lg:w-28"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                bottom: item.bottom,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2.5 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.emoji}
            </motion.div>
          ))}

          <img
            src="/images/hero-bg.webp"
            alt="Student Shop Nigeria"
            className="hidden max-h-[300px] w-full max-w-md rounded-md object-contain drop-shadow-2xl md:block"
          />
        </motion.div>
      </section>
    </main>
  );
}