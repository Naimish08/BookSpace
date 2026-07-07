"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRealtimeBooks } from "@/hooks/useRealtimeBooks"

interface ApiBook {
	id: string
	name: string
	author: string
	genre: string
	image: string
	created_at: string
}

// Fallback data shown when the database has no books yet (keeps demos populated)
const fallbackBooks: ApiBook[] = [
	{ id: "fb-1", name: "The Psychology of Money", author: "MORGAN HOUSEL", genre: "Finance", image: "/psychology.png", created_at: "" },
	{ id: "fb-2", name: "1984", author: "GEORGE ORWELL", genre: "Classics", image: "/georgeorwell.png", created_at: "" },
	{ id: "fb-3", name: "The Alchemist", author: "PAULO COELHO", genre: "Fiction", image: "/thealchemist.png", created_at: "" },
]

export default function BookCarousel() {
	const [initialBooks, setInitialBooks] = useState<ApiBook[]>([])
	const [loaded, setLoaded] = useState(false)

	// Initial fetch from the API
	useEffect(() => {
		let active = true
		fetch("/api/books")
			.then((res) => (res.ok ? res.json() : []))
			.then((data: ApiBook[]) => {
				if (!active) return
				setInitialBooks(Array.isArray(data) && data.length > 0 ? data : fallbackBooks)
				setLoaded(true)
			})
			.catch(() => {
				if (!active) return
				setInitialBooks(fallbackBooks)
				setLoaded(true)
			})
		return () => {
			active = false
		}
	}, [])

	// Live updates via Supabase Realtime
	const books = useRealtimeBooks(initialBooks)

	const [currentIndex, setCurrentIndex] = useState(0)
	const maxIndex = Math.max(0, Math.ceil(books.length / 3) - 1)
	const carouselRef = useRef<HTMLDivElement>(null)

	const goToNext = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
	}

	const goToPrev = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0))
	}

	// Keep the active page in range if the book count changes (realtime insert/delete)
	useEffect(() => {
		setCurrentIndex((prev) => Math.min(prev, maxIndex))
	}, [maxIndex])

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

		// Wait for next frame to ensure layout is ready
		requestAnimationFrame(handleScroll)
	}, [currentIndex])

	if (loaded && books.length === 0) {
		return (
			<div className="text-center py-10 text-[#8d6e63]">No books available yet.</div>
		)
	}

	return (
		<div className="relative">
			<div
				ref={carouselRef}
				className="flex overflow-x-hidden overflow-y-hidden snap-x snap-mandatory scroll-smooth"
				style={{ touchAction: "pan-y" }}
			>
				{Array.from({ length: Math.ceil(books.length / 3) }).map((_, pageIndex) => (
					<div
						key={pageIndex}
						className="min-w-full flex-shrink-0 snap-center grid grid-cols-3 gap-4 px-4"
					>
						{books
							.slice(pageIndex * 3, pageIndex * 3 + 3)
							.map((book) => (
								<div
									key={book.id}
									className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
								>
									<div className="w-full h-full bg-[#d1a7c2] rounded-lg">
										<div className="relative aspect-[3/4]">
											<Image
												src={book.image || "/placeholder.svg"}
												alt={book.name}
												fill
												className="object-cover"
											/>
											<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
												<h3 className="text-white font-bold text-lg">
													{book.name}
												</h3>
												{book.author && (
													<p className="text-white text-sm">
														{book.author}
													</p>
												)}
												{book.genre && (
													<p className="text-white/90 text-xs mt-1">
														{book.genre}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				))}
			</div>

			{currentIndex > 0 && (
				<Button
					variant="outline"
					size="icon"
					className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10 w-10 h-10"
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
					className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10 w-10 h-10"
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
						className={`w-2 h-2 rounded-full ${
							i === currentIndex ? "bg-[#a87c9f]" : "bg-gray-300"
						}`}
						onClick={() => setCurrentIndex(i)}
						aria-label={`Go to page ${i + 1}`}
					/>
				))}
			</div>
		</div>
	)
}
