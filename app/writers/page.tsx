"use client";
import { useState, useEffect } from "react";

export default function Writers() {
  const [activeTab, setActiveTab] = useState("FORMAT");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tabData = {
    FORMAT: {
      icon: "✍️",
      title: "Writing Format",
      content: "Feel free to unleash your creative forces and let the flow of writing take you on a literary journey. There are few things we would love to hear from you. You can check that out on the google form before writing your blog. We ask you for your social media account where you showcase your creativity so readers can connect with you. Personal information like hobbies or passion can be added if you want readers to connect with you on a deeper level."
    },
    CONTENT: {
      icon: "📝",
      title: "Content Guidelines",
      content: "The purpose of this blog is to bring forth personal stories and original, strategic ideas to be a platform where each member can voice out themselves. The content may be anything as long as it is something you like. You can share something you like, you're good at or anything that you would like to share with readers."
    },
    CRITERIA: {
      icon: "✅",
      title: "Submission Criteria",
      content: "Any blog above 300 words and below 2000 words is considered. We encourage original writing that is AI-free. We also encourage profanity-free writing that is free of vulgarity. If your article is within the criteria, we will reach out to you within 2 weeks for confirmation."
    }
  };

  const features = [
    { icon: "💡", title: "Creative Freedom", desc: "Express yourself without limits" },
    { icon: "🌍", title: "Global Reach", desc: "Connect with readers worldwide" },
    { icon: "🤝", title: "Community", desc: "Join a supportive writer network" },
    { icon: "📈", title: "Growth", desc: "Develop your writing skills" },
  ];

  return (
    <div className={`flex flex-col items-center w-full font-serif bg-[#FDE8BE] text-[#5D2F1C] min-h-screen transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#7D4A3A] via-[#945D49] to-[#7D4A3A] py-12 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-6xl">📚</div>
          <div className="absolute bottom-4 right-10 text-6xl">✒️</div>
          <div className="absolute top-1/2 left-1/4 text-4xl">📖</div>
          <div className="absolute top-1/3 right-1/4 text-5xl">✨</div>
        </div>
        <h1 className="font-caveat text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4vw] leading-tight text-white text-center drop-shadow-lg relative z-10">
          BOOKSPACE BLOG
        </h1>
        <p className="text-white/80 text-base sm:text-lg mt-2 font-light tracking-wider">
          Where Stories Come Alive
        </p>
      </div>

      {/* Stats Bar */}
      <div className="w-full bg-[#945D49]/10 py-6 border-b border-[#9C5C44]/20">
        <div className="max-w-6xl mx-auto flex justify-center gap-8 md:gap-16 lg:gap-24 px-4">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#9C5C44]">100+</div>
            <div className="text-sm text-[#5D2F1C]/70">Stories Published</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#9C5C44]">50+</div>
            <div className="text-sm text-[#5D2F1C]/70">Active Writers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#9C5C44]">10K+</div>
            <div className="text-sm text-[#5D2F1C]/70">Monthly Readers</div>
          </div>
        </div>
      </div>

      {/* Featured Blog + About Section - Side by Side */}
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Featured Blog Card */}
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] mb-6 flex items-center gap-3">
              <span className="text-2xl">✨</span> Featured Blog
            </h2>
            <div className="relative bg-gradient-to-br from-[#9C5C44] to-[#7D4A3A] p-3 rounded-2xl overflow-hidden flex-1 min-h-[300px] shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500 z-10 rounded-2xl"></div>
              <img
                src="/writer2.jpg"
                alt="Featured Blog"
                className="rounded-xl w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-5 py-4 shadow-lg">
                  <p className="text-[#311E17] font-semibold text-base md:text-lg">Latest from our community</p>
                  <p className="text-[#5D2F1C]/70 text-sm mt-1">Discover inspiring stories from our writers</p>
                </div>
              </div>
            </div>
            <a
              href="https://medium.com/@bookspace/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 bg-gradient-to-r from-[#B9745A] to-[#945D49] text-white px-8 py-3 rounded-full font-bold shadow-lg 
                hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 
                flex items-center justify-center gap-3 group w-full sm:w-auto sm:self-start"
            >
              <span>Read Latest Blog</span>
              <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
          </div>

          {/* About Section */}
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] mb-6 flex items-center gap-3">
              <span className="text-2xl">📰</span> About BookSpace Blog
            </h2>
            <div className="bg-gradient-to-br from-[#B9745A] to-[#945D49] rounded-2xl p-8 text-white shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>

              <div className="relative z-10">
                <p className="text-lg md:text-xl font-medium leading-relaxed mb-6">
                  BookSpace Blog is a community blog where writers can share personal stories and unique articles.
                </p>
                <p className="text-white/90 italic text-lg mb-8">
                  "Write to share your heart. Write to heal the world."
                </p>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {features.map((f, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                      <span className="text-2xl">{f.icon}</span>
                      <h4 className="font-bold mt-2">{f.title}</h4>
                      <p className="text-sm text-white/80">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://medium.com/@bookspace"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 bg-[#FDE8BE] text-[#311E17] px-8 py-3 rounded-full font-bold shadow-lg 
                  hover:bg-white hover:shadow-xl transition-all duration-300 
                  flex items-center justify-center gap-3 group relative z-10 w-full sm:w-auto sm:self-start"
              >
                <span>Visit Our Blog</span>
                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Speak Your Voice + Write With Us - Full Width */}
      <div className="w-full bg-[#945D49]/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl md:text-4xl font-merriweather font-bold text-[#311E17] mb-6 flex items-center gap-3">
                <span className="text-3xl">🎤</span> Speak Your Voice
              </h2>
              <p className="text-lg md:text-xl text-[#5D2F1C] leading-relaxed mb-8">
                Write your heart and brain out, one blog at a time. BookSpace invites you to write a personal story or an original article bringing new ideas to the world through our community blog.
              </p>

              {/* Topic Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {["💡 Creative Thinking", "📖 Personal Stories", "🚀 Groundbreaking Ideas", "🤝 Connecting Minds", "✨ Self Expression", "🌱 Growth"].map((tag, i) => (
                  <span key={i} className="bg-[#9C5C44]/15 text-[#5D2F1C] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#9C5C44]/25 transition-all duration-300 cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-[#9C5C44]/20 via-[#B9745A]/15 to-[#9C5C44]/20 rounded-2xl p-6 border border-[#9C5C44]/20">
                <h3 className="font-caveat font-bold text-2xl sm:text-3xl text-[#AC6F59] mb-3">
                  ✨ Write Your Blog With Us Today ✨
                </h3>
                <a
                  href="mailto:bookspaceconnect@gmail.com"
                  className="inline-flex items-center gap-2 font-medium text-[#361313] text-lg hover:text-[#AC6F59] transition-all duration-300 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">📧</span>
                  <span className="border-b-2 border-transparent group-hover:border-[#AC6F59] transition-all duration-300">
                    bookspaceconnect@gmail.com
                  </span>
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#9C5C44]/20 to-[#B9745A]/10 rounded-3xl blur-xl"></div>
                <img
                  src="/color-bulb.jpg"
                  alt="Creative ideas"
                  className="w-[250px] md:w-[300px] rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Guidelines - Full Width */}
      <div
        className="w-full py-20 px-4 relative"
        style={{
          backgroundImage: "url('/writer-blog.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block bg-[#FDE8BE] rounded-xl px-8 py-4 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Blog Guidelines
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tabData).map(([key, data]) => (
              <div
                key={key}
                className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 ${activeTab === key ? 'ring-4 ring-[#9C5C44]/50' : ''
                  }`}
                onClick={() => setActiveTab(key)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{data.icon}</span>
                  <h3 className="text-xl font-bold text-[#311E17]">{data.title}</h3>
                </div>
                <p className="text-[#5D2F1C] leading-relaxed">
                  {data.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full bg-gradient-to-r from-[#7D4A3A] via-[#945D49] to-[#7D4A3A] py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-white mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-white/80 mb-6 text-lg">
            Join our growing community of writers and make your voice heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://medium.com/@bookspace"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FDE8BE] text-[#311E17] px-8 py-3 rounded-full font-bold shadow-lg 
                hover:bg-white hover:shadow-xl transition-all duration-300 
                flex items-center justify-center gap-2 group"
            >
              <span>Explore Our Blog</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
            <a
              href="mailto:bookspaceconnect@gmail.com"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold 
                hover:bg-white hover:text-[#945D49] transition-all duration-300 
                flex items-center justify-center gap-2"
            >
              <span>✉️</span>
              <span>Start Writing</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}