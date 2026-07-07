"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiEvent {
	id: string
	event_name: string
	description: string
	venue: string
	time: string
	image: string
	blog_link: string
	_count?: { participants: number }
}

// Fallback data shown when the database has no events yet (keeps demos populated)
const fallbackEvents: ApiEvent[] = [
	{ id: "fe-1", event_name: "Book Review Show", description: "Community book reviews", venue: "Online", time: "", image: "/bookreview.png", blog_link: "" },
	{ id: "fe-2", event_name: "Book Exchange", description: "Blind Date with a Book", venue: "Vile Parle", time: "", image: "/bookexchange.png", blog_link: "" },
	{ id: "fe-3", event_name: "Literacy Drive", description: "Book Donation Drive", venue: "Mumbai", time: "", image: "/literacydrive.png", blog_link: "" },
]

export default function EventCarousel() {
	const [events, setEvents] = useState<ApiEvent[]>([])
	const [loaded, setLoaded] = useState(false)

	// Initial fetch from the API
	useEffect(() => {
		let active = true
		fetch("/api/events")
			.then((res) => (res.ok ? res.json() : { events: [] }))
			.then((data: { events?: ApiEvent[] }) => {
				if (!active) return
				const list = data.events ?? []
				setEvents(list.length > 0 ? list : fallbackEvents)
				setLoaded(true)
			})
			.catch(() => {
				if (!active) return
				setEvents(fallbackEvents)
				setLoaded(true)
			})
		return () => {
			active = false
		}
	}, [])

	const [currentIndex, setCurrentIndex] = useState(0)
	const maxIndex = Math.max(0, Math.ceil(events.length / 3) - 1)
	const carouselRef = useRef<HTMLDivElement>(null)

	const goToNext = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
	}

	const goToPrev = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0))
	}

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

		requestAnimationFrame(handleScroll)
	}, [currentIndex])

	if (loaded && events.length === 0) {
		return (
			<div className="text-center py-10 text-[#241943]">No past events yet.</div>
		)
	}

	const formatDate = (time: string) => {
		if (!time) return ""
		const d = new Date(time)
		if (isNaN(d.getTime())) return ""
		return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
	}

	return (
		<div className="relative">
			<div
				ref={carouselRef}
				className="flex overflow-x-hidden overflow-y-hidden snap-x snap-mandatory scroll-smooth"
			>
				{Array.from({ length: Math.ceil(events.length / 3) }).map((_, pageIndex) => (
					<div
						key={pageIndex}
						className="min-w-full flex-shrink-0 snap-center grid grid-cols-3 gap-4"
					>
						{events
							.slice(pageIndex * 3, pageIndex * 3 + 3)
							.map((event) => (
								<div
									key={event.id}
									className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
								>
									<div className="w-full h-full bg-[#d1a7c2] rounded-lg">
										<div className="relative aspect-[3/4]">
											<Image
												src={event.image || "/placeholder.svg"}
												alt={event.event_name}
												fill
												className="object-cover"
											/>

											<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
												<h3 className="text-white font-bold text-lg">
													{event.event_name}
												</h3>
												{event.description && (
													<p className="text-white text-sm">
														{event.description}
													</p>
												)}
												{formatDate(event.time) && (
													<p className="text-white font-bold mt-1">
														{formatDate(event.time)}
													</p>
												)}
												{typeof event._count?.participants === "number" && (
													<p className="text-white/90 text-xs mt-1">
														{event._count.participants} registered
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
