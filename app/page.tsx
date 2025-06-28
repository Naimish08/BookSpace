"use client"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookFlipAnimation from "@/components/book-flip-animation"
import ScrollMessage from "@/components/scroll-message"
import BookCarousel from "@/components/book-carousel"
import EventCarousel from "@/components/event-carousel"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8efd0]">
      <main>
        {/* Welcome Section */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-caveat italic text-[#8d6e63] mb-4">Welcome to BookSpace</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[#5d4037] text-lg">A community where readers and books are celebrated</p>
            </div>
            <div className="flex flex-col items-center">
              <BookFlipAnimation />
            </div>
            <div className="md:col-span-2 text-center mt-6">
              <div className="mt-6 text-center">
                <p className="text-[#5d4037] mb-2"></p>
                <Button className="bg-[#d1a7c2] hover:bg-[#b589a8] text-white"
                  onClick={() => window.open("https://aboutus_link", "_blank")}
                >Explore </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Take Part Today Section */}
        <section className="container mx-auto px-4 py-8">
          <div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden h-[350px]"
            style={{
              background: "linear-gradient(to bottom, #A27B94, #B16194)"
            }}
          >
            <h2 className="text-3xl font-serif text-white text-center mb-6">Take Part Today</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <Image
                  src="/thewritingrev.png"
                  alt="The Writing Revolution Book Cover"
                  width={200}
                  height={300}
                  className="rounded-md border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex flex-col items-center mt-4">
                <p className="text-white text-lg mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Sed ut perspiciatis unde omnis
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Sed ut perspiciatis unde omnis
                </p>
                <Button variant="outline" className="bg-white text-[#a87c9f] hover:bg-gray-100 "
                  onClick={() => window.open("https://eventpage_link", "_blank")}>
                  Know More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Reading Inspiration Section */}
        <section className="mb-10">
          <div className="bg-[#b27b92] bg-opacity-75 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Your Reading Inspiration for Today</h2>
            <div className="scroll-container h-32 flex items-center justify-center">
              <p className="text-center">Message opening animation (shows up)</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 ">
          <div className="bg-[#d1a7c2] rounded-2xl p-6 md:p-8 relative overflow-hidden h-[350px]">
            {/* Decorative Circles */}
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#e6c0d7] opacity-50"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-[#e6c0d7] opacity-50"></div>
            <div className="absolute -right-20 top-20 w-16 h-16 rounded-full bg-[#e6c0d7] opacity-50"></div>
            <div className="absolute -left-10 -bottom-20 w-16 h-16 rounded-full bg-[#e6c0d7] opacity-50"></div>
            {/* Title */}
            <h2 className="text-3xl font-serif text-white text-center mb-6 relative z-10">
              Your Reading Inspiration for Today
            </h2>
            <div className="mt-10">
              {/* Flex Row for Scroll and Image */}
              <div className="relative z-10 flex justify-center items-center h-40">
                {/* Absolutely positioned image at left */}
                <div className="absolute left-8">
                  <Image
                    src="/flower.png"
                    alt="flower"
                    width={200}
                    height={150}
                    className="rounded-md"
                  />
                </div>
                {/* Scroll Message stays in center */}
                <ScrollMessage />
              </div>
            </div>
          </div>
        </section>

        {/* What's Happening Section */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-serif text-[#a87c9f] text-center mb-8">What's Happening</h2>
          <EventCarousel />
        </section>

        {/* Book Recommends Section */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-serif text-[#a87c9f] text-center mb-8">Book Recommends</h2>
          <BookCarousel />
        </section>

        {/* Currently Reading Section */}
        <section className="container mx-auto px-4 py-12 relative">
          <div className="absolute top-[-210px] left-0 right-0 bottom-0 bg-[url('/bookshelf.png')] bg-cover bg-top opacity-70 z-0"></div>
          <div className="relative bg-[#f8efd0]/90 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/4">
                <Image
                  src="/goodgirlsguide.png"
                  alt="Currently Reading Book Cover"
                  width={200}
                  height={300}
                  className="rounded shadow-lg"
                />
              </div>
              <div className="md:w-3/4 flex flex-col justify-center items-center text-center">
                <h3 className="text-2xl font-serif text-[#5d4037] mb-2">
                  WE ARE CURRENTLY READING
                </h3>
                <p className="text-[#5d4037] mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p className="text-[#a87c9f] font-medium mb-4">
                  Book Discussion: 3/03/2025
                </p>
                <Button className="bg-[#a87c9f] hover:bg-[#8d6e63] text-white"
                  onClick={() => window.open("https://some_link", "_blank")}
                >
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

