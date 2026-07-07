"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import SetCountDown from "./SetCoundDown";
import CalendarEmbed from "@/components/Calendar";
import EventCarousel from "@/components/event-carousel";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/superbase/client";

interface ApiEvent {
  id: string;
  event_name: string;
  description: string;
  venue: string;
  time: string;
  image: string;
  blog_link: string;
  _count?: { participants: number };
}

export default function Events() {
  const images = [
    "/bookexchange.png",
    "/literacydrive.png",
    "/psychology.png",
    "/thealchemist.png",
  ];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [featuredEvent, setFeaturedEvent] = useState<ApiEvent | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registerCount, setRegisterCount] = useState<number | null>(null);
  const [registering, setRegistering] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Load the featured (most recent) event
  useEffect(() => {
    let active = true;
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data: { events?: ApiEvent[] }) => {
        if (!active) return;
        const first = data.events?.[0] ?? null;
        setFeaturedEvent(first);
        setRegisterCount(first?._count?.participants ?? null);
      })
      .catch(() => {
        if (active) setFeaturedEvent(null);
      });
    return () => {
      active = false;
    };
  }, []);

  // Track the current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
  }, [supabase.auth]);

  // Check if user is registered once both userId and featuredEvent are loaded
  useEffect(() => {
    if (!userId || !featuredEvent) return;
    fetch(`/api/events/register?userId=${userId}&eventId=${featuredEvent.id}`)
      .then((res) => (res.ok ? res.json() : { registered: false }))
      .then((data) => {
        setRegistered(data.registered);
      })
      .catch(() => {
        setRegistered(false);
      });
  }, [userId, featuredEvent]);

  const handleRegister = async () => {
    if (!userId) {
      setStatusMsg("Please sign in to register.");
      return;
    }
    if (!featuredEvent) {
      setStatusMsg("No event available to register for yet.");
      return;
    }

    setRegistering(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, eventId: featuredEvent.id }),
      });

      if (res.ok) {
        setRegistered(true);
        setRegisterCount((prev) => (prev ?? 0) + 1);
        setStatusMsg("You're registered! 🎉");
      } else if (res.status === 409) {
        setRegistered(true);
        setStatusMsg("You're already registered for this event.");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMsg(data.error || "Failed to register. Please try again.");
      }
    } catch {
      setStatusMsg("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

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

              <p className="text-[#241943] font-medium">
                {featuredEvent?.event_name || "Event Name"}
              </p>
              <p className="text-[#241943] font-medium">
                {featuredEvent?.description || "Event Description"}
              </p>
              <p className="text-[#241943] text-sm mt-2">
                {featuredEvent
                  ? `Venue: ${featuredEvent.venue}`
                  : "Time: 4pm Venue: Vile Parle, Garden"}
              </p>

              {registerCount !== null && (
                <p className="text-[#5b3758] text-sm font-semibold mt-1">
                  {registerCount} registered
                </p>
              )}

              <Button
                className="mt-4 bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943] transition-colors disabled:opacity-60"
                onClick={handleRegister}
                disabled={registering || registered}
              >
                {registered ? "Registered ✓" : registering ? "Registering..." : "Register Now"}
              </Button>

              {statusMsg && (
                <p className="text-[#241943] text-xs mt-2">{statusMsg}</p>
              )}

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
