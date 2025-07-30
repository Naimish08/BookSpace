"use client";
import { useState } from "react";

export default function Writers() {
  const [activeTab, setActiveTab] = useState("vision");
  const [showFact, setShowFact] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "FORMAT":
        return "Feel free to unleash your creative forces and let the flow of writing take you on a literary journey. There are few things we would love to hear from you. You can check that out on the google form before writing your blog. We ask you for your social media account where you showcase your creativity so readers can connect with you. Personal information like hobbies or passion can be added if you want readers to connect with you on a deeper level.";
      case "CONTENT":
        return "The purpose of this blog is to bring forth personal stories and original, strategic ideas to be a platform where each member can voice out themselves. The content may be anything as long as it is something you like. You can share something you like, you’re good at or anything that you would like to share with readers.";
      case "CRITERIA":
        return "Any blog above 300 words and below 2000 words is considered. We encourage original writing that is AI- free. We also encourage profanity-free writing that is free of vulgarity. If you’re article is within the criteria, we will reach out to you within 2 weeks for confirmation.";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full font-serif bg-[#FDE8BE] text-[#5D2F1C] min-h-screen">
      {/* ABOUT US heading with full-width brown background */}
      <div className="w-full bg-[#945D49] py-6 flex justify-center items-center">
        <h1 className="font-caveat text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] leading-tight text-white text-center">
          BOOKSPACE BLOG
        </h1>
      </div>

      {/* BOOKSPACE SUBHEADING with decor */}
      <div className="flex flex-col items-center justify-center mt-6 mb-6 w-full px-4">
        <div className="flex items-center justify-center w-full max-w-[600px]">
          <div className="h-2 w-12 sm:w-20 bg-[#9C5C44] mr-2 sm:mr-8"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] text-center whitespace-nowrap">
            CHECK THIS BLOG OUT
          </h2>
          <div className="h-2 w-12 sm:w-20 bg-[#9C5C44] ml-2 sm:ml-8"></div>
        </div>
      </div>

      {/* top blog */}
      <div className="relative bg-[#9C5C44] p-2 rounded-lg mt-4 mb-14 w-[90%] max-w-[500px] mx-auto overflow-hidden h-[250px] sm:h-[300px] md:h-[350px]">
        <img
          src="/writer2.jpg"
          alt="writer Background"
          className="rounded-lg w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Latest Blog Button */}
      <div className="flex justify-center mb-10">
        <a
          href="https://medium.com/@bookspace/latest"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#B9745A] text-white px-6 py-2.5 rounded-full font-bold shadow-md 
      hover:bg-[#945D49] hover:transform hover:scale-105 transition-all duration-300 
      flex items-center gap-2 group"
        >
          Read Latest Blog
          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </a>
      </div>

      {/* INTRO */}
      <div className="flex flex-col items-center text-center py-10 w-[90%]">
        <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] border-b-4 border-[#9C5C44] mb-6">
          BOOKSPACE ON MEDIUM
        </h2>
        <div className="bg-[#B9745A] rounded-[30px] px-6 py-6 w-full lg:w-[60%] text-left text-white shadow-md relative">
          <p className="mb-4 text-lg md:text-xl font-semibold text-center">
            BookSpace Blog is a community blog where writers can share personal stories and unique articles. Write to share your heart. Write to heal the world.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://medium.com/@bookspace" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#FDE8BE] text-[#311E17] px-6 py-2.5 rounded-full font-bold shadow-md 
                hover:bg-[#945D49] hover:text-white transition-all duration-300 
                flex items-center gap-2 group"
            >
              Visit Our Blog
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* SPEAK YOUR VOICE */}
      <div className="flex flex-col items-center text-center py-10 w-[90%]">
        <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] border-b-4 border-[#9C5C44] mb-6">
          SPEAK YOUR VOICE
        </h2>
        <div className="bg-[#B9745A] rounded-[30px] px-6 py-6 w-full lg:w-[60%] text-left text-white shadow-md relative">
          <p className="mb-4 text-lg md:text-xl font-semibold">
            Write your heart and brain out, one blog at a time. BookSpace invites you to write a personal story or an orignal article bringing new ideas to the world through our community blog
          </p>
          <div className="relative flex flex-col items-center">
            {/* Scattered text elements */}
            <span className="absolute top-[1px] sm:top-[-5px] left-[-2%] sm:left-[5%] transform rotate-6 text-[#FDE8BE] font-caveat text-sm sm:text-xl md:text-2xl opacity-80 z-20">
              Creative Thinking
            </span>
            <span className="absolute bottom-[-10px] sm:bottom-[-5px] right-[2%] sm:right-[5%] transform rotate-6 text-[#FDE8BE] font-caveat text-sm sm:text-xl md:text-2xl opacity-80 z-20">
              Personal Stories
            </span>
            <span className="absolute top-[40%] sm:top-[30%] right-[-5px] sm:right-[-10px] transform rotate-6 text-[#FDE8BE] font-caveat text-sm sm:text-xl md:text-2xl opacity-80 z-20">
              <span className="block sm:inline">Groundbreaking</span>{" "}
              <span className="block sm:inline">Ideas</span>
            </span>
            <span className="absolute bottom-[50%] sm:bottom-[40%] left-[-5px] sm:left-[-20px] transform -rotate-6 text-[#FDE8BE] font-caveat text-sm sm:text-xl md:text-2xl opacity-80 z-20">
              Connecting Minds
            </span>
            
            {/* Existing image */}
            <img
              src="/color-bulb.jpg"
              alt="color bulb"
              className="w-[200px] md:w-[250px] rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105 relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Write with us text */}
      <div className="text-center mb-12">
        <h2 className="font-caveat font-bold italic text-[40px] sm:text-[4px] md:text-[40px] text-[#AC6F59] leading-tight mb-4">
          Write Your Blog With Us Today
        </h2>
        <a 
          href="mailto:bookspaceconnect@gmail.com"
          className="font-literata font-medium text-[#361313] text-lg sm:text-xl md:text-2xl hover:text-[#AC6F59] transition-colors duration-300"
        >
          Email at bookspaceconnect@gmail.com
        </a>
      </div>

      {/* BLOG GUIDELINES */}
      <div
        className="w-full py-24 px-4 flex flex-col items-center"
        style={{
          backgroundImage: "url('/writer-blog.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#FDE8BE] rounded-lg opacity-90 blur-sm z-0" />
          <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-[#311E17] relative z-10 px-4">
            BLOG GUIDELINES
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row w-[90%] lg:w-3/4 bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col text-left font-merriweather font-semibold w-full lg:w-1/4">
            {["FORMAT", "CONTENT", "CRITERIA"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 border-b-2 lg:border-b-0 lg:border-r-2 border-[#9C5C44] text-left transition-all duration-300 ${
                  activeTab === tab ? "text-[#BA7FCB] font-bold" : "text-black"
                } hover:bg-[#FDE8BE] hover:text-[#704CAA]`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="w-full lg:w-3/4 p-6 text-[#5D2F1C]">
            {renderTabContent()}
          </div>
        </div>
      </div>

    </div>
  );
}