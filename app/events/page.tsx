"use client"

import { useState } from "react";
import Image from "next/image";
import SetCountDown from "./SetCoundDown";
import CalendarEmbed from "@/components/Calendar";
import EventCarousel from "@/components/event-carousel";
import { Button } from "@/components/ui/button";

export default function Events() {
  const images = [
    "/bookexchange.png",
    "/literacydrive.png",
    "/psychology.png",
    "/thealchemist.png",
  ];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <main className="min-h-screen bg-[#FDE8BE]">
      <div className="container mx-auto px-4">

        {/* Countdown Section */}
        <section className="bg-[#462C90] relative rounded-xl p-6 sm:p-10 text-white">
          <h1 className="text-xl sm:text-2xl text-center font-bold mb-4 text-[#ffefd0]">
            Come join us?
          </h1>

          <div className="flex justify-center">
            <div className="bg-[#f0befd] relative rounded-xl p-4 text-center w-full max-w-xl">
              <div className="text-[#5b3758] text-3xl sm:text-4xl font-bold mb-4">
                <SetCountDown />
              </div>

              <p className="text-[#241943] font-medium">Event Name</p>
              <p className="text-[#241943] font-medium">Event Description</p>
              <p className="text-[#241943] text-sm mt-2">
                Time: 4pm Venue: Vile Parle, Garden
              </p>

              <Button
                className="mt-4 bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943] transition-colors"
                onClick={() => window.open("/gmail", "_blank")}
              >
                Register Now
              </Button>

              <Image
                src="/bookstack.png"
                alt="Decoration"
                width={200}
                height={200}
                className="absolute bottom-2 left-2 w-16 sm:w-[140px] h-auto"
              />
            </div>
          </div>
        </section>

        {/* Book Exchange Section */}
        <section className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-[#f0befd] relative rounded-xl p-6">

            {/* Left Column */}
            <div className="relative pb-24 sm:pb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#9d5583] mb-2 text-center">
                Blind Date with a Book
              </h2>
              <div className="text-2xl sm:text-4xl font-bold text-center">×</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 text-center pb-6">
                Book Exchange
              </h2>

              {/* Thumbnail Selector */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)} /*sm:w-20 sm:h-20 */
                    className="w-[100px] h-[100px] sm:w-30 sm:h-30 rounded-full overflow-hidden border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200"
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Large Image */}
            <div className="flex justify-center items-center mt-8 sm:mt-0">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden bg-[#9d5583]">
                <Image
                  src={selectedImage}
                  alt="Selected Book"
                  width={256}
                  height={256}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Event Calendar */}
          <div className="bg-gray-100 p-4 rounded-xl mb-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              Event Calendar
            </h1>
            <CalendarEmbed />
          </div>

          {/* Past Events Carousel */}
          <section className="max-w-5xl mx-auto px-4 py-8 mb-12">
            <h2 className="text-2xl sm:text-3xl font-merriweather text-[#241943] text-center mb-8">
              Our Past Events
            </h2>
            <EventCarousel />
          </section>

          {/* Suggestion Box */}
          <div className="bg-[#BA7FCB] rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-center text-white">
              SUGGESTION BOX
            </h2>
            <p className="text-center text-white mb-4">Drop what's on your mind</p>

            <form className="space-y-4">
              <input type="text" placeholder="Name:" className="w-full p-2 rounded-md" />
              <input type="text" placeholder="Contact:" className="w-full p-2 rounded-md" />
              <input type="email" placeholder="Email" className="w-full p-2 rounded-md" />
              <textarea placeholder="Your Idea:" className="w-full p-2 rounded-md h-24"></textarea>

              <div className="text-center">
                <Button
                  className="bg-[#241943] text-[#E1B5EE] hover:bg-[#E1B5EE] hover:text-[#241943] transition-colors"
                  onClick={() => window.open("/about-us", "_blank")}
                >
                  SUBMIT
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
