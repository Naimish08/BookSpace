"use client";
import { useState } from "react";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("vision");
  const [showFact, setShowFact] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "vision":
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";
      case "mission":
        return "Our mission is to foster reading culture and empower youth...";
      case "purpose":
        return "We aim to make books accessible and education equitable...";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full font-serif bg-[#FDE8BE] text-[#5D2F1C] min-h-screen">
      {/* ABOUT US heading with full-width brown background */}
      <div className="w-full bg-[#945D49] py-6 flex justify-center items-center">
        <h1 className="font-caveat text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] leading-tight text-white text-center">
          Because reading matters...
        </h1>
      </div>

      {/* BOOKSPACE SUBHEADING with decor */}
      <div className="flex items-center justify-center mt-6 mb-6 w-full">
        <div className="h-2 w-20 bg-[#9C5C44] mr-4 sm:mr-8 md:mr-12 lg:mr-16"></div>
        <div className="h-2 w-20 bg-[#9C5C44] ml-4 sm:ml-8 md:ml-12 lg:ml-16"></div>
      </div>

      {/* Galaxy Animated Section */}
      <div className="relative bg-[#9C5C44] p-2 rounded-lg mt-4 mb-14 w-[90%] max-w-[500px] mx-auto overflow-hidden h-[250px] sm:h-[300px] md:h-[350px]">
        <img
          src="/galaxy.jpg"
          alt="Galaxy Background"
          className="rounded-lg w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center z-30 animate-welcome-text">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-white font-bold text-center">
            Welcome to <br />
            <span className="text-[#BA7FCB]">BookSpace</span>
          </h1>
        </div>
        <img
          src="/book_open.png"
          alt="Closed Book"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[200px] sm:w-[250px] z-20"
          loading="lazy"
        />
      </div>

      {/* OUR VALUES */}
      <div className="w-full py-12 px-4 flex flex-col items-center" style={{ backgroundImage: "url('/our_values_bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#FDE8BE] rounded-lg opacity-90 blur-sm z-0" />
          <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-black relative z-10 px-4">OUR VALUES</h2>
        </div>
        <div className="flex flex-col lg:flex-row w-[90%] lg:w-3/4 bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden">
<div className="flex flex-col text-left font-merriweather font-semibold w-full lg:w-1/4">
  {["vision", "mission", "purpose"].map((tab) => (
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

      {/* OUR STORY */}
      <div className="flex flex-col items-center text-center py-10 w-[90%]">
        <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-black border-b-4 border-[#9C5C44] mb-6">OUR STORY</h2>
        <div className="bg-[#B9745A] rounded-[30px] px-6 py-6 w-full lg:w-[60%] text-left text-white shadow-md relative">
          <p className="mb-4 text-lg md:text-xl font-semibold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</p>
          <div className="relative flex flex-col items-center">
            <img
              src="/our_story.jpg"
              alt="Bookshelf"
              className="w-[200px] md:w-[250px] rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setShowFact(!showFact)}
            />
            {showFact && (
              <div className="absolute -top-[80px] w-[180px] bg-white text-[#5D2F1C] text-sm p-3 rounded-2xl shadow-lg z-20 animate-fade-in">
                Lorem ipsum dolor sit amet, consectetur...
              </div>
            )}
            <div className="mt-4 text-[#5D2F1C] font-bold text-sm md:text-base text-center">
              <span className="text-2xl block">➤</span>
              CLICK TO KNOW FACTS
            </div>
          </div>
        </div>
      </div>

      {/* IMPACTS */}
      <div className="bg-[#9C5C44] rounded-3xl text-white w-[90%] lg:w-3/4 p-6 text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-merriweather font-bold text-black mb-6">IMPACTS MADE</h2>
        <div className="flex flex-col lg:flex-row justify-center gap-6">
          {[
            { value: 246, label: "ACTIVE READERS" },
            { value: 60, label: "BOOK DONATION" },
            { value: 20, label: "CHILDREN EDUCATED" },
          ].map((impact, idx) => (
            <div
              key={idx}
              className="bg-[#D9CFC9] text-[#5D2F1C] rounded-full w-36 h-36 flex flex-col justify-center items-center shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-3xl font-bold">{impact.value}</span>
              <p className="text-center text-sm mt-1">{impact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}