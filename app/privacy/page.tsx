import React from 'react';

export const metadata = {
  title: 'Privacy Policy | BookSpace',
  description: 'BookSpace Privacy Policy — How we protect your data and reading privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDE8BE] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-[#BA7FCB]/30">
        <h1 className="text-3xl font-bold text-[#462C90] mb-6 font-merriweather">
          🔒 Privacy Policy
        </h1>
        <p className="text-gray-600 text-sm mb-6">Last Updated: August 2026</p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">1. Information We Collect</h2>
            <p>
              When you create an account on BookSpace, we collect basic account information including your email address, username, profile display name, and reading preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">2. How We Use Your Data</h2>
            <p>
              Your information is strictly used to provide core community features: personalizing your reading streaks, facilitating book swaps, displaying community blog posts, and connecting you with fellow book lovers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">3. Direct Messaging & Security</h2>
            <p>
              Private 1:1 direct messages between connected users are delivered using encrypted real-time channels and stored securely in our database. We never sell or distribute your private conversations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">4. Your Control</h2>
            <p>
              You may update your profile details or request account deletion at any time by reaching out to our community team at <span className="font-semibold text-[#462C90]">support@bookspace.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
