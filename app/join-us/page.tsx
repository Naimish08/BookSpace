"use client";

import React from "react";

const CONTACT_EMAIL = "bookspace@gmail.com";

export default function JoinUs() {
  const handleSignUp = () => {
    window.location.href = "/sign-up";
  };

  const handleEmailCV = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=CV Submission - BookSpace Team Application`;
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/bookspace__/", "_blank");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  };

  const openPositions = [
    {
      title: "Videographer",
      description: "Create engaging video content for our community events and social media.",
      type: "Part-time",
    },
    {
      title: "Marketing Intern",
      description: "Help us grow our community through creative marketing strategies.",
      type: "Internship",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-b from-[#FDE8BE] via-[#FFF2CF] to-[#FDE8BE]">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#AC6F59]/20 via-transparent to-[#9D5583]/10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="text-center">
              <h1 className="font-['Caveat'] text-5xl sm:text-6xl lg:text-7xl text-[#311E17] font-bold mb-4 sm:mb-6">
                Join Our Community
              </h1>
              <p className="font-['Literata'] text-lg sm:text-xl lg:text-2xl text-[#361313]/80 max-w-2xl mx-auto leading-relaxed">
                We're building a passionate community of book lovers. Whether you want to be a member or join our team, there's a place for you.
              </p>
            </div>
          </div>
        </section>

        {/* Main CTAs */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Become a Member Card */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-[#AC6F59]/20 hover:shadow-xl hover:border-[#AC6F59]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#AC6F59]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#AC6F59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h2 className="font-['Literata'] text-xl sm:text-2xl font-bold text-[#311E17]">
                  Become a Member
                </h2>
              </div>
              <p className="font-['Merriweather'] text-[#361313]/70 mb-6 leading-relaxed">
                Join our book club and connect with fellow readers. Get access to exclusive events, book exchanges, and community discussions.
              </p>
              <button
                onClick={handleSignUp}
                className="w-full bg-[#AC6F59] hover:bg-[#9D5F4A] text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 font-['Literata']"
                aria-label="Sign up to become a member"
              >
                Sign Up Now
              </button>
            </div>

            {/* Join Our Team Card */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-[#9D5583]/20 hover:shadow-xl hover:border-[#9D5583]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#9D5583]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#9D5583]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-['Literata'] text-xl sm:text-2xl font-bold text-[#311E17]">
                  Join Our Team
                </h2>
              </div>
              <p className="font-['Merriweather'] text-[#361313]/70 mb-6 leading-relaxed">
                Passionate about books and community building? We're looking for creative individuals to help us grow and inspire more readers.
              </p>
              <button
                onClick={handleEmailCV}
                className="w-full bg-[#9D5583] hover:bg-[#8A4A73] text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 font-['Literata']"
                aria-label="Email your CV to join the team"
              >
                Send Your CV
              </button>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-['Literata'] text-2xl sm:text-3xl font-bold text-[#311E17] text-center mb-10">
            Open Positions
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-[#AC6F59]/15 hover:border-[#AC6F59]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-['Literata'] text-lg sm:text-xl font-bold text-[#311E17]">
                    {position.title}
                  </h3>
                  <span className="text-xs font-medium bg-[#AC6F59]/10 text-[#AC6F59] px-3 py-1 rounded-full">
                    {position.type}
                  </span>
                </div>
                <p className="font-['Merriweather'] text-sm sm:text-base text-[#361313]/70 mb-4">
                  {position.description}
                </p>
                <button
                  onClick={handleEmailCV}
                  className="text-[#AC6F59] font-bold text-sm hover:text-[#9D5F4A] transition-colors font-['Literata'] flex items-center gap-1"
                >
                  Apply Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <h2 className="font-['Literata'] text-2xl sm:text-3xl font-bold text-[#311E17] text-center mb-4">
            Meet Our Team
          </h2>
          <p className="font-['Merriweather'] text-[#361313]/70 text-center mb-12 max-w-xl mx-auto">
            A passionate group of individuals working together to build an amazing community for book lovers.
          </p>

          {/* Developers */}
          <div className="mb-12">
            <h3 className="font-['Literata'] text-xl sm:text-2xl font-bold text-[#311E17] text-center mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">💻</span> Developers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Naimish", role: "Lead Developer", image: "/developer1.png" },
                { name: "Arjun", role: "Frontend Developer", image: "/developer2.png" },
                { name: "Priya", role: "Backend Developer", image: "/developer3.jpeg" },
                { name: "Rahul", role: "Full Stack Developer", image: "/developer4.png" },
              ].map((member, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#AC6F59]/15 hover:border-[#AC6F59]/30 hover:shadow-lg transition-all duration-300 text-center group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-[#AC6F59]/30 group-hover:border-[#AC6F59] transition-colors">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-['Literata'] text-base sm:text-lg font-bold text-[#311E17]">{member.name}</h4>
                  <p className="font-['Merriweather'] text-xs sm:text-sm text-[#AC6F59]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Designers */}
          <div className="mb-12">
            <h3 className="font-['Literata'] text-xl sm:text-2xl font-bold text-[#311E17] text-center mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">🎨</span> Designers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Sneha", role: "UI/UX Lead", image: "/placeholder-user.jpg" },
                { name: "Aditya", role: "Graphic Designer", image: "/placeholder-user.jpg" },
                { name: "Kavya", role: "Visual Designer", image: "/placeholder-user.jpg" },
                { name: "Rohan", role: "Brand Designer", image: "/placeholder-user.jpg" },
              ].map((member, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#9D5583]/15 hover:border-[#9D5583]/30 hover:shadow-lg transition-all duration-300 text-center group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-[#9D5583]/30 group-hover:border-[#9D5583] transition-colors">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-['Literata'] text-base sm:text-lg font-bold text-[#311E17]">{member.name}</h4>
                  <p className="font-['Merriweather'] text-xs sm:text-sm text-[#9D5583]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="mb-12">
            <h3 className="font-['Literata'] text-xl sm:text-2xl font-bold text-[#311E17] text-center mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">🎉</span> Events
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Meera", role: "Events Lead", image: "/placeholder-user.jpg" },
                { name: "Vikram", role: "Event Coordinator", image: "/placeholder-user.jpg" },
                { name: "Ananya", role: "Community Manager", image: "/placeholder-user.jpg" },
                { name: "Siddharth", role: "Partnerships", image: "/placeholder-user.jpg" },
              ].map((member, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#6a5730]/15 hover:border-[#6a5730]/30 hover:shadow-lg transition-all duration-300 text-center group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-[#6a5730]/30 group-hover:border-[#6a5730] transition-colors">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-['Literata'] text-base sm:text-lg font-bold text-[#311E17]">{member.name}</h4>
                  <p className="font-['Merriweather'] text-xs sm:text-sm text-[#6a5730]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing */}
          <div>
            <h3 className="font-['Literata'] text-xl sm:text-2xl font-bold text-[#311E17] text-center mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">📢</span> Marketing
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Ishaan", role: "Marketing Lead", image: "/placeholder-user.jpg" },
                { name: "Pooja", role: "Content Strategist", image: "/placeholder-user.jpg" },
                { name: "Karan", role: "Social Media Manager", image: "/placeholder-user.jpg" },
                { name: "Divya", role: "Growth Marketing", image: "/placeholder-user.jpg" },
              ].map((member, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#361313]/15 hover:border-[#361313]/30 hover:shadow-lg transition-all duration-300 text-center group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-[#361313]/30 group-hover:border-[#361313] transition-colors">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-['Literata'] text-base sm:text-lg font-bold text-[#311E17]">{member.name}</h4>
                  <p className="font-['Merriweather'] text-xs sm:text-sm text-[#361313]/70">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Collaborate Section */}
      <section className="bg-[#311E17] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['Literata'] text-2xl sm:text-3xl font-bold text-[#FDE8BE] mb-4">
            Want to Collaborate?
          </h2>
          <p className="font-['Merriweather'] text-[#FDE8BE]/70 mb-8 max-w-xl mx-auto">
            We're always open to partnerships, events, and creative collaborations. Let's connect!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleInstagram}
              className="flex items-center gap-2 bg-transparent border-2 border-[#FDE8BE] text-[#FDE8BE] hover:bg-[#FDE8BE] hover:text-[#311E17] font-bold py-3 px-6 rounded-full transition-all duration-200 font-['Literata']"
              aria-label="Visit our Instagram page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 bg-[#FDE8BE] text-[#311E17] hover:bg-white font-bold py-3 px-6 rounded-full transition-all duration-200 font-['Literata']"
              aria-label="Email us for collaboration"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </button>
          </div>
        </div>
      </section>
    </>
  );
}