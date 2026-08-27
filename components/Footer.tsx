// components/Footer.tsx
"use client";

import React, { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Global Page Footer Component.
 * Displays brand bio, quick navigation links, contact support links, newsletter signup form, and social channels.
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };
  return (
    <footer
      className="relative text-white pt-10 pb-24 font-sans bg-[#ba7fcb] bg-[url('/footer-bg.png')] bg-repeat-x bg-[position:bottom_1.5rem_center] bg-[length:auto_4rem] sm:bg-[length:auto_6rem] md:bg-contain"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          {/* 1. Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-4">BOOKSPACE</h3>
            <p className="text-sm">A cozy corner for book lovers & community readers 📚</p>
          </div>

          {/* 2. Discover Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-3">DISCOVER</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about-us">About BookSpace</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/club">Book Club</Link></li>
            </ul>
          </div>

          {/* 3. Support Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-3">SUPPORT</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/submit-review">Submit Review</Link></li>
              <li><Link href="/guidelines">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter Subscription & Social Channels */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <h4 className="text-lg font-semibold mb-3">UPDATES</h4>
            <p className="text-sm mb-4 text-center md:text-left">Get curated recommendations & cozy updates.</p>
            {subscribed ? (
              <p className="text-sm font-semibold text-[#241943] bg-white/90 px-4 py-2 rounded-md">
                Thank you for subscribing! 📚
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-2 rounded-md text-gray-800 w-full sm:w-2/3"
                />
                <Button type="submit" className="bg-white text-[#ba7fcb] hover:bg-gray-100 w-full sm:w-auto">
                  Subscribe
                </Button>
              </form>
            )}

            {/* Social Links & Support Email */}
            <div className="mt-6 flex flex-col items-center md:items-start gap-2">
              <a
                href="mailto:bookspaceconnect@gmail.com"
                className="text-sm hover:text-gray-100 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span role="img" aria-label="email">📧</span> bookspaceconnect@gmail.com
              </a>

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

      {/* Copyright Bar */}
      <div className="text-center text-sm mt-10 border-t border-white/30 pt-4">
        © 2025 <span className="font-semibold">BookSpace</span>. All rights reserved.
      </div>
    </footer>
  );
}

