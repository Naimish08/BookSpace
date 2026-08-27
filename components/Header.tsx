// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { createClient } from "@/utils/superbase/client";
import { User } from "@supabase/supabase-js";

/**
 * Navigation Header Component for BookSpace.
 * Manages responsive mobile navigation drawer and active Supabase user session state.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Listen to Supabase auth session changes on component mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Base navigation links accessible to all visitors
  const baseLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/club", label: "Club" },
    { href: "/join-us", label: "Join Us" },
    { href: "/writers", label: "Writers" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about-us", label: "About Us" },
  ];

  // Dynamic link collection depending on authenticated session status
  const links = user
    ? [...baseLinks, { href: "/chat", label: "Chat" }, { href: "/profile", label: "Profile" }]
    : [...baseLinks, { href: "/login-signup", label: "Sign in" }];

  return (
    <header className="container mx-auto py-4 px-4">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <h1 className="text-2xl font-serif font-bold text-[#a87c9f]">
          Book<span className="text-[#8d6e63]">Space</span>
        </h1>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          {!loading &&
            links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors"
              >
                {label}
              </Link>
            ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#8d6e63]"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Links */}
      {isMenuOpen && (
        <nav className="flex flex-col mt-4 space-y-3 md:hidden">
          {!loading &&
            links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#8d6e63] hover:text-[#a87c9f] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          {loading && <span className="text-[#8d6e63]">Loading...</span>}
        </nav>
      )}
    </header>
  );
}

