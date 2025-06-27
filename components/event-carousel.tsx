"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const books = [
  {
    id: 1,
    title: "Book Review Show",
    image: "/bookreview.png",
    link: "/link",
  },
  {
    id: 2,
    title: "BookSpace",
    subtitle: "Book Exchange • Blind Date with a Book",
    date: "14th Feb",
    description: "International Event during Day Special",
    image: "/bookexchange.png",
    link: "https://example.com/bookspace",
  },
  {
    id: 3,
    title: "Book Drive",
    subtitle: "Literacy Drive",
    image: "/literacydrive.png",
    color: "#ffd166",
    link: "https://example.com/bookdrive",
  },
  {
    id: 4,
    title: "Event4",
    subtitle: "Event4",
    date: "NAN",
    description: "NAN",
    image: "/placeholder.svg",
    link: "https://example.com/bookspace",
  },
  {
    id: 5,
    title: "Event5",
    subtitle: "Event5",
    date: "NAN",
    description: "NAN",
    image: "/placeholder.svg",
    link: "https://example.com/bookspace",
  },
  {
    id: 6,
    title: "Event6",
    subtitle: "Event6",
    date: "NAN",
    description: "NAN",
    image: "/placeholder.svg",
    link: "https://example.com/bookspace",
  },
]

export default function BookCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = Math.ceil(books.length / 3) - 1
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.offsetWidth * currentIndex
        carouselRef.current.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        })
      }
    }
  
    requestAnimationFrame(handleScroll)
  }, [currentIndex])

  return (
    <div className="relative">
      <div ref={carouselRef} className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth">
        {Array.from({ length: Math.ceil(books.length / 3) }).map((_, pageIndex) => (
          <div key={pageIndex} className="min-w-full flex-shrink-0 snap-center grid grid-cols-3 gap-4">
            {books.slice(pageIndex * 3, pageIndex * 3 + 3).map((book) => (
              <a
                key={book.id}
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
              >
                <div
                  className="w-full h-full bg-[#d1a7c2] rounded-lg"
                  style={{ backgroundColor: book.color || "#d1a7c2" }}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />

                    {book.tag && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        {book.tag}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg">{book.title}</h3>
                      {book.subtitle && <p className="text-white text-sm">{book.subtitle}</p>}
                      {book.date && <p className="text-white font-bold mt-1">{book.date}</p>}
                      {book.description && <p className="text-white/90 text-xs mt-1">{book.description}</p>}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
          onClick={goToPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
      )}

      {currentIndex < maxIndex && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      )}

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-[#a87c9f]" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
