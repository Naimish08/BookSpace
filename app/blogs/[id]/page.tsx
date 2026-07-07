"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPostDetail {
  id: string;
  title: string;
  content: string;
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

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#FDE8BE]">
      <Skeleton className="h-[400px] w-full bg-[#E1B5EE]/30" />
      <div className="max-w-3xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <Skeleton className="h-10 w-3/4 bg-[#E1B5EE]/30" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-5 w-32 bg-[#E1B5EE]/30" />
            <Skeleton className="h-5 w-28 bg-[#E1B5EE]/30 ml-auto" />
          </div>
          <Skeleton className="h-px w-full bg-[#E1B5EE]/30" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-4 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-4 w-5/6 bg-[#E1B5EE]/30" />
            <Skeleton className="h-4 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-4 w-3/4 bg-[#E1B5EE]/30" />
            <Skeleton className="h-4 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-4 w-2/3 bg-[#E1B5EE]/30" />
          </div>
        </div>
      </div>
    </main>
  );
}

function NotFoundState() {
  return (
    <main className="min-h-screen bg-[#FDE8BE] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-[#E1B5EE]/30 flex items-center justify-center">
          <svg
            className="h-14 w-14 text-[#BA7FCB]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-[#241943] mb-2">
          Post Not Found
        </h2>
        <p className="text-[#483285] mb-8 max-w-md mx-auto">
          The blog post you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/blogs">
          <Button className="bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943] rounded-xl px-8 h-11 font-semibold">
            Back to Blog
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blogs/${params.id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch blog post:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) return <LoadingSkeleton />;
  if (notFound || !post) return <NotFoundState />;

  const authorName =
    post.author.name || post.author.username || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const contentParagraphs = post.content
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  return (
    <main className="min-h-screen bg-[#FDE8BE]">
      {/* Cover Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full overflow-hidden"
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#241943] via-[#462C90] to-[#BA7FCB]" />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241943]/80 via-[#241943]/30 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={() => router.push("/blogs")}
            className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-xl h-10 px-4 font-medium border border-white/20"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
        </div>

        {/* Title over the cover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {post.title}
            </motion.h1>
          </div>
        </div>
      </motion.div>

      {/* Content Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Author Info Bar */}
          <div className="px-6 sm:px-10 py-6 border-b border-[#E1B5EE]/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#462C90] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {authorInitial}
              </div>
              <div>
                <p className="font-semibold text-[#241943]">{authorName}</p>
                <p className="text-sm text-[#BA7FCB]">
                  {formatDate(post.created_at)}
                  {post.updated_at !== post.created_at && (
                    <span className="text-[#E1B5EE] ml-2">
                      · Updated {formatDate(post.updated_at)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="px-6 sm:px-10 py-8">
            {post.excerpt && (
              <p className="text-lg text-[#483285] font-medium mb-8 italic border-l-4 border-[#BA7FCB] pl-4">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-lg max-w-none">
              {contentParagraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-[#241943]/80 leading-relaxed mb-6 text-base sm:text-lg"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-10 py-6 bg-[#FDE8BE]/30 border-t border-[#E1B5EE]/30">
            <div className="flex items-center justify-between">
              <Link href="/blogs">
                <Button
                  variant="ghost"
                  className="text-[#462C90] hover:text-[#241943] hover:bg-[#E1B5EE]/20 rounded-xl font-semibold"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  All Posts
                </Button>
              </Link>
              <p className="text-sm text-[#BA7FCB]">
                Published on BookSpace Blog
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
