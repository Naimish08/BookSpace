import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BookSpace",
  description: "A community where readers and books are celebrated",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body
          className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-poppins`}
        >
          <header className="bg-[#ffefd0] p-4 flex justify-between items-center">
            <Link href="/" className="text-[#5b3758] text-xl font-bold">
              BookSpace
            </Link>
            <Navbar />
          </header>
          {children}
          <Footer />
        </body>
      </html>
  );
}
