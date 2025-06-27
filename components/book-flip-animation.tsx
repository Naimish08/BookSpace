"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export default function BookFlipAnimation() {
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    // Start the animation after component mounts
    const timer = setTimeout(() => {
      setIsFlipping(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-60 h-60">
      {/* Book cover */}
      <motion.div
        className="absolute w-40 h-56 bg-[#8d6e63] rounded-r shadow-lg left-10 top-2"
        animate={{
          rotateY: isFlipping ? [-10, 170] : -10,
          zIndex: isFlipping ? 1 : 2,
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 2,
        }}
      >
        <div className="absolute inset-2 bg-[#f8efd0] rounded-r flex items-center justify-center">
          <span className="text-[#5d4037] font-serif text-lg">BookSpace</span>
        </div>
      </motion.div>

      {/* Book pages */}
      <motion.div
        className="absolute w-40 h-56 bg-white rounded-r shadow-md left-10 top-2"
        animate={{
          rotateY: isFlipping ? [-5, 0, 5, 0, -5] : -5,
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />

      {/* Floating elements */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-full bg-[#d1a7c2] flex items-center justify-center text-white"
          initial={{
            x: 60 + i * 20,
            y: 20 + i * 15,
            opacity: 0,
          }}
          animate={{
            y: [null, -20 - i * 5, -40 - i * 10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <BookOpen size={16} />
        </motion.div>
      ))}
    </div>
  )
}
