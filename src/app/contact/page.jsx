


"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

const services = [
  "We buy quality items from students and families.",
  "We sell affordable gadgets, furniture, and essentials.",
  "We swap useful items to reduce waste and save money.",
  "We repair phones and laptops with fast support.",
];

export default function ContactPage() {
  const formRef = useRef(null);

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  async function sendEmail(event) {
    event.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        type: "error",
        message: "EmailJS is not configured. Check your .env.local file.",
      });
      return;
    }

    try {
      setSending(true);
      setStatus({
        type: "",
        message: "",
      });

      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      });

      setStatus({
        type: "success",
        message: "Message sent successfully. We will get back to you soon.",
      });

      formRef.current?.reset();
    } catch (error) {
      console.error("EMAILJS_SEND_ERROR:", error);

      setStatus({
        type: "error",
        message: "Message failed to send. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative overflow-hidden bg-[#FFC107]/20">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#FFA500]/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#FFC107]/35 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
              <Sparkles size={15} className="text-[#FFA500]" />
              Student Shop Nigeria
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-black sm:text-5xl">
              Get what you need with the little you have.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-black/65">
              Student Shop Nigeria makes transitions affordable and stress-free.
              We buy, sell, swap, and repair quality items so students and
              families can move forward without waste or financial strain.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 font-black text-white transition hover:bg-[#FFA500] hover:text-black"
              >
                Contact Us
                <Send size={18} />
              </a>

              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-4 font-black text-black shadow-sm transition hover:bg-[#FFC107]"
              >
                Learn More
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {services.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-black/10 bg-white p-4 text-sm font-bold leading-6 text-black/65 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <HeroMedia />
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#FFA500]">
            About Us
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-black">
            We make student transitions easier.
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-black/65 sm:text-base sm:leading-8">
            <p>
              Student Shop Nigeria started by observing a real problem. Every
              academic cycle, students graduating and relocating have useful
              items they need to clear quickly.
            </p>

            <p>
              At the same time, incoming students need those same items but
              cannot always afford to buy everything new. We bridge that gap by
              helping people buy, sell, swap, repair, and access quality
              essentials at fair prices.
            </p>

            <p>
              Our mission is simple: help you get what you need with the little
              you have.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <a
              href="tel:08093552314"
              className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:bg-[#FFC107]/20"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-[#FFC107]">
                <Phone size={20} />
              </span>

              <span>
                <span className="block text-sm font-black text-black">
                  Phone
                </span>
                <span className="block text-sm font-bold text-black/55">
                  08093552314
                </span>
              </span>
            </a>

            <a
              href="https://wa.me/2348093552314"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:bg-[#FFC107]/20"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-[#FFC107]">
                <MessageCircle size={20} />
              </span>

              <span>
                <span className="block text-sm font-black text-black">
                  WhatsApp
                </span>
                <span className="block text-sm font-bold text-black/55">
                  Chat with Student Shop Nigeria
                </span>
              </span>
            </a>

            <a
              href="mailto:studentshopng.info@gmail.com"
              className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:bg-[#FFC107]/20"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-[#FFC107]">
                <Mail size={20} />
              </span>

              <span>
                <span className="block text-sm font-black text-black">
                  Email
                </span>
                <span className="block text-sm font-bold text-black/55">
                  studentshopng.info@gmail.com
                </span>
              </span>
            </a>
          </div>
        </div>

        <form
          id="contact-form"
          ref={formRef}
          onSubmit={sendEmail}
          className="rounded-[2rem] border border-black/10 bg-[#FFC107]/15 p-5 shadow-sm sm:p-8"
        >
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-2xl font-black text-black">Send a Message</h3>

            <p className="mt-2 text-sm leading-6 text-black/55">
              Fill the form below and we will get back to you.
            </p>

            {status.message && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm font-bold ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                )}

                {status.message}
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-sm font-black text-black">Name</label>
                <input
                  name="from_name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#FFA500] focus:ring-4 focus:ring-[#FFC107]/30"
                />
              </div>

              <div>
                <label className="text-sm font-black text-black">Email</label>
                <input
                  name="from_email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#FFA500] focus:ring-4 focus:ring-[#FFC107]/30"
                />
              </div>

              <div>
                <label className="text-sm font-black text-black">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="How can we help you?"
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#FFA500] focus:ring-4 focus:ring-[#FFC107]/30"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 font-black text-white transition hover:bg-[#FFA500] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

function HeroMedia() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="group relative overflow-hidden rounded-[2rem] bg-black shadow-2xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/20 via-transparent to-white/20" />

        <div className="absolute left-5 top-5 z-20 rounded-full bg-black/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#FFC107] backdrop-blur">
          Student Shop Nigeria
        </div>

        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 z-20">
            <div className="rounded-2xl border border-white/15 bg-black/80 p-4 shadow-xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">
                Student Shop helps you
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <span className="animate-bounce rounded-2xl bg-[#FFC107] px-4 py-3 text-center text-sm font-black text-black shadow-lg">
                  WE BUY
                </span>

                <span className="animate-bounce rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-black shadow-lg [animation-delay:150ms]">
                  WE SELL
                </span>

                <span className="animate-bounce rounded-2xl bg-[#FFA500] px-4 py-3 text-center text-sm font-black text-black shadow-lg [animation-delay:300ms]">
                  WE SWAP
                </span>

                <span className="animate-bounce rounded-2xl border border-[#FFC107] bg-black px-4 py-3 text-center text-sm font-black text-[#FFC107] shadow-lg [animation-delay:450ms]">
                  WE DASH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-bold text-black/50">
        Buy, sell, swap, repair, and move forward affordably.
      </p>
    </div>
  );
}