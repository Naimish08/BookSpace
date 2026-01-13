// components/Footer.tsx
import React from "react";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer
      className="relative text-white pt-10 pb-24 font-sans bg-[#ba7fcb] bg-[url('/footer-bg.png')] bg-repeat-x bg-[position:bottom_1.5rem_center] bg-[length:auto_4rem] sm:bg-[length:auto_6rem] md:bg-contain"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          {/* 1. Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-4">BOOKSPACE</h3>
            <p className="text-sm">A cozy corner for book lovers & community readers 📚</p>
          </div>

          {/* 2. Discover */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-3">DISCOVER</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about-us">About BookSpace</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/club">Book Club</Link></li>
            </ul>
          </div>

          {/* 3. Support */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-3">SUPPORT</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/submit-review">Submit Review</Link></li>
              <li><Link href="/guidelines">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter + Socials */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <h4 className="text-lg font-semibold mb-3">UPDATES</h4>
            <p className="text-sm mb-4 text-center md:text-left">Get curated recommendations & cozy updates.</p>
            <form className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 rounded-md text-gray-800 w-full sm:w-2/3"
              />
              <Button className="bg-white text-[#ba7fcb] hover:bg-gray-100 w-full sm:w-auto">
                Subscribe
              </Button>
            </form>

            {/* Socials */}
            <div className="mt-6 flex flex-col items-center md:items-start gap-2">
              {/* Email with emoji */}
              <a
                href="mailto:bookspaceconnect@gmail.com"
                className="text-sm hover:text-gray-100 flex items-center gap-1"
                target="_blank"
              >
                <span role="img" aria-label="email">📧</span> bookspaceconnect@gmail.com
              </a>

              {/* Social icons */}
              <div className="flex gap-4 mt-2">
                <a
                  href="https://www.instagram.com/bookspace__"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/bookspace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://medium.com/@bookspace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200"
                >
                  <Image
                    src="/medium-logo2.png"
                    alt="Medium"
                    width={25}
                    height={25}
                  />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-10 border-t border-white/30 pt-4">
        © 2025 <span className="font-semibold">BookSpace</span>. All rights reserved.
      </div>
    </footer>
  );
}
