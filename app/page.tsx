"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Twitter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookFlipAnimation from "@/components/book-flip-animation"
import ScrollMessage from "@/components/scroll-message"
import BookCarousel from "@/components/book-carousel"
import EventCarousel from "@/components/event-carousel"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#FDE8BE]"
    >
      <main>
        {/* Welcome Section */}
        <motion.section className="container mx-auto px-4 py-8" initial="initial" animate="animate" variants={fadeInUp}>
          {/* Search Bar */}
          <motion.div className="w-full mb-6" variants={fadeIn}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#241943]" size={18} />
              <input
                type="text"
                placeholder="Search username or Book Name"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-[#BA7FCB] text-[#241943] placeholder-[#241943] focus:outline-none focus:ring-2 focus:ring-[#a87c9f]"
              />
            </div>
          </motion.div>

          {/* Welcome Heading */}
          <motion.div className="bg-[#] py-2 px-2" variants={fadeInUp}>
            <h2 className="text-3xl font-caveat italic text-[#BA7FCB] mb-4">Welcome to BookSpace</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <p className="text-[#BA7FCB] text-lg font-literata">A community where readers and books are celebrated</p>
              <div className="flex flex-col items-center">
                <BookFlipAnimation />
              </div>
            </div>
            <div className="md:col-span-2 text-center mt-6">
              <Button className="bg-[#241943] text-[#E1B5EE] hover:bg-[#E1B5EE] hover:text-[#241943] transition-colors" onClick={() => window.open("/about-us", "_blank")}>
                Explore
              </Button>
            </div>
          </motion.div>
        </motion.section>

        {/* Take Part Today Section */}
        <motion.section className="container mx-auto px-0 py-8 mb-12" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <motion.div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col gap-6"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage: "linear-gradient(270deg, #E1B5EE, #BA7FCB, #8D67BB, #E1B5EE)",
              backgroundSize: "800% 800%"
            }}
          >
            <h2 className="text-3xl font-merriweather text-[#241943] text-center mb-2 font-bold">Take Part Today</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <Link href="/events">
                  <Image src="/thewritingrev.png" alt="The Writing Revolution Book Cover" width={200} height={300} className="rounded-md border-4 border-white shadow-lg cursor-pointer" />
                </Link>
              </div>
              <div className="flex flex-col items-center mt-4 text-center">
                <p className="text-[#462C90] text-lg">
                  Writing Revolution is a transformative event celebrating the journey from pen to print. Join us as we unveil the power of storytelling and the path to publishing your own book.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button className="bg-[#241943] text-[#E1B5EE] hover:bg-[#E1B5EE] hover:text-[#241943] transition-colors" onClick={() => window.open("/events", "_blank")}>Know More</Button>
            </div>
          </motion.div>
        </motion.section>

        {/* Get Inspired Section */}
        <motion.section className="container mx-auto px-0 py-0" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <div className="rounded-2xl p-4 md:p-8 relative min-h-[350px]" style={{ background: "linear-gradient(to bottom, #E1B5EE, #8D67BB)" }}>
            <h2 className="text-2xl md:text-3xl font-serif text-[#241943] text-center mb-6 relative z-10 font-bold">Get Inspired</h2>
            <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
              <div className="md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2">
                <Image src="/flower.png" alt="flower" width={150} height={100} className="rounded-md w-[100px] md:w-[150px] h-auto mx-auto md:mx-0" />
              </div>
              <div className="flex-1 flex justify-center items-center mt-4 md:mt-0">
                <ScrollMessage />
              </div>
            </div>
          </div>
        </motion.section>

        {/* What's Happening Section */}
        <motion.section className="max-w-5xl mx-auto px-4 py-8 mb-12" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-3xl font-merriweather text-[#241943] text-center mb-8 font-bold">What's Happening</h2>
          <EventCarousel />
        </motion.section>

        {/* Book Recommends Section */}
        <motion.section className="max-w-5xl mx-auto px-4 py-8 mb-12 overflow-x-hidden overflow-y-visible" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-3xl font-merriweather text-[#241943] text-center mb-8 font-bold">Book Recommends</h2>
          <BookCarousel />
        </motion.section>

        {/* Currently Reading Section */}
        <motion.section className="container mx-auto px-4 py-12 relative" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <div className="absolute top-[-210px] left-0 right-0 bottom-0 w-full bg-[url('/bookshelf.png')] bg-cover bg-top opacity-70 z-0"></div>
          <div className="relative bg-[#f8efd0]/90 rounded-2xl p-6 max-w-5xl mx-auto z-10">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <Image src="/goodgirlsguide.png" alt="Currently Reading Book Cover" width={160} height={240} className="rounded shadow-lg w-[160px] h-auto" />
                  <p className="mt-2 text-[#5d4037] font-medium">Fiction</p>
                </div>
                <div className="flex flex-col items-center">
                  <Image src="/psychology.png" alt="Second Book" width={160} height={240} className="rounded shadow-lg w-[160px] h-auto" />
                  <p className="mt-2 text-[#5d4037] font-medium">Non-Fiction</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center">
                <h3 className="text-2xl font-serif text-[#5d4037] mb-2">WE ARE CURRENTLY READING</h3>
                <p className="text-[#5d4037] mb-4">Dive into the mystery and uncover secrets together!</p>
                <p className="text-[#a87c9f] font-medium mb-4">Book Discussion: 3/03/2025</p>
                <Button className="bg-[#241943] text-[#E1B5EE] hover:bg-[#E1B5EE] hover:text-[#241943] transition-colors" onClick={() => window.open("/BookClub", "_blank")}>Explore</Button>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </motion.div>
  )
}
