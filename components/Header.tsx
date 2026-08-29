// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  MessageSquare,
  Calendar,
  BookOpen,
  Feather,
  Users,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/superbase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Modernized Navigation Header Component for BookSpace.
 * Features categorized dropdowns, user profile avatar menu, and responsive drawer navigation.
 * Styled with BookSpace's signature warm cream (#fde8be) & purple (#5b3758) palette.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const exploreItems = [
    { href: "/events", label: "Events", description: "Book club meetups & workshops", icon: Calendar },
    { href: "/blogs", label: "Blogs", description: "Community stories & reviews", icon: BookOpen },
    { href: "/writers", label: "Writers Spotlight", description: "Author features & submissions", icon: Feather },
  ];

  const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/club", label: "Club" },
    { href: "/about-us", label: "About Us" },
  ];

  const isExploreActive = exploreItems.some((item) => pathname === item.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#5b3758]/15 bg-[#fde8be]/95 backdrop-blur-md transition-all duration-200">
      <div className="container mx-auto flex items-center justify-between py-3.5 px-4 md:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="p-1.5 rounded-xl bg-[#5b3758]/10 text-[#5b3758] group-hover:bg-[#5b3758]/20 transition-colors">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#5b3758] tracking-tight">
            Book<span className="text-[#8d6e63]">Space</span>
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {/* Primary Links */}
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-[#5b3758] ${
              pathname === "/" ? "text-[#5b3758] font-bold" : "text-[#6a5730]"
            }`}
          >
            Home
          </Link>

          <Link
            href="/club"
            className={`text-sm font-medium transition-colors hover:text-[#5b3758] ${
              pathname === "/club" ? "text-[#5b3758] font-bold" : "text-[#6a5730]"
            }`}
          >
            Club
          </Link>

          {/* Explore Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors outline-none hover:text-[#5b3758] ${
                isExploreActive ? "text-[#5b3758] font-bold" : "text-[#6a5730]"
              }`}
            >
              <span>Explore</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl border-[#8d6e63]/25 bg-[#fff2cf] text-[#5b3758] shadow-xl">
              {exploreItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        isActive ? "bg-[#5b3758]/15 text-[#5b3758] font-semibold" : "hover:bg-[#fde8be] text-[#6a5730] hover:text-[#5b3758]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mt-0.5 text-[#9d5583] shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-[#8d6e63]/80">{item.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/about-us"
            className={`text-sm font-medium transition-colors hover:text-[#5b3758] ${
              pathname === "/about-us" ? "text-[#5b3758] font-bold" : "text-[#6a5730]"
            }`}
          >
            About Us
          </Link>
        </nav>

        {/* User Account / Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-[#8d6e63]/20 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#5b3758]/10 transition-colors outline-none focus:ring-2 focus:ring-[#5b3758]/30">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9d5583] to-[#5b3758] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#6a5730] opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-[#8d6e63]/25 bg-[#fff2cf] text-[#5b3758] shadow-xl">
                <DropdownMenuLabel className="font-normal px-2.5 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-semibold text-[#8d6e63]">Signed in as</p>
                    <p className="text-xs text-[#5b3758] font-medium truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#8d6e63]/20" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 p-2 rounded-lg text-sm text-[#5b3758] hover:bg-[#fde8be] cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#9d5583]" />
                    <span>My Profile & Streaks</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/chat"
                    className="flex items-center gap-2.5 p-2 rounded-lg text-sm text-[#5b3758] hover:bg-[#fde8be] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#9d5583]" />
                    <span>Community Chat</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/join-us"
                    className="flex items-center gap-2.5 p-2 rounded-lg text-sm text-[#5b3758] hover:bg-[#fde8be] cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-[#9d5583]" />
                    <span>Join Us / Onboarding</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#8d6e63]/20" />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-sm text-red-600 hover:bg-red-100/50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/join-us"
                className="text-sm font-medium text-[#6a5730] hover:text-[#5b3758] transition-colors"
              >
                Join Us
              </Link>
              <Link
                href="/login-signup"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-[#5b3758] text-[#ffefd0] hover:bg-[#763d77] transition-all shadow-sm active:scale-95"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#5b3758] hover:bg-[#5b3758]/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Links */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#5b3758]/15 bg-[#fde8be] px-4 py-5 shadow-inner transition-all animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-4">
            {/* Primary Section */}
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6e63]">Navigation</span>
              {primaryLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === href
                      ? "bg-[#5b3758]/15 text-[#5b3758] font-bold"
                      : "text-[#6a5730] hover:bg-[#fff2cf]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Explore Section */}
            <div className="flex flex-col space-y-2 pt-2 border-t border-[#8d6e63]/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6e63]">Explore</span>
              {exploreItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-[#5b3758]/15 text-[#5b3758] font-bold"
                        : "text-[#6a5730] hover:bg-[#fff2cf]"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-[#9d5583]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Account Section */}
            <div className="flex flex-col space-y-2 pt-2 border-t border-[#8d6e63]/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6e63]">Account</span>
              {user ? (
                <>
                  <div className="px-3 py-1.5 text-xs text-[#6a5730] bg-[#fff2cf] rounded-md border border-[#8d6e63]/20">
                    Logged in as <span className="font-semibold text-[#5b3758]">{user.email}</span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#5b3758] hover:bg-[#fff2cf]"
                  >
                    <UserIcon className="w-4 h-4 text-[#9d5583]" />
                    <span>My Profile & Streaks</span>
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#5b3758] hover:bg-[#fff2cf]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#9d5583]" />
                    <span>Community Chat</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-100/50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-1">
                  <Link
                    href="/join-us"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-[#6a5730] hover:bg-[#fff2cf]"
                  >
                    Join Us
                  </Link>
                  <Link
                    href="/login-signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-sm font-medium px-4 py-2.5 rounded-lg bg-[#5b3758] text-[#ffefd0] hover:bg-[#763d77] transition-all"
                  >
                    Sign in / Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}



