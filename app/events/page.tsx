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
  
  // Book Exchange States
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [userBooks, setUserBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [offering, setOffering] = useState(false);

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

    // Fetch exchanges
    fetch("/api/exchanges")
      .then((res) => (res.ok ? res.json() : { exchanges: [] }))
      .then((data) => {
        if (!active) return;
        setExchanges(data.exchanges || []);
      })
      .catch(() => {});

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

  const handleOpenOfferModal = async () => {
    if (!userId) {
      alert("Please sign in to offer a book.");
      return;
    }
    setShowOfferModal(true);
    try {
      const res = await fetch(`/api/book-diary?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const books = data.entries?.map((e: any) => e.book).filter(Boolean) || [];
        // Deduplicate books
        const uniqueBooks = Array.from(new Map(books.map((b: any) => [b.id, b])).values());
        setUserBooks(uniqueBooks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOfferBook = async () => {
    if (!selectedBook) return;
    setOffering(true);
    try {
      const res = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId: selectedBook }),
      });
      if (res.ok) {
        const newExchange = await res.json();
        setExchanges(prev => [newExchange.exchange, ...prev]);
        setShowOfferModal(false);
        setSelectedBook("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOffering(false);
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
                <SetCountDown targetDate={featuredEvent?.time} />
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
          <div className="bg-[#f0befd] relative rounded-xl p-6 sm:p-10 mb-8 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#9d5583] mb-2 text-center">
              Blind Date with a Book
            </h2>
            <div className="text-2xl sm:text-4xl font-bold text-center">×</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8 text-center">
              Book Exchange
            </h2>
            
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#462C90]">Available for Exchange</h3>
              <Button 
                onClick={handleOpenOfferModal}
                className="bg-[#462C90] text-[#E1B5EE] hover:bg-[#241943]"
              >
                Offer a Book
              </Button>
            </div>

            {/* Exchanges Grid */}
            {exchanges.length === 0 ? (
              <p className="text-gray-600 italic">No books available for exchange right now. Be the first!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
                {exchanges.map((exc) => (
                  <div key={exc.id} className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center text-center">
                    <div className="w-24 h-36 mb-3 relative overflow-hidden rounded shadow-sm">
                      <Image 
                        src={exc.book?.image || "/bookstack.png"} 
                        alt={exc.book?.name || "Book Cover"} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-[#241943] line-clamp-2 mb-1">{exc.book?.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{exc.book?.author}</p>
                    <div className="mt-auto pt-2 border-t border-gray-100 w-full">
                      <p className="text-[10px] text-gray-400">Offered by</p>
                      <p className="text-xs font-semibold text-[#9d5583]">{exc.user?.username || exc.user?.name || "Anonymous"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offer Modal */}
          {showOfferModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-[#462C90]">Offer a Book for Exchange</h2>
                <p className="text-sm text-gray-600 mb-4">Select a book from your reading history to offer in the exchange.</p>
                
                {userBooks.length === 0 ? (
                  <p className="text-sm text-red-500 mb-4">You don't have any books in your reading history yet.</p>
                ) : (
                  <select 
                    className="w-full p-2 border border-gray-300 rounded mb-6 text-sm"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    <option value="">Select a book...</option>
                    {userBooks.map((book: any) => (
                      <option key={book.id} value={book.id}>
                        {book.name} ({book.author})
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                  <Button 
                    className="bg-[#462C90] text-white" 
                    disabled={!selectedBook || offering}
                    onClick={handleOfferBook}
                  >
                    {offering ? "Offering..." : "Offer Book"}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
          <SuggestionBox />
        </section>
      </div>
    </main>
  );
}

function SuggestionBox() {
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !idea.trim()) {
      setMsg("Please fill in your name, email, and idea.");
      return;
    }

    setSending(true);
    setMsg("");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contactNo, idea }),
      });

      if (res.ok) {
        setSent(true);
        setMsg("Thank you! Your idea has been dropped into our suggestion box. 💡");
      } else {
        setMsg("Failed to submit. Please try again.");
      }
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#BA7FCB] rounded-lg p-6 max-w-md mx-auto shadow-lg">
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-center text-white">
        SUGGESTION BOX
      </h2>
      <p className="text-center text-white/90 text-sm mb-4">Drop what's on your mind</p>

      {sent ? (
        <div className="text-center text-white bg-white/10 p-4 rounded-lg">
          <p className="font-semibold text-[#241943] bg-white py-2 px-3 rounded-md mb-2">{msg}</p>
          <button
            onClick={() => {
              setSent(false);
              setIdea("");
              setMsg("");
            }}
            className="text-xs underline hover:text-white/80 mt-2"
          >
            Submit another idea
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {msg && <p className="text-xs text-white bg-red-500/80 p-2 rounded text-center">{msg}</p>}
          <input
            type="text"
            placeholder="Name:"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2.5 rounded-md text-gray-800 text-sm"
          />
          <input
            type="text"
            placeholder="Contact:"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            className="w-full p-2.5 rounded-md text-gray-800 text-sm"
          />
          <input
            type="email"
            placeholder="Email:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2.5 rounded-md text-gray-800 text-sm"
          />
          <textarea
            placeholder="Your Idea:"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            required
            className="w-full p-2.5 rounded-md text-gray-800 text-sm h-24"
          ></textarea>

          <div className="text-center">
            <Button
              type="submit"
              disabled={sending}
              className="bg-[#241943] text-[#E1B5EE] hover:bg-[#E1B5EE] hover:text-[#241943] transition-colors w-full sm:w-auto"
            >
              {sending ? "Submitting..." : "SUBMIT"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

