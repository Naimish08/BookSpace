"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/utils/superbase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CreateBlogPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPreview, setShowPreview] = useState(false);

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login-signup");
          return;
        }
        setUserId(session.user.id);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login-signup");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    if (!userId) {
      setError("You must be logged in to create a post.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: userId,
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          coverImage: coverImage.trim() || null,
          published,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create blog post.");
      }

      router.push("/blogs");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Auth loading state
  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#FDE8BE]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64 bg-[#E1B5EE]/30" />
            <Skeleton className="h-12 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-12 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-24 w-full bg-[#E1B5EE]/30" />
            <Skeleton className="h-64 w-full bg-[#E1B5EE]/30" />
          </div>
        </div>
      </main>
    );
  }

  const previewParagraphs = content
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  return (
    <main className="min-h-screen bg-[#FDE8BE]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blogs"
            className="inline-flex items-center text-[#462C90] hover:text-[#241943] font-medium mb-4 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-1"
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
            Back to Blog
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#241943] font-merriweather">
            Create a New Post
          </h1>
          <p className="text-[#483285] mt-2">
            Share your thoughts, stories, and book reviews with the BookSpace community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 border border-[#E1B5EE]/20">
                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-3"
                  >
                    <svg
                      className="h-5 w-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-[#241943] font-semibold"
                  >
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter your blog post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 bg-[#FDE8BE]/30 border-[#E1B5EE] focus-visible:ring-[#BA7FCB] rounded-xl text-[#241943] placeholder:text-[#BA7FCB]/50"
                    required
                  />
                </div>

                {/* Cover Image URL */}
                <div className="space-y-2">
                  <Label
                    htmlFor="coverImage"
                    className="text-[#241943] font-semibold"
                  >
                    Cover Image URL{" "}
                    <span className="text-[#BA7FCB] text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="coverImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="h-12 bg-[#FDE8BE]/30 border-[#E1B5EE] focus-visible:ring-[#BA7FCB] rounded-xl text-[#241943] placeholder:text-[#BA7FCB]/50"
                  />
                  {coverImage && (
                    <div className="relative h-32 rounded-xl overflow-hidden mt-2 border border-[#E1B5EE]/30">
                      <Image
                        src={coverImage}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label
                    htmlFor="excerpt"
                    className="text-[#241943] font-semibold"
                  >
                    Excerpt{" "}
                    <span className="text-[#BA7FCB] text-xs font-normal">
                      (optional, max 200 characters)
                    </span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="A short summary of your post..."
                    value={excerpt}
                    onChange={(e) =>
                      setExcerpt(e.target.value.slice(0, 200))
                    }
                    maxLength={200}
                    rows={3}
                    className="bg-[#FDE8BE]/30 border-[#E1B5EE] focus-visible:ring-[#BA7FCB] rounded-xl text-[#241943] placeholder:text-[#BA7FCB]/50 resize-none"
                  />
                  <p className="text-xs text-[#BA7FCB] text-right">
                    {excerpt.length}/200
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="content"
                    className="text-[#241943] font-semibold"
                  >
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here... Use double line breaks to separate paragraphs."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-[#FDE8BE]/30 border-[#E1B5EE] focus-visible:ring-[#BA7FCB] rounded-xl text-[#241943] placeholder:text-[#BA7FCB]/50 resize-y"
                    style={{ minHeight: "300px" }}
                    required
                  />
                </div>

                {/* Published Toggle */}
                <div className="flex items-center gap-3 p-4 bg-[#FDE8BE]/40 rounded-xl border border-[#E1B5EE]/30">
                  <Checkbox
                    id="published"
                    checked={published}
                    onCheckedChange={(checked) =>
                      setPublished(checked as boolean)
                    }
                    className="border-[#462C90] data-[state=checked]:bg-[#462C90] data-[state=checked]:text-white"
                  />
                  <Label
                    htmlFor="published"
                    className="text-[#241943] cursor-pointer"
                  >
                    <span className="font-semibold">
                      {published ? "Publish immediately" : "Save as draft"}
                    </span>
                    <span className="block text-xs text-[#483285]/60 mt-0.5">
                      {published
                        ? "Your post will be visible to everyone right away."
                        : "Your post will be saved but not visible to others."}
                    </span>
                  </Label>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-12 bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943] rounded-xl font-semibold shadow-lg shadow-[#462C90]/25 transition-all hover:shadow-xl hover:shadow-[#241943]/30 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Publishing...
                      </span>
                    ) : published ? (
                      "Publish Post"
                    ) : (
                      "Save Draft"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="lg:hidden h-12 rounded-xl border-[#462C90] text-[#462C90] hover:bg-[#462C90] hover:text-[#E1B5EE] font-semibold"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${showPreview ? "block" : "hidden"} lg:block`}
          >
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#241943]">
                  Live Preview
                </h2>
                <span className="text-xs bg-[#462C90]/10 text-[#462C90] px-3 py-1 rounded-full font-medium">
                  {published ? "Will be published" : "Draft"}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E1B5EE]/20">
                {/* Preview Cover */}
                <div className="relative h-48 overflow-hidden">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#241943] via-[#462C90] to-[#BA7FCB] flex items-center justify-center">
                      <svg
                        className="h-12 w-12 text-white/30"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  <h3
                    className="text-2xl font-bold text-[#241943] mb-3 leading-tight"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {title || "Your Post Title"}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E1B5EE]/30">
                    <div className="h-8 w-8 rounded-full bg-[#462C90] flex items-center justify-center text-white text-sm font-bold">
                      Y
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#241943]">
                        You
                      </p>
                      <p className="text-xs text-[#BA7FCB]">
                        {formatDate(new Date().toISOString())}
                      </p>
                    </div>
                  </div>

                  {/* Excerpt */}
                  {excerpt && (
                    <p className="text-sm text-[#483285] italic mb-4 border-l-4 border-[#BA7FCB] pl-3">
                      {excerpt}
                    </p>
                  )}

                  {/* Content Preview */}
                  {previewParagraphs.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {previewParagraphs.map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-sm text-[#241943]/80 leading-relaxed"
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                          }}
                        >
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#BA7FCB]/50 italic">
                      Your content will appear here as you type...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
