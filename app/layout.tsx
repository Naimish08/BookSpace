<<<<<<< Updated upstream
import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import './globals.css';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
=======
import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Poppins } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Instagram, Facebook, Twitter } from "lucide-react"
import './globals.css'
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-poppins`}>
        {/* Header/Navigation 8d6e63   a87c9f*/}
      <header className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-serif font-bold text-[#a87c9f]">
            Book<span className="text-[#8d6e63]">Space</span>
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Home
          </Link>
          <Link href="/events" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Events
          </Link>
          <Link href="/club" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Club
          </Link>
          <Link href="/join-us" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Join Us
          </Link>
          <Link href="/writers" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Writers
          </Link>
          <Link href="/about-us" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            About Us
          </Link>
          <Link href="/login-signup" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Sign in
          </Link>
          <Link href="/profile" className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors">
            Profile
          </Link>
        </nav>
      </header>
        {children}
        {/* Footer */}
      <footer className="bg-[#b589a8] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BOOKSPACE</h3>
            </div>
            <div>
              <h4 className="font-bold mb-2">Address</h4>
              <p className="text-sm">Dwarkadas J. Sanghvi College of Engineering,</p>
              <p className="text-sm">Vile Parle West,</p>
              <p className="text-sm"> Mumbai-400056</p>

              <h4 className="font-bold mt-4 mb-2">Contact</h4>
              <p className="text-sm">bookspace@gmail.com</p> 
              <p className="text-sm">+91 98765432</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Follow us</h4>
              <div className="flex space-x-4">
                <a href="https://insta_link" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
                </a>
                <a href="https://fb_link" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
  <Facebook size={20} />
  <span className="sr-only">Facebook</span>
</a>

<a href="https://twitter_link" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
  <Twitter size={20} />
  <span className="sr-only">Twitter</span>
</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </body>
    </html>
  )
}


>>>>>>> Stashed changes
