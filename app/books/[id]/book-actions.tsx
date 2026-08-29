"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, BookOpen, Repeat } from "lucide-react"
import { createClient } from "@/utils/superbase/client"
import { toast } from "sonner"

export default function BookActions({ bookId, bookName }: { bookId: string, bookName: string }) {
	const [userId, setUserId] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const supabase = createClient()

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) {
				setUserId(session.user.id)
			}
		})
	}, [supabase])

	const handleAction = async (action: 'wishlist' | 'diary' | 'exchange') => {
		if (!userId) {
			toast.error("Please sign in to perform this action")
			return
		}

		setIsLoading(true)
		try {
			if (action === 'wishlist') {
				const res = await fetch('/api/wishlist', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId, bookId })
				})
				if (!res.ok) throw new Error("Failed to add to wishlist")
				toast.success(`Added ${bookName} to your wishlist`)
			} else if (action === 'diary') {
				const res = await fetch('/api/book-diary', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ user_id: userId, book_id: bookId, type: 'reading' })
				})
				if (!res.ok) throw new Error("Failed to add to diary")
				toast.success(`Added ${bookName} to your reading diary`)
			} else if (action === 'exchange') {
				const res = await fetch('/api/exchanges', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ user_id: userId, book_id: bookId })
				})
				if (!res.ok) throw new Error("Failed to request exchange")
				toast.success(`Requested exchange for ${bookName}`)
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex flex-wrap gap-4">
			<Button 
				onClick={() => handleAction('wishlist')} 
				disabled={isLoading}
				className="flex-1 bg-[#BA7FCB] hover:bg-[#462C90] text-white transition-colors flex items-center gap-2"
			>
				<Heart size={18} />
				Add to Wishlist
			</Button>
			<Button 
				onClick={() => handleAction('diary')} 
				disabled={isLoading}
				variant="outline"
				className="flex-1 border-[#462C90] text-[#462C90] hover:bg-[#F3E8FF] transition-colors flex items-center gap-2"
			>
				<BookOpen size={18} />
				Add to Diary
			</Button>
			<Button 
				onClick={() => handleAction('exchange')} 
				disabled={isLoading}
				variant="outline"
				className="flex-1 border-[#BA7FCB] text-[#BA7FCB] hover:bg-[#F3E8FF] hover:text-[#462C90] hover:border-[#462C90] transition-colors flex items-center gap-2"
			>
				<Repeat size={18} />
				Request Exchange
			</Button>
		</div>
	)
}
