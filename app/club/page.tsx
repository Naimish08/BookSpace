"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Instagram, Youtube, Twitter, Globe, Plus, Minus, BookOpen, Target, Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import BookCarousel from "@/components/book-carousel"
import Image from "next/image"
import {OnboardingModal} from "@/components/onboarding-modal"
import { createClient } from "@/utils/superbase/client"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
}

// Plant growth stages based on progress percentage
const getPlantStage = (progress: number) => {
  if (progress === 0) return "🌰" // seed
  if (progress <= 20) return "🌱" // sprout
  if (progress <= 40) return "🌿" // small plant
  if (progress <= 60) return "🪴" // growing plant
  if (progress <= 80) return "🌳" // tree
  return "🌸" // blooming tree
}

// Get plant representation for the garden
const getGardenPlants = (progress: number) => {
  const stages = Math.floor(progress / 20)
  const plants = []
  
  for (let i = 0; i < 5; i++) {
    if (i < stages) {
      plants.push(getPlantStage((i + 1) * 20))
    } else if (i === stages && progress % 20 > 0) {
      plants.push(getPlantStage(progress))
    } else {
      plants.push("🌰")
    }
  }
  return plants
}

export default function Component() {
  // Combined all state declarations
  const [currentBooks, setCurrentBooks] = useState({
    fiction: { title: "", currentPage: 0, totalPages: 0, progress: 0 },
    nonFiction: { title: "", currentPage: 0, totalPages: 0, progress: 0 }
  })

  const [yearlyGoals, setYearlyGoals] = useState({
    fictionTarget: 12,
    nonFictionTarget: 8,
    fictionCompleted: 7,
    nonFictionCompleted: 5
  })

  const [fictionProgress, setFictionProgress] = useState(60)
  const [nonFictionProgress, setNonFictionProgress] = useState(80)
  const [dailyReadingGoal, setDailyReadingGoal] = useState(30) // minutes
  const [todayProgress, setTodayProgress] = useState(15) // minutes read today
  const [readingStreak, setReadingStreak] = useState(5) // days

  // New state variables for editing goals
  const [isEditingDaily, setIsEditingDaily] = useState(false)
  const [isEditingYearly, setIsEditingYearly] = useState(false)
  const [tempDailyGoal, setTempDailyGoal] = useState(dailyReadingGoal)
  const [tempYearlyGoals, setTempYearlyGoals] = useState({
    fictionTarget: yearlyGoals.fictionTarget,
    nonFictionTarget: yearlyGoals.nonFictionTarget
  })

  const [currentlyReading, setCurrentlyReading] = useState<any[]>([])

  // Load real catalog books if user doesn't have custom reading list
  useEffect(() => {
    fetch("/api/books?limit=4&sort=popular")
      .then((res) => (res.ok ? res.json() : { books: [] }))
      .then((data: any) => {
        if (Array.isArray(data.books) && data.books.length > 0) {
          setCurrentlyReading(
            data.books.map((b: any, idx: number) => ({
              id: b.id,
              title: b.name,
              genre: b.genre,
              progress: 50 + idx * 10,
              coverImage: b.image || "https://covers.openlibrary.org/b/id/10521270-L.jpg",
              bookId: b.id,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  // Update the showOnboarding state declaration
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Check auth and onboarding status
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        // Show onboarding only on first visit after signup
        const onboardingDone = localStorage.getItem(`onboarding_done_${session.user.id}`);
        if (!onboardingDone && localStorage.getItem('showOnboarding') === 'true') {
          setShowOnboarding(true);
        }
        
        // Fetch profile to set yearlyGoals, dailyReadingGoal, todayProgress
        try {
          const res = await fetch(`/api/users?id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.bookspaceProfile) {
              setYearlyGoals(prev => ({
                ...prev,
                fictionTarget: data.bookspaceProfile.fiction_target || prev.fictionTarget,
                nonFictionTarget: data.bookspaceProfile.nonfiction_target || prev.nonFictionTarget,
              }));
              setTempYearlyGoals({
                fictionTarget: data.bookspaceProfile.fiction_target || 12,
                nonFictionTarget: data.bookspaceProfile.nonfiction_target || 8,
              });
              setDailyReadingGoal(data.bookspaceProfile.daily_minutes || 30);
              setTempDailyGoal(data.bookspaceProfile.daily_minutes || 30);
              setTodayProgress(data.bookspaceProfile.today_minutes || 0);
            }
          }
        } catch (e) { console.error('Failed to fetch profile:', e); }

        // Fetch book diary for currently reading
        try {
          const res = await fetch(`/api/book-diary?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            const reading = data.entries?.filter((e: any) => e.type === 'reading') || [];
            if (reading.length > 0) {
              setCurrentlyReading(reading.map((e: any) => ({
                id: e.id,
                title: e.book.name,
                genre: e.book.genre,
                progress: e.progress || 0,
                coverImage: e.book.image || 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
                bookId: e.book_id
              })));
            }
          }
        } catch (e) { console.error('Failed to fetch book diary:', e); }

        // Fetch streak from API
        try {
          const res = await fetch(`/api/streak?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setReadingStreak(data.currentStreak || 0);
          }
        } catch (e) { console.error('Failed to fetch streak:', e); }
        // Fetch badges
        try {
          const res = await fetch(`/api/badges?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setEarnedBadges(data.allBadges || []);
          }
        } catch (e) { console.error('Failed to fetch badges:', e); }
      }
    };
    init();
  }, []);

  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);

  // Functions
  const updateProgress = (type: 'fiction' | 'nonFiction', change: number) => {
    if (type === 'fiction') {
      setFictionProgress(prev => Math.max(0, Math.min(100, prev + change)))
    } else {
      setNonFictionProgress(prev => Math.max(0, Math.min(100, prev + change)))
    }
  }

  const updateBookInfo = (type: 'fiction' | 'nonFiction', field: string, value: any) => {
    setCurrentBooks(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
        progress: field === 'totalPages' || field === 'currentPage' 
          ? prev[type].totalPages > 0 ? Math.round((prev[type].currentPage / (field === 'totalPages' ? value : prev[type].totalPages)) * 100) : 0
          : prev[type].progress
      }
    }))
  }

  const markBookCompleted = (type: 'fiction' | 'nonFiction') => {
    setYearlyGoals(prev => ({
      ...prev,
      [`${type}Completed`]: prev[`${type}Completed`] + 1
    }))
    setCurrentBooks(prev => ({
      ...prev,
      [type]: { title: "", currentPage: 0, totalPages: 0, progress: 0 }
    }))
  }

  const markDailyReading = async () => {
    const newProgress = Math.min(dailyReadingGoal, todayProgress + 15)
    setTodayProgress(newProgress)
    if (newProgress >= dailyReadingGoal && todayProgress < dailyReadingGoal) {
      setReadingStreak(prev => prev + 1)
    }
    // Persist streak to API
    if (userId) {
      try {
        const res = await fetch('/api/streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, today_minutes: newProgress })
        });
        if (res.ok) {
          const data = await res.json();
          setReadingStreak(data.currentStreak || 0);
        }
        
        // Update profile directly for today_minutes if streak API doesn't do it
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, today_minutes: newProgress })
        }).catch(() => {});

        // Also check for new badges
        await fetch('/api/badges/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
      } catch (e) { console.error('Failed to log streak:', e); }
    }
  }

  const handleDailyGoalUpdate = async () => {
    setDailyReadingGoal(tempDailyGoal)
    setIsEditingDaily(false)
    if (userId) {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, daily_minutes: tempDailyGoal })
      }).catch(() => {});
    }
  }

  const handleYearlyGoalsUpdate = async () => {
    setYearlyGoals(prev => ({
      ...prev,
      fictionTarget: tempYearlyGoals.fictionTarget,
      nonFictionTarget: tempYearlyGoals.nonFictionTarget
    }))
    setIsEditingYearly(false)
    if (userId) {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          fiction_target: tempYearlyGoals.fictionTarget,
          nonfiction_target: tempYearlyGoals.nonFictionTarget
        })
      }).catch(() => {});
    }
  }

  const updateBookProgress = (bookId: any) => {
    setCurrentlyReading(prev => prev.map(book => {
      if (book.id === bookId) {
        const newProgress = Math.min(100, book.progress + 10) // Increment by 10%
        return {
          ...book,
          progress: newProgress
        }
      }
      return book
    }))
  }

  // Fixed handleOnboardingComplete to match modal answer keys
  const handleOnboardingComplete = async (answers: any) => {
    // step1 = interests (string[])
    // step2 = genres (string[])
    // step3_fiction = fiction target
    // step3_nonFiction = nonFiction target
    // step4 = daily reading time (e.g. "30 mins")
    // step5 = preferred reading time
    
    if (answers.step3_fiction && answers.step3_nonFiction) {
      setYearlyGoals(prev => ({
        ...prev,
        fictionTarget: parseInt(answers.step3_fiction) || prev.fictionTarget,
        nonFictionTarget: parseInt(answers.step3_nonFiction) || prev.nonFictionTarget
      }));
    }
    
    if (answers.step4) {
      const minutes = parseInt(answers.step4.split(' ')[0]);
      if (!isNaN(minutes)) setDailyReadingGoal(minutes);
    }

    // Persist to database
    if (userId) {
      try {
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            interests: answers.step1 || [],
            genres: answers.step2 || [],
            fictionTarget: parseInt(answers.step3_fiction) || 12,
            nonFictionTarget: parseInt(answers.step3_nonFiction) || 8,
            dailyReadingTime: answers.step4 || '30 mins',
            preferredTime: answers.step5 || 'Flexible'
          })
        });
        localStorage.setItem(`onboarding_done_${userId}`, 'true');
        localStorage.removeItem('showOnboarding');
      } catch (e) {
        console.error('Failed to persist onboarding:', e);
      }
    }
    
    setShowOnboarding(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 font-poppins">

      {/* Header - Full width */}
      <div className="w-full bg-[#462C90] py-6 flex justify-center items-center">
        <h1 className="font-caveat text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] leading-tight text-white text-center">
          BOOKCLUB
        </h1>
      </div>

      {/* Book Input Section */}
      <div className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#E1B5EE] rounded-[127px] p-6 flex items-center">
            <p className="font-literata text-lg md:text-xl text-gray-700 ml-6">
              Hey, which book are you reading?
            </p>
            <input 
              type="text" 
              placeholder="Tell us here" 
              className="flex-1 ml-4 p-2 font-literata text-lg bg-[#E1B5EE] focus:outline-none border-b-2 border-white placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      {/* June's Read Section */}
      <section className="w-full bg-gradient-to-b from-[#E1B5EE] to-[#704CAA] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-lg p-8 mb-8">
            <h2 className="text-5xl font-bold text-white text-center mb-12 font-playfair">June's Read</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-[#5B3D8F] rounded-lg p-8 mb-6 h-64 flex items-center justify-center">
                  <Image 
                    src="/goodgirlsguide.png" 
                    alt="Fiction Book Cover" 
                    width={160} 
                    height={240} 
                    className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
                <h3 className="text-3xl font-bold text-white font-playfair">Fiction</h3>
              </div>
              <div className="text-center">
                <div className="bg-[#5B3D8F] rounded-lg p-8 mb-6 h-64 flex items-center justify-center">
                  <Image 
                    src="/psychology.png" 
                    alt="Non-Fiction Book Cover" 
                    width={160} 
                    height={240}
                    className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
                <h3 className="text-3xl font-bold text-white font-playfair">Non-Fiction</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Progress Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-8 mb-8">
            
            {/* Daily Reading Tracker */}
            <div className="bg-purple-800 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-2xl font-bold text-white text-center">Today's Reading Goal</h3>
                <button
                  onClick={() => setIsEditingDaily(!isEditingDaily)}
                  className="text-white hover:text-purple-200 p-1 rounded-full"
                >
                  ✏️
                </button>
              </div>
              
              {isEditingDaily ? (
                <div className="flex items-center justify-center gap-4 mb-4">
                  <input
                    type="number"
                    value={tempDailyGoal}
                    onChange={(e) => setTempDailyGoal(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded bg-purple-700 text-white text-center"
                    min="1"
                  />
                  <button
                    onClick={handleDailyGoalUpdate}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-white">📚 {todayProgress}/{dailyReadingGoal} minutes</span>
                  <Button 
                    onClick={markDailyReading}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full"
                    disabled={todayProgress >= dailyReadingGoal}
                  >
                    +15 min
                  </Button>
                  <Button 
                    onClick={() => setIsEditingDaily(true)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-full"
                  >
                    Edit Goal
                  </Button>
                </div>
              )}
              
              <Progress value={(todayProgress / dailyReadingGoal) * 100} className="w-full mb-2" />
              <p className="text-center text-white text-sm">
                {todayProgress >= dailyReadingGoal ? "🎉 Goal completed!" : `${dailyReadingGoal - todayProgress} minutes left`}
              </p>
            </div>

            {/* My Progress Section */}
            <div className="bg-purple-800 rounded-lg p-8 mb-8">
              <h3 className="text-6xl font-bold text-white text-center mb-8 font-playfair">My Progress</h3>
              
              <div className="relative group">
                {/* Left Navigation Button */}
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-purple-700/80 hover:bg-purple-600 text-white rounded-full p-2 -ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const container = document.getElementById('book-scroll')
                    if (container) {
                      container.scrollBy({ left: -620, behavior: 'smooth' })
                    }
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Navigation Button */}
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-purple-700/80 hover:bg-purple-600 text-white rounded-full p-2 -mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const container = document.getElementById('book-scroll')
                    if (container) {
                      container.scrollBy({ left: 620, behavior: 'smooth' })
                    }
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Scrollable Content */}
                <div 
                  id="book-scroll"
                  className="overflow-x-hidden pb-4 hide-scrollbar scroll-smooth"
                >
                  <div className="grid grid-flow-col gap-5 auto-cols-[300px] px-4">
                    {currentlyReading.map((book) => (
                      <div 
                        key={book.id} 
                        className="bg-purple-900 rounded-lg p-6 w-[300px]"
                      >
                        <div className="flex gap-4 mb-4">
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            
                            width={80}
                            height={120}
                            className="rounded-md shadow-lg"
                          />
                          <div className="flex flex-col justify-between">
                            <div>
                              <h4 className="text-white font-bold text-lg mb-1 line-clamp-2">{book.title}</h4>
                              <p className="text-purple-200 text-sm">{book.genre}</p>
                            </div>
                            <div className="text-white text-xl font-bold">{book.progress}%</div>
                          </div>
                        </div>

                        {/* Plant Garden */}
                        <div className="bg-amber-600 rounded-lg p-3 mb-4 h-20 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-amber-800 rounded-b-lg"></div>
                          <div className="flex space-x-2 z-10">
                            {getGardenPlants(book.progress).map((plant, index) => (
                              <motion.div 
                                key={index} 
                                className="text-2xl"
                                initial={{ scale: 0.5, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {plant}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <Progress value={book.progress} className="mb-2" />
                        
                        {book.progress === 100 ? (
                          <p className="text-yellow-300 text-sm font-bold">🎉 Completed!</p>
                        ) : (
                          <div className="flex justify-between items-center">
                            <Button 
                              onClick={() => updateBookProgress(book.id)}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-full text-sm"
                              disabled={book.progress >= 100}
                            >
                              Update Progress
                            </Button>
                            <span className="text-purple-200 text-sm">{100 - book.progress}% left</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold">
                Read this Book? Wanna share your thoughts?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Yearly Goals Overview */}
      <section className="w-full py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8 font-playfair">2025 Reading Goals</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Fiction Goal */}
              <div className="bg-purple-800 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BookOpen className="w-8 h-8 text-yellow-400" />
                  <button
                    onClick={() => setIsEditingYearly(!isEditingYearly)}
                    className="text-white hover:text-purple-200 p-1 rounded-full"
                  >
                    ✏️
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fiction</h3>
                {isEditingYearly ? (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <input
                      type="number"
                      value={tempYearlyGoals.fictionTarget}
                      onChange={(e) => setTempYearlyGoals(prev => ({
                        ...prev,
                        fictionTarget: Number(e.target.value)
                      }))}
                      className="w-16 px-2 py-1 rounded bg-purple-700 text-white text-center"
                      min="1"
                    />
                    <button
                      onClick={handleYearlyGoalsUpdate}
                      className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded-full text-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-white mb-2">
                    {yearlyGoals.fictionCompleted}/{yearlyGoals.fictionTarget}
                  </div>
                )}
                <Progress value={(yearlyGoals.fictionCompleted / yearlyGoals.fictionTarget) * 100} className="mb-2" />
                <p className="text-purple-200 text-sm">
                  {yearlyGoals.fictionTarget - yearlyGoals.fictionCompleted} books to go
                </p>
              </div>

              {/* Non-Fiction Goal */}
              <div className="bg-purple-800 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Target className="w-8 h-8 text-green-400" />
                  <button
                    onClick={() => setIsEditingYearly(!isEditingYearly)}
                    className="text-white hover:text-purple-200 p-1 rounded-full"
                  >
                    ✏️
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Non-Fiction</h3>
                {isEditingYearly ? (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <input
                      type="number"
                      value={tempYearlyGoals.nonFictionTarget}
                      onChange={(e) => setTempYearlyGoals(prev => ({
                        ...prev,
                        nonFictionTarget: Number(e.target.value)
                      }))}
                      className="w-16 px-2 py-1 rounded bg-purple-700 text-white text-center"
                      min="1"
                    />
                    <button
                      onClick={handleYearlyGoalsUpdate}
                      className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded-full text-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-white mb-2">
                    {yearlyGoals.nonFictionCompleted}/{yearlyGoals.nonFictionTarget}
                  </div>
                )}
                <Progress value={(yearlyGoals.nonFictionCompleted / yearlyGoals.nonFictionTarget) * 100} className="mb-2" />
                <p className="text-purple-200 text-sm">
                  {yearlyGoals.nonFictionTarget - yearlyGoals.nonFictionCompleted} books to go
                </p>
              </div>

              {/* Reading Streak */}
              <div className="bg-purple-800 rounded-lg p-6 text-center">
                <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Reading Streak</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {readingStreak} days
                </div>
                <div className="text-purple-200 text-sm mb-2">Keep it up! 🔥</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges & Milestone Achievements Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-800 to-[#462C90] rounded-2xl p-8 shadow-2xl border border-purple-400/30">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white font-playfair tracking-wide flex items-center justify-center gap-3">
                🏆 Reading Badges & Achievements
              </h3>
              <p className="text-purple-200 text-sm mt-2">
                Unlock milestone badges by reading books, maintaining streaks, and connecting with community members.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(earnedBadges.length > 0
                ? earnedBadges
                : [
                    { name: '📚 First Read', description: 'Complete your first book', earned: true },
                    { name: '🔥 Streak Master', description: '7-day reading streak', earned: readingStreak >= 7 },
                    { name: '⭐ Bookworm', description: 'Complete 5 books', earned: false },
                    { name: '🏆 Bibliophile', description: 'Complete 10 books', earned: false },
                    { name: '✍️ First Blog', description: 'Publish your first blog post', earned: false },
                    { name: '🤝 Social Reader', description: 'Make 5 connections', earned: false },
                    { name: '📅 Event Explorer', description: 'Participate in an event', earned: false },
                  ]
              ).map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl text-center border transition-all ${
                    badge.earned
                      ? 'bg-gradient-to-b from-[#BA7FCB]/40 to-[#483285] border-yellow-400/50 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white/40 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.name.split(' ')[0]}</div>
                  <h4 className="font-bold text-sm text-white">{badge.name.slice(3)}</h4>
                  <p className="text-xs text-white/70 mt-1">{badge.description}</p>
                  <span
                    className={`inline-block mt-3 px-3 py-0.5 rounded-full text-[10px] font-bold ${
                      badge.earned ? 'bg-yellow-400 text-purple-900' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {badge.earned ? 'UNLOCKED ✨' : 'LOCKED 🔒'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books We've Read Section */}
      <motion.section className="max-w-5xl mx-auto px-4 py-8 mb-12 overflow-x-hidden overflow-y-visible" 
        initial="initial" 
        whileInView="animate" 
        viewport={{ once: true }} 
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-merriweather text-[#241943] text-center mb-8 font-bold">Books We've Read</h2>
        <BookCarousel />
      </motion.section>

      {/* Book Discussion Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-yellow-100 rounded-lg p-10 mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-playfair">
              Have a book you wanna discuss for the book club?
            </h2>
            <p className="text-2xl text-gray-700 font-poppins">Tell us here _______________</p>
          </div>
        </div>
      </section>

      {/* Add this CSS to your global styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Onboarding Modal - Add this at the end of your return statement */}
      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  )
}
