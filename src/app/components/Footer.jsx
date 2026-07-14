/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { footerLinks } from "../lib";
import { MapPin } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/studentshopnigeria?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    image:"/images/instagram.png",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61577548065457",
    image:"/images/facebook.png"
  },

];

export default function Footer() {
  return (
    <footer className="bg-[#25131d] text-white bg-gray-950">

      <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20 bg-gray-950">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.7fr_1fr] ">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl text-white">
                   <img
              src="/images/hero-bg.webp"
         className="size-11" strokeWidth={2.2}
              alt="studentshop logo"
            /> 
              
              </span>

              <span>
                <span className="block text-2xl font-black tracking-[-0.04em]">
                Student Shop Nigeria Limited
                </span>

                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-[#FFA500]">
                 We Buy • We Sell • We Dash
                </span>
              </span>
            </Link>


            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="grid size-11 place-items-center rounded-full bg-white/5 text-white/70 transition hover:-translate-y-1 hover:bg-[#FF0080] hover:text-white"
                  >
                    <img src={social.image} alt={social.image} />
                  </a>
                );
              })}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.name}>
              <h3 className="text-sm font-black uppercase tracking-[0.17em] text-[#FFA500]">
                {group.name}
              </h3>

              <div className="mt-6 space-y-4">
                {group.subLinks.map((item) => (
                  <Link
                    key={`${group.name}-${item.name}`}
                    href={item.url || "/"}
                    className="group flex items-center gap-2 text-[15px] font-semibold text-white/60 transition hover:text-white"
                  >
                    <span>{item.name}</span>

                    <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
         

            <div className="mt-6 space-y-5">
              
              <p className="flex items-start gap-3 text-[14px] font-semibold leading-6 text-white/60">
                <MapPin className="mt-1 size-4 shrink-0 text-[#FF0080]" />
                    No 5 NYSC road Alakahia, Port Harcourt, Rivers, Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gray-950">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-6 text-center text-xs font-semibold text-white/40 sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <p>
            © {new Date().getFullYear()} Student Shop Nigeria Linited. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 md:justify-end">
         
          </div>
        </div>
      </section>
    </footer>
  );
}