'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

/**
 * ContactForm — Interactive contact & book exchange interest submission form.
 * Persists submissions to the Suggestion table via POST /api/suggestions.
 */
const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contactNo: '',
    idea: 'Interested in Mumbai free book exchange club',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Name and Email are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit form.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-6 p-6 bg-white/90 rounded-2xl border border-green-200 text-center shadow-lg max-w-md w-full">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800">Thank You! 🎉</h3>
        <p className="text-gray-600 mt-2 text-sm">
          We've received your request and will reach out to you shortly about joining the Mumbai book exchange pool!
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="mt-4 border-[#BA7FCB] text-[#BA7FCB] hover:bg-[#BA7FCB] hover:text-white"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 mt-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
          className="w-full bg-white text-gray-800"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full bg-white text-gray-800"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
        <Input
          type="tel"
          name="contactNo"
          value={form.contactNo}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="w-full bg-white text-gray-800"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#BA7FCB] hover:bg-[#8d6584] text-white py-2.5 rounded-lg shadow-md font-semibold transition-all mt-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Submit Details'}
      </Button>
    </form>
  );
};

export default ContactForm;