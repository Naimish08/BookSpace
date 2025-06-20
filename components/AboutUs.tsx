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
    <div className="flex flex-col items-center w-full font-serif bg-[#FBE9C7] text-[#5D2F1C]">
      {/* ABOUT US heading with full-width brown background */}
      <div className="w-full bg-[#9C5C44] py-3">
        <h1 className="text-white text-2xl italic text-center">ABOUT US</h1>
      </div>

      {/* BOOKSPACE SUBHEADING with decor */}
      <div className="flex items-center justify-center mt-6 mb-2 w-full">
        <div className="h-2 w-12 bg-[#9C5C44] rounded mr-2"></div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3D1E17] text-center">
          BOOKSPACE<br />WHERE STORIES CONNECT US
        </h2>
        <div className="h-2 w-12 bg-[#9C5C44] rounded ml-2"></div>
      </div>

      {/* Galaxy Animated Section */}
      <div className="relative bg-[#9C5C44] p-2 rounded-lg mt-4 mb-14 w-[90%] max-w-[500px] mx-auto overflow-hidden h-[250px]">
        <img src="/galaxy.jpg" alt="Galaxy Background" className="rounded-lg w-full h-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center z-30 animate-welcome-text">
          <h1 className="text-2xl sm:text-3xl text-white font-bold text-center">
            Welcome to <br />
            <span className="text-purple-300">BookSpace</span>
          </h1>
        </div>

        <img src="/book_open.png" alt="Closed Book" className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[200px] z-20" />
      </div>

      {/* OUR VALUES */}
      <div className="w-full py-12 px-4 flex flex-col items-center" style={{ backgroundImage: "url('/our_values_bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#FBE9C7] rounded-lg opacity-90 blur-sm z-0" />
          <h2 className="text-2xl font-bold text-[#9C5C44] relative z-10 px-4">OUR VALUES</h2>
        </div>

        <div className="flex flex-col lg:flex-row w-[90%] lg:w-3/4 bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col text-left font-semibold w-full lg:w-1/4">
            {['vision', 'mission', 'purpose'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 border-b-2 lg:border-b-0 lg:border-r-2 border-[#9C5C44] text-left transition-all duration-300 ${activeTab === tab ? "text-purple-700 font-bold" : "text-[#9C5C44]"}`}
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
        <h2 className="text-2xl font-bold text-[#9C5C44] border-b-4 border-[#9C5C44] mb-6">OUR STORY</h2>
        <div className="bg-[#B9745A] rounded-[30px] px-6 py-6 w-full lg:w-[60%] text-left text-white shadow-md relative">
          <p className="mb-4 text-lg font-semibold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</p>

          <div className="relative flex flex-col items-center">
            <img
              src="/our_story.jpg"
              alt="Bookshelf"
              className="w-[200px] md:w-[250px] rounded-xl cursor-pointer"
              onClick={() => setShowFact(!showFact)}
            />

            {showFact && (
              <div className="absolute -top-[80px] w-[180px] bg-white text-[#5D2F1C] text-sm p-3 rounded-2xl shadow-lg z-20">
                Lorem ipsum dolor sit amet, consectetur...
              </div>
            )}

            <div className="mt-4 text-[#5D2F1C] font-bold text-sm text-center">
              <span className="text-2xl block">➤</span>
              CLICK TO KNOW FACTS
            </div>
          </div>
        </div>
      </div>

      {/* IMPACTS */}
      <div className="bg-[#9C5C44] rounded-3xl text-white w-[90%] lg:w-3/4 p-6 text-center mb-12">
        <h2 className="text-2xl font-bold mb-6">IMPACTS MADE</h2>
        <div className="flex flex-col lg:flex-row justify-center gap-6">
          {[{ value: 246, label: "ACTIVE READERS" }, { value: 60, label: "BOOK DONATION" }, { value: 20, label: "CHILDREN EDUCATED" }].map((impact, idx) => (
            <div
              key={idx}
              className="bg-[#D9CFC9] text-[#5D2F1C] rounded-full w-36 h-36 flex flex-col justify-center items-center shadow-md transform transition-transform duration-1000 ease-in-out hover:scale-105 hover:-translate-y-2"
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