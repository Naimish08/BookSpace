import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BookActions from "./book-actions"

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	
	const book = await prisma.book.findUnique({
		where: { id },
		include: { _count: { select: { wishlists: true } } }
	})

	if (!book) {
		notFound()
	}

	const relatedBooks = await prisma.book.findMany({
		where: { genre: book.genre, id: { not: book.id } },
		take: 4
	})

	return (
		<div className="min-h-screen bg-[#FDE8BE] pb-12">
			<div className="bg-gradient-to-b from-[#462C90] to-[#BA7FCB] pt-24 pb-32 px-4 relative">
				<div className="container mx-auto max-w-4xl relative z-10 text-white flex flex-col md:flex-row gap-8 items-center md:items-end">
					<div className="w-48 h-72 md:w-64 md:h-96 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl relative bg-[#E1B5EE]">
						{book.image ? (
							<Image src={book.image} alt={book.name} fill className="object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#462C90]">
								{book.name.charAt(0)}
							</div>
						)}
					</div>
					<div className="flex-1 text-center md:text-left">
						<h1 className="text-4xl md:text-5xl font-bold mb-2 font-merriweather">{book.name}</h1>
						<p className="text-xl md:text-2xl text-[#FDE8BE] mb-2">{book.author}</p>
						<div className="flex items-center gap-4 justify-center md:justify-start">
							<span className="bg-[#462C90]/50 px-3 py-1 rounded-full text-sm font-medium border border-[#E1B5EE]/30">{book.genre}</span>
							<span className="text-sm">Added by {book._count?.wishlists || 0} readers</span>
						</div>
					</div>
				</div>
			</div>
			
			<div className="container mx-auto max-w-4xl px-4 -mt-16 relative z-20">
				<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
					<BookActions bookId={book.id} bookName={book.name} />
					
					{book.description && (
						<div className="mt-8">
							<h3 className="text-2xl font-bold text-[#462C90] mb-4">About the book</h3>
							<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{book.description}</p>
						</div>
					)}
				</div>

				{relatedBooks.length > 0 && (
					<div className="mt-12">
						<h3 className="text-2xl font-bold text-[#462C90] mb-6">More in {book.genre}</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{relatedBooks.map(rb => (
								<Link key={rb.id} href={`/books/${rb.id}`} className="group">
									<div className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 bg-[#E1B5EE] aspect-[3/4] relative mb-2">
										{rb.image ? (
											<Image src={rb.image} alt={rb.name} fill className="object-cover" />
										) : (
											<div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#462C90] text-center p-2">
												{rb.name}
											</div>
										)}
									</div>
									<h4 className="font-semibold text-[#241943] text-sm line-clamp-1 group-hover:text-[#BA7FCB] transition-colors">{rb.name}</h4>
									<p className="text-xs text-gray-600 line-clamp-1">{rb.author}</p>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
