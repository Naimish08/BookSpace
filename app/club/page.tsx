"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Instagram, Youtube, Twitter, Globe, Plus, Minus, BookOpen, Target, Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import BookCarousel from "@/components/book-carousel"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

// Plant growth stages based on progress percentage
const getPlantStage = (progress) => {
  if (progress === 0) return "🌰" // seed
  if (progress <= 20) return "🌱" // sprout
  if (progress <= 40) return "🌿" // small plant
  if (progress <= 60) return "🪴" // growing plant
  if (progress <= 80) return "🌳" // tree
  return "🌸" // blooming tree
}

// Get plant representation for the garden
const getGardenPlants = (progress) => {
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

  const [currentlyReading, setCurrentlyReading] = useState([
    {
      id: 1,
      title: "The Good Girl's Guide to Murder",
      genre: "Fiction - Mystery",
      progress: 65,
      coverImage: "/goodgirlsguide.png"
    },
    {
      id: 2,
      title: "Psychology of Money",
      genre: "Non-Fiction - Finance",
      progress: 30,
      coverImage: "/psychology.png"
    },
    {
      id: 3,
      title: "Project Hail Mary",
      genre: "Fiction - Sci-Fi",
      progress: 85,
      coverImage: "/goodgirlsguide.png"
    },
    {
      id: 4,
      title: "Atomic Habits",
      genre: "Non-Fiction - Self Help",
      progress: 45,
      coverImage: "/psychology.png"
    }
  ])

  // Functions
  const updateProgress = (type, change) => {
    if (type === 'fiction') {
      setFictionProgress(prev => Math.max(0, Math.min(100, prev + change)))
    } else {
      setNonFictionProgress(prev => Math.max(0, Math.min(100, prev + change)))
    }
  }

  const updateBookInfo = (type, field, value) => {
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

  const markBookCompleted = (type) => {
    setYearlyGoals(prev => ({
      ...prev,
      [`${type}Completed`]: prev[`${type}Completed`] + 1
    }))
    setCurrentBooks(prev => ({
      ...prev,
      [type]: { title: "", currentPage: 0, totalPages: 0, progress: 0 }
    }))
  }

  const markDailyReading = () => {
    const newProgress = Math.min(dailyReadingGoal, todayProgress + 15)
    setTodayProgress(newProgress)
    if (newProgress >= dailyReadingGoal && todayProgress < dailyReadingGoal) {
      setReadingStreak(prev => prev + 1)
    }
  }

  const handleDailyGoalUpdate = () => {
    setDailyReadingGoal(tempDailyGoal)
    setIsEditingDaily(false)
  }

  const handleYearlyGoalsUpdate = () => {
    setYearlyGoals(prev => ({
      ...prev,
      fictionTarget: tempYearlyGoals.fictionTarget,
      nonFictionTarget: tempYearlyGoals.nonFictionTarget
    }))
    setIsEditingYearly(false)
  }

  const updateBookProgress = (bookId) => {
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

      {/* Badges Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6 font-playfair">Fiction</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="w-14 h-14 bg-purple-900 rounded-lg"></div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="bg-purple-700 rounded-lg p-6 mb-4">
                  <h3 className="text-4xl font-bold text-white mb-4 font-playfair tracking-widest">BADGES</h3>
                  <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-6"></div>
                  <div className="bg-purple-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-bold mb-3 text-xl font-playfair">Analytics</h4>
                    <p className="text-white text-sm font-poppins">fiction vs non fiction pie chart</p>
                    <p className="text-white text-sm font-poppins">below new batch unlocked</p>
                  </div>
                  <p className="text-white text-sm font-poppins font-medium">congrats, you unlocked a new badge</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6 font-playfair">Non Fiction</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="w-14 h-14 bg-purple-900 rounded-lg"></div>
                  ))}
                </div>
              </div>
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
    </div>
  )
}
