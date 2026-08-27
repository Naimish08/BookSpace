import React from 'react';

export const metadata = {
  title: 'Community Guidelines | BookSpace',
  description: 'BookSpace Community Guidelines — Fostering a respectful, cozy reading space.',
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#FDE8BE] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-[#BA7FCB]/30">
        <h1 className="text-3xl font-bold text-[#462C90] mb-6 font-merriweather">
          📜 Community Guidelines
        </h1>
        <p className="text-gray-600 text-sm mb-6">Building a safe and inspiring sanctuary for readers everywhere.</p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">1. Be Kind & Respectful</h2>
            <p>
              Literature brings diverse perspectives. Treat every community member with respect, empathy, and kindness in chat channels, book clubs, and blog comments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">2. Respect Book Swap Agreements</h2>
            <p>
              When participating in book exchanges, handle shared books with care and return or pass them along in a timely manner.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">3. No Spam or Self-Promotion</h2>
            <p>
              Keep chats and comment sections focused on meaningful literary discussions. Commercial spam or aggressive self-promotion is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#462C90] mb-2">4. Zero Tolerance for Harassment</h2>
            <p>
              Hate speech, discrimination, harassment, or non-consensual messaging will result in immediate suspension from the BookSpace platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
