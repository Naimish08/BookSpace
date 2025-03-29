import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fde8be]">
      <div className="max-w-6xl mx-auto p-6">
        <section className="mb-10">
          <h1 className="text-3xl font-bold italic mb-2">Welcome to BookSpace</h1>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-4">A community where readers and books are celebrated</p>
            </div>
            <div>
              <p className="mb-4">A book Flipping Animation along with reading/finding elements!</p>
            </div>
          </div>
          <div className="mt-6">
            <p>Takes to About Us: Which gives a tour of the site</p>
            <Link href="/about-us" className="text-[#9d5583] underline">
              About Us
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-[#c5a7ba] rounded-lg p-6 grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Take Part Today</h2>
              <div className="bg-white p-4 rounded-md">
                <Image
                  src="/placeholder.svg?height=200&width=150"
                  alt="The Writing Revolution Book Cover"
                  width={150}
                  height={200}
                  className="mx-auto mb-4"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-white mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
              </p>
              <p className="text-sm text-white mb-4">Takes to the Event Page where this event is described</p>
              <button className="bg-[#fde8be] text-[#9d5583] px-4 py-2 rounded-md w-max">Know More</button>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-[#c5a7ba] bg-opacity-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Reading Inspiration for Today</h2>
            <div className="scroll-container h-32 flex items-center justify-center">
              <p className="text-center">Message opening animation (shows up)</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">What's Happening</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="book-card bg-white rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/placeholder.svg?height=150&width=250"
                  alt={`Event ${item}`}
                  width={250}
                  height={150}
                  className="w-full"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">
                    {item === 1 ? "Book Club Meeting" : item === 2 ? "BookSpace" : "Literacy Drive"}
                  </h3>
                  <p className="text-sm">{item === 2 ? "14th Feb" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Book Recommends</h2>
          <div className="grid grid-cols-3 gap-4">
            {["Psychology of Money", "1984", "The Alchemist"].map((book, index) => (
              <div key={index} className="book-card bg-white rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/placeholder.svg?height=250&width=180"
                  alt={book}
                  width={180}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-sm">{book}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-[url('/placeholder.svg?height=200&width=1000')] bg-cover bg-center p-6">
          <div className="flex gap-6">
            <div className="w-1/4">
              <Image
                src="/placeholder.svg?height=200&width=150"
                alt="Currently Reading Book"
                width={150}
                height={200}
                className="rounded-md"
              />
            </div>
            <div className="w-3/4">
              <h2 className="text-2xl font-bold mb-4">WE ARE CURRENTLY READING</h2>
              <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="mb-4">Book Discussion: 31/03/2023</p>
              <button className="bg-[#9d5583] text-white px-4 py-2 rounded-md">Learn More</button>
              {/* better as Join Now  */}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

