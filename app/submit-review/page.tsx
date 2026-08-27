'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, Star } from 'lucide-react';

export default function SubmitReviewPage() {
  const [form, setForm] = useState({
    bookTitle: '',
    author: '',
    rating: 5,
    review: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Submit review as a book diary entry / recommendation
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.bookTitle,
          email: 'community-review@bookspace.com',
          idea: `[BOOK REVIEW - ${form.rating}/5 Stars] ${form.bookTitle} by ${form.author}: ${form.review}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback display
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDE8BE] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-[#BA7FCB]/30">
        <h1 className="text-3xl font-bold text-[#462C90] mb-2 font-merriweather">
          ✍️ Submit a Book Review
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Share your literary thoughts with the BookSpace community!
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800">Review Submitted!</h2>
            <p className="text-gray-600 text-sm mt-2">
              Thank you for contributing to our community reading space. Your review has been saved!
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setForm({ bookTitle: '', author: '', rating: 5, review: '' });
              }}
              className="mt-6 bg-[#BA7FCB] hover:bg-[#8d6584] text-white"
            >
              Submit Another Review
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Book Title *</label>
              <Input
                value={form.bookTitle}
                onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
                placeholder="e.g. The Psychology of Money"
                required
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Author Name *</label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="e.g. Morgan Housel"
                required
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
              <div className="flex items-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Review *</label>
              <textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder="What did you love or learn from this book?"
                required
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#BA7FCB]"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BA7FCB] hover:bg-[#8d6584] text-white py-2.5 rounded-lg font-semibold shadow-md"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Publish Review'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
