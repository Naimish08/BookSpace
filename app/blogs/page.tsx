"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
      <Skeleton className="h-48 w-full bg-[#E1B5EE]/30" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-[#E1B5EE]/30" />
        <Skeleton className="h-4 w-full bg-[#E1B5EE]/30" />
        <Skeleton className="h-4 w-5/6 bg-[#E1B5EE]/30" />
        <Skeleton className="h-4 w-2/3 bg-[#E1B5EE]/30" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-8 w-8 rounded-full bg-[#E1B5EE]/30" />
          <Skeleton className="h-4 w-24 bg-[#E1B5EE]/30" />
        </div>
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const gradientPlaceholders = [
  "from-[#462C90] to-[#BA7FCB]",
  "from-[#241943] to-[#483285]",
  "from-[#BA7FCB] to-[#E1B5EE]",
  "from-[#483285] to-[#BA7FCB]",
  "from-[#241943] to-[#462C90]",
];

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#FDE8BE]">
      <div className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[#241943] mb-3 font-merriweather">
            BookSpace Blog
          </h1>
          <p className="text-[#483285] text-lg max-w-2xl mx-auto">
            Stories, insights, and reflections from our community of passionate readers and writers.
          </p>
        </motion.div>

        {/* Search & CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-10 max-w-3xl mx-auto"
        >
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#483285]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-[#E1B5EE] focus-visible:ring-[#BA7FCB] rounded-xl text-[#241943] placeholder:text-[#BA7FCB]/60"
            />
          </div>
          <Link href="/blogs/create">
            <Button className="h-12 px-8 bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943] rounded-xl font-semibold shadow-lg shadow-[#462C90]/25 transition-all hover:shadow-xl hover:shadow-[#241943]/30 whitespace-nowrap">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write a Blog
            </Button>
          </Link>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#E1B5EE]/30 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-[#BA7FCB]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#241943] mb-2">
              {searchQuery ? "No posts found" : "No blog posts yet"}
            </h3>
            <p className="text-[#483285] mb-6">
              {searchQuery
                ? `No posts matching "${searchQuery}". Try a different search.`
                : "Be the first to write one!"}
            </p>
            {!searchQuery && (
              <Link href="/blogs/create">
                <Button className="bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943] rounded-xl px-8 h-11 font-semibold">
                  Write Your First Post
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        {/* Blog Cards Grid */}
        {!loading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => {
              const authorName =
                post.author.name || post.author.username || "Anonymous";
              const authorInitial = authorName.charAt(0).toUpperCase();
              const gradientClass =
                gradientPlaceholders[i % gradientPlaceholders.length];

              return (
                <motion.div
                  key={post.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Link href={`/blogs/${post.id}`} className="block group">
                    <div className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      {/* Cover Image */}
                      <div className="relative h-48 overflow-hidden">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                          >
                            <svg
                              className="h-16 w-16 text-white/30"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h2 className="text-lg font-bold text-[#241943] mb-2 line-clamp-2 group-hover:text-[#462C90] transition-colors">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-sm text-[#483285]/70 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Author & Date */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#E1B5EE]/30">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-[#462C90] flex items-center justify-center text-white text-sm font-bold">
                              {authorInitial}
                            </div>
                            <span className="text-sm font-medium text-[#241943]">
                              {authorName}
                            </span>
                          </div>
                          <span className="text-xs text-[#BA7FCB]">
                            {formatDate(post.created_at)}
                          </span>
                        </div>

                        {/* Read More */}
                        <div className="mt-4 flex items-center text-sm font-semibold text-[#462C90] group-hover:text-[#BA7FCB] transition-colors">
                          Read More
                          <svg
                            className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
