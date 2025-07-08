// components/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/club", label: "Club" },
    { href: "/join-us", label: "Join Us" },
    { href: "/writers", label: "Writers" },
    { href: "/about-us", label: "About Us" },
    { href: "/login-signup", label: "Sign in" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="container mx-auto py-4 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-[#a87c9f]">
          Book<span className="text-[#8d6e63]">Space</span>
        </h1>

        <nav className="hidden md:flex space-x-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#8d6e63]"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col mt-4 space-y-3 md:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
