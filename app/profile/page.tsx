"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/superbase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Plus, Star } from 'lucide-react';
import styled, { keyframes } from "styled-components";
import Image from 'next/image';
import { Calendar } from "@/components/ui/calendar";

// ProfileCard Component with Tailwind CSS
const ProfileCard = ({ user = { username: "readinglovesme", email: "readinglovesme@gmail.com", bio: "(bio)" }, onSignOut }) => {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error.message)
      } else {
        console.log("Successfully signed out")
        router.push("/") // Changed from "/login-signup" to "/"
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error)
    }
  }

  const [bio, setBio] = useState(user.bio || localStorage.getItem("savedBio") || "(bio)");
  const [isEditing, setIsEditing] = useState(false);
  const [currentRead, setCurrentRead] = useState("Book Title");
  const [wishlist, setWishlist] = useState("Wishlisted");
  const genres = ["Fantasy", "Romance", "Sci-Fi", "Mystery"];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveBio = () => {
    setIsEditing(false);
    localStorage.setItem("savedBio", bio);
  };

  return (
    <section className="w-full max-w-4xl mx-auto bg-gradient-to-b from-[#3F2B96] to-[#A96EC3] text-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/30 pb-3">
        <h2 className="text-xl font-semibold">📖 My BookSpace Profile</h2>
        <div className="flex gap-2">
          <button
            className="bg-white text-[#3F2B96] px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-red-600 transition"
            onClick={handleSignOut}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Username + Avatar + Bio */}
      <div className="mt-4 flex gap-6 items-start">
        <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center text-2xl font-bold text-[#3F2B96]">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-bold">{user.username}</h3>
          {isEditing ? (
            <textarea
              className="w-full bg-white/20 text-white placeholder:text-gray-300 text-sm rounded-lg p-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="(bio)"
              rows={3}
            />
          ) : (
            <p className="text-sm">{bio}</p>
          )}
          {isEditing && (
            <button
              className="bg-white text-[#3F2B96] px-4 py-1 rounded-full text-sm font-semibold mt-2 hover:bg-gray-100 transition"
              onClick={handleSaveBio}
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Real Name + Connect */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="text-lg font-medium">Realname</p>
        <button className="bg-white text-[#3F2B96] px-4 py-1 rounded-full text-sm font-bold hover:scale-105 transition-transform">
          CONNECT
        </button>
        <div className="bg-[#3F2B96] px-4 py-1 rounded-md text-sm">{user.email}</div>
      </div>

      {/* Genres */}
      <div className="mt-4 flex flex-wrap gap-2">
        {genres.map((genre) => (
          <span
            key={genre}
            className="bg-[#3F2B96] px-4 py-1 rounded-full text-sm font-semibold"
          >
            {genre}
          </span>
        ))}
      </div>
      {/* Current Read + Wishlist */}
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm mb-1">Current Read</label>
          <select
            className="w-full rounded-full text-[#3F2B96] px-4 py-2 text-sm bg-white"
            value={currentRead}
            onChange={(e) => setCurrentRead(e.target.value)}
          >
            <option>Book Title</option>
            <option>Another Book</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Gift Me a Book</label>
          <select
            className="w-full rounded-full text-[#3F2B96] px-4 py-2 text-sm bg-white"
            value={wishlist}
            onChange={(e) => setWishlist(e.target.value)}
          >
            <option>Wishlisted</option>
            <option>New Wish</option>
          </select>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white text-[#3F2B96] rounded-full py-2 font-semibold">Views</div>
        <div className="bg-white text-[#3F2B96] rounded-full py-2 font-semibold">Connections</div>
        <div className="bg-white text-[#3F2B96] rounded-full py-2 font-semibold">Streak/Reads</div>
      </div>
    </section>
  );
};

// Updated BookCover component
const BookCover = ({ imageUrl, title, author, rating = 5 }) => (
  <div className="w-28 text-center space-y-2">
    <img
      src={imageUrl}
      alt={`Cover of ${title}`}
      className="w-28 h-40 object-cover rounded-md shadow-md"
    />
    <p className="text-sm font-semibold text-white">{title}</p>
    <p className="text-xs text-white/80 italic">{author}</p>
    <div className="flex justify-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={`text-yellow-400 ${i < rating ? "fill-current" : "text-white/20"}`}
        />
      ))}
    </div>
  </div>
);

// Placeholder for the PieChart component
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: ["#E1B5EE", "#BA7FCB", "#462C90", "#483285", "#A855F7"],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: "150px", height: "150px", margin: "0 auto" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

// Keyframes for the letter opening animation
const letterSlide = keyframes`
  from { transform: translateY(70%); }
  to   { transform: translateY(0%); }
`;

// Envelope and Letter Styles using styled-components
const EnvelopeWrap = styled.div`
  width: 320px;
  max-width: 95vw;
  margin: 32px auto;
  position: relative;
  user-select: none;
`;

const Envelope = styled.div`
  width: 100%;
  aspect-ratio: 1.2 / 1;
  background: #bdbdbd;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 16px #0002, 0 0 0 6px #fff;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0; right: 0;
    height: 70%;
    background: #ababab;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    z-index: 2;
  }
`;

const Flap = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 54%;
  background: #faf9f6;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  clip-path: polygon(50% 0, 100% 100%, 0% 100%);
  z-index: 3;
`;

const HeartSeal = styled.div`
  position: absolute;
  left: 50%; bottom: 32px;
  transform: translateX(-50%);
  z-index: 4;
  font-size: 1.7em;
  color: #757575;
  background: #faf9f6;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center; justify-content: center;
  box-shadow: 0 0 0 3px #fff;
`;

const Letter = styled.div<{ open: boolean }>`
  width: 88%;
  min-height: 120px;
  background: #fff9ee;
  border-radius: 12px 12px 8px 8px;
  box-shadow: 0 6px 20px #0001;
  position: absolute;
  left: 6%; bottom: 18%;
  z-index: 7;
  overflow: hidden;
  border: 2px solid #f6e9c7;
  padding: 0;

  transform: translateY(${props => props.open ? '0%' : '70%'});
  transition: transform 0.9s cubic-bezier(.7,1.5,.2,1);
  animation: ${props => props.open ? letterSlide : 'none'} 0.95s cubic-bezier(.7,1.5,.2,1);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const LetterContent = styled.div`
  padding: 24px 16px;
  font-family: 'Courier New', monospace;
  font-size: 1.18em;
  color: #59504c;
  text-align: center;

  @media (max-width: 400px) {
    font-size: 1em;
    padding: 18px 3vw;
  }
`;

const QuranRef = styled.div`
  padding-bottom: 12px;
  color: #888;
  font-size: 0.98em;
  letter-spacing: 1.2px;
  font-family: 'Poppins', Arial, sans-serif;
`;

// Letter opening animation component
function LetterOpeningAnimation() {
  const [open, setOpen] = useState(false);

  return (
    <EnvelopeWrap>
      <Envelope onClick={() => setOpen(open => !open)} style={{ cursor: "pointer" }}>
        <Flap />
        <HeartSeal>❤️</HeartSeal>
        <Letter open={open}>
          <LetterContent>
            <div>
              <b>Indeed, with every difficulty, there is relief.</b>
            </div>
          </LetterContent>
        </Letter>
      </Envelope>
      <div style={{ textAlign: "center", marginTop: 12, opacity: 0.65, fontSize: '1.01em' }}>
        {open ? "Click the envelope to close" : "Click to open the letter"}
      </div>
    </EnvelopeWrap>
  );
}

// Challenge banner component with larger circles, no flying book
const ChallengeBanner = () => {
  return (
    <div className="relative bg-[#483285] text-white rounded-3xl p-8 my-8 shadow-lg flex flex-col items-center justify-center overflow-hidden min-h-[250px]">
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold text-[#E1B5EE]">Your Challenge for today is here!</h2>
        <div style={{ height: '60px', margin: '20px 0' }}></div>
        <LetterOpeningAnimation />
      </div>
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#E1B5EE] rounded-full opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#BA7FCB] rounded-full opacity-30"></div>
    </div>
  );
};

// Capsule-styled recap section
const RecapSection = styled.section`
  background: #BA7FCB;
  border-radius: 24px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default function ProfilePage() {
  const genresData = {
    labels: ["Fiction", "Non-Fiction", "Mystery", "Fantasy", "Biography"],
    values: [10, 5, 8, 12, 6],
  };

  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [genresToExplore, setGenresToExplore] = useState([]);
  const [genresInput, setGenresInput] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistInput, setWishlistInput] = useState("");
  const [readingGoals, setReadingGoals] = useState([]);
  const [readingGoalsInput, setReadingGoalsInput] = useState("");

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSave = async () => {
    const bookDiaryData = {
      userId: user?.id,
      bookName,
      author,
      genre,
      startDate,
      endDate,
      rating,
      thoughts,
    };

    try {
      const response = await fetch("/api/book-diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookDiaryData),
      });

      if (response.ok) {
        setFeedback("Saved successfully!");
        setTimeout(() => setFeedback(""), 3000);
        setBookName(""); setAuthor(""); setGenre(""); setStartDate(""); setEndDate(""); setThoughts(""); setRating(0);
      } else {
        setFeedback("Error: Could not save diary entry.");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (error) {
      console.error("Unexpected error while saving book diary:", error);
    }
  };

  const handleAddToGenres = () => {
    if (genresInput.trim()) {
      setGenresToExplore([...genresToExplore, genresInput.trim()]);
      setGenresInput("");
    }
  };

  const handleAddToWishlist = () => {
    if (wishlistInput.trim()) {
      setWishlist([...wishlist, wishlistInput.trim()]);
      setWishlistInput("");
    }
  };

  const handleAddToReadingGoals = () => {
    if (readingGoalsInput.trim()) {
      setReadingGoals([...readingGoals, readingGoalsInput.trim()]);
      setReadingGoalsInput("");
    }
  };

  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login-signup");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/login-signup");
      else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error.message)
      } else {
        console.log("Successfully signed out")
        router.push("/") // Changed from "/login-signup" to "/"
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error)
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>;
  if (!user) return null;

  const username = user.email.split('@')[0] || "readinglovesme";
  const email = user.email || "readinglovesme@gmail.com";

  // Sample user data for Monthly Reading Recap
  const booksRead = [
    { title: "Good Murder Guide", author: "Holly Jackson", rating: 4 },
    { title: "The Alchemist", author: "Paulo Coelho", rating: 5 },
    { title: "Psychology of Money", author: "Morgan Housel", rating: 3 },
    { title: "1984", author: "George Orwell", rating: 4 },
  ];
  const readingStreak = 10;
  const booksReviewed = 3;
  const readingDays = ["Jul 28", "Jul 29", "Jul 30", "Jul 31", "Aug 1", "Aug 2", "Aug 3"];
  const highestRatedBook = booksRead.reduce((max, book) => max.rating > book.rating ? max : book, booksRead[0]);

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ background: "#FDE8BE" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <ChallengeBanner />
        <ProfileCard 
          user={{ username, email, bio: "" }} 
          onSignOut={handleSignOut} 
        />
        <RecapSection>
          <h2 className="text-4xl font-bold text-center text-[#483285] mb-8">Monthly Reading Recap</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center items-center p-6 bg-[#483285] rounded-xl text-white">
              <h3 className="text-2xl font-semibold mb-4">Reads This Month</h3>
              <div className="flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {booksRead.map((book, index) => (
                  <BookCover key={index} imageUrl="/psychology.png" title={book.title} author={book.author} rating={book.rating} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <div className="bg-[#A96EC3] text-white px-4 py-2 rounded-full font-semibold text-sm">Total Books Read: {booksRead.length}</div>
                  <div className="bg-[#A96EC3] text-white px-4 py-2 rounded-full font-semibold text-sm">Books Reviewed: {booksReviewed}</div>
                  <div className="bg-[#A96EC3] text-white px-4 py-2 rounded-full font-semibold text-sm">Streak: {readingStreak} days</div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-white">Highest Rated Book of the Month</p>
                  <div className="relative inline-block mt-2">
                    <img src="/psychology.png" alt="Top Rated" className="w-24 h-36 rounded-md shadow-lg" />
                    <span className="absolute -top-3 -right-3 text-yellow-400 text-2xl">👑</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#483285] p-6 rounded-xl text-white">
              <h3 className="text-2xl font-semibold mb-4 text-center">Reading Streak Calendar</h3>
              <div className="bg-white rounded-lg p-4 text-gray-800">
                <Calendar
                  mode="single"
                  selected={new Date("2025-08-03")}
                  className="rounded-md border text-sm"
                  style={{ backgroundColor: "#ffffff", padding: "10px" }}
                  dayClassName={(date) => {
                    const dateStr = date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    const fullDate = date.toISOString().split('T')[0];
                    const streakDates = [
                      "2025-07-28", "2025-07-29", "2025-07-30", "2025-07-31",
                      "2025-08-01", "2025-08-02", "2025-08-03"
                    ];
                    return streakDates.includes(fullDate)
                      ? "bg-[#BA7FCB] text-white font-bold rounded-full"
                      : "text-gray-500";
                  }}
                />
                <p className="mt-2 text-sm text-center text-[#483285] font-semibold">Streak: {readingStreak} days</p>
              </div>
            </div>
          </div>
        </RecapSection>

        <section className="bg-[#E1B5EE] p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-4xl font-bold text-center text-[#483285] mb-8">Book Diary</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#483285] text-white p-6 rounded-xl space-y-5 shadow-inner">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Search page: __"
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />
                <Button className="bg-white/90 text-[#483285] hover:bg-white w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> add a book
                </Button>
              </div>
              <Input
                placeholder="Name of Book"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                defaultValue="Psychology of Money"
              />
              <Input
                placeholder="Author (auto filled from data)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-white/10 border-white/30 placeholder:text-gray-300"
                defaultValue="Morgan Housel"
              />
              <Input
                placeholder="Genre (auto filled from data)"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-white/10 border-white/30 placeholder:text-gray-300"
                defaultValue="Non-Fiction"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 dark"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 dark"
                />
              </div>

              <div>
                <label className="text-sm font-medium">How much I liked this book</label>
                <div className="flex items-center gap-1 mt-2 text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      fill={index < rating ? "currentColor" : "none"}
                      onClick={() => handleStarClick(index)}
                      className="cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="I think this book..."
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 min-h-[100px]"
                defaultValue="Great insights on personal finance!"
              />
              <div className="flex justify-between items-center pt-2">
                <Button variant="secondary" onClick={handleSave}>SAVE</Button>
                {feedback && <p className="text-sm self-center">{feedback}</p>}
                <Button className="bg-[#a855f7] hover:bg-[#9333ea]">PUBLISH</Button>
              </div>
            </div>

            <div className="space-y-6 text-center text-[#ffffff]">
              <div className="bg-[#462C90] p-4 rounded-xl shadow-md">
                <h3 className="font-bold mb-2">Genres I've read</h3>
                <PieChart data={genresData} />
                <Input
                  placeholder="genres I want to explore"
                  className="bg-white/80 border-[#483285]/30 placeholder:text-slate-500 text-gray-500 mt-4"
                />
              </div>

              <div className="bg-[#462C90] p-4 rounded-xl shadow-md">
                <h3 className="font-bold mb-2">my wishlist</h3>
                <div className="space-y-2">
                  {wishlist.map((item, index) => (
                    <p key={index} className="text-white text-sm bg-[#483285] p-2 rounded-md">
                      {item}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Add to wishlist"
                    value={wishlistInput}
                    onChange={(e) => setWishlistInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddToWishlist()}
                    className="bg-white/80 border-[#483285]/30 placeholder:text-slate-500 text-gray-500"
                    defaultValue="Psychology of Money"
                  />
                  <Button className="bg-[#a855f7] hover:bg-[#9333ea]" onClick={handleAddToWishlist}>Add</Button>
                </div>
              </div>

              <div className="bg-[#462C90] p-4 rounded-xl shadow-md">
                <h3 className="font-bold mb-2">reading goals</h3>
                <div className="space-y-2">
                  {readingGoals.map((goal, index) => (
                    <p key={index} className="text-gray-500 text-sm bg-white/80 p-2 rounded-md">
                      {goal}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Add a reading goal"
                    value={readingGoalsInput}
                    onChange={(e) => setReadingGoalsInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddToReadingGoals()}
                    className="bg-white/80 border-[#483285]/30 placeholder:text-slate-500 text-gray-500"
                    defaultValue="Read Psychology of Money"
                  />
                  <Button className="bg-[#a855f7] hover:bg-[#9333ea]" onClick={handleAddToReadingGoals}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#E1B5EE] p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className="flex justify-center items-start gap-4">
            <div className="w-full lg:w-[70%]">
              <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">My Library</h2>
              <div className="space-y-8 bg-white p-6 rounded-xl">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-600">currently reading</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <BookCover imageUrl="/psychology.png" title="Psychology of Money" author="Morgan Housel" rating={3} />
                  </div>
                  <hr className="mt-4 border-8 rounded-full" style={{ borderColor: "#BA7FCB" }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-600">lined up next</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <BookCover imageUrl="/psychology.png" title="Psychology of Money" author="Morgan Housel" rating={3} />
                    <BookCover imageUrl="/psychology.png" title="The Alchemist" author="Paulo Coelho" rating={4} />
                    <BookCover imageUrl="/psychology.png" title="1984" author="George Orwell" rating={4} />
                    <BookCover imageUrl="/psychology.png" title="Good Murder Guide" author="Holly Jackson" rating={4} />
                  </div>
                  <hr className="mt-4 border-8 rounded-full" style={{ borderColor: "#BA7FCB" }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-600">finished reading</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <BookCover imageUrl="/psychology.png" title="Psychology of Money" author="Morgan Housel" rating={3} />
                    <BookCover imageUrl="/psychology.png" title="The Alchemist" author="Paulo Coelho" rating={4} />
                    <BookCover imageUrl="/psychology.png" title="1984" author="George Orwell" rating={4} />
                    <BookCover imageUrl="/psychology.png" title="Good Murder Guide" author="Holly Jackson" rating={4} />
                    <BookCover imageUrl="/psychology.png" title="The Alchemist" author="Paulo Coelho" rating={5} />
                  </div>
                  <hr className="mt-4 border-8 rounded-full" style={{ borderColor: "#BA7FCB" }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-600">reviewed</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <BookCover imageUrl="/psychology.png" title="Psychology of Money" author="Morgan Housel" rating={3} />
                    <BookCover imageUrl="/psychology.png" title="The Alchemist" author="Paulo Coelho" rating={4} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
