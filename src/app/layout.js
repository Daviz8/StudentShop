import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";
import GoogleOAuthProviderWrapper from "./components/GoogleOAuthProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Student Shop Nigeria",
  description:
    "Buy and sell items with live stock tracking and secure checkout",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${montserrat.variable}
        h-full
        antialiased
      `}
    >
      <body className="min-h-screen bg-[#FFFFFF] flex flex-col">
<GoogleOAuthProviderWrapper> 
          <Navbar />
          {/* Main app area */}
          <main className="flex-1 w-full">
            {children}
          </main>
</GoogleOAuthProviderWrapper>
      </body>
    </html>
  );
}