import Image from "next/image"

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-[#ffefd0]">
      <div className="bg-[#ac6f59] py-6 text-center">
        <h1 className="text-4xl font-bold text-white italic">ABOUT US</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <section className="mb-12 text-center">
        <div className="inline-block border-t-2 border-b-2 border-[#ac6f59] px-12 py-2">
          <h2 className="text-2xl font-bold mb-2">BOOKSPACE</h2>
          </div>
          <h3 className="text-xl mb-6">WHERE STORIES CONNECT US</h3>

          <div className="bg-[#5b3758] rounded-3xl p-6 max-w-xl mx-auto relative overflow-hidden">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold italic mb-2">Welcome to</h2>
              <h1 className="text-4xl font-bold italic mb-4">BookSpace</h1>
              <p className="text-sm">Where Pages, Readers, and Writers Connect</p>
            </div>
            <Image
              src="/placeholder.svg?height=100&width=200"
              alt="Open book"
              width={200}
              height={100}
              className="mx-auto mt-4"
            />
          </div>
        </section>

        <section className="mb-12">
          <div className="text-center mb-6">
            <div className="inline-block border-t-2 border-b-2 border-[#ac6f59] px-12 py-2">
              <h2 className="text-2xl font-bold text-[#ac6f59]">OUR VALUES</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-[#f0befd] bg-opacity-30 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-[#9d5583] mb-2">VISION</h3>
            </div>
            <div className="bg-[#f0befd] bg-opacity-30 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-[#9d5583] mb-2">MISION</h3>
            </div>
            <div className="bg-[#f0befd] bg-opacity-30 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-[#9d5583] mb-2">PURPOSE</h3>
            </div>
            <div className="col-span-4 md:col-span-1 bg-[#ffefd0] p-6 rounded-lg shadow-md">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="text-center mb-6">
            <div className="inline-block border-t-2 border-b-2 border-[#ac6f59] px-12 py-2">
              <h2 className="text-2xl font-bold text-[#ac6f59]">OUR STORY</h2>
            </div>
          </div>

          <div className="bg-[#ac6f59] bg-opacity-80 rounded-3xl p-8 text-white">
            <p className="mb-8 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
            </p>

            <div className="relative max-w-md mx-auto">
              <div className="bookshelf-image">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Bookshelf"
                  width={300}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-[#ffefd0] text-[#5b3758] p-3 rounded-lg">
                <p className="text-sm font-bold">
                  CLICK
                  <br />
                  TO KNOW
                  <br />
                  FACTS
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#ac6f59]">IMPACTS MADE</h2>
          </div>

          <div className="flex justify-center gap-8">
            <div className="impact-circle bg-[#ac6f59]">
              <span className="text-4xl font-bold">246</span>
              <span className="text-xs text-center">
                ACTIVE
                <br />
                READERS
              </span>
            </div>
            <div className="impact-circle bg-[#c5a7ba]">
              <span className="text-4xl font-bold">60</span>
              <span className="text-xs text-center">
                BOOK
                <br />
                DONATION
              </span>
            </div>
            <div className="impact-circle bg-[#9d5583]">
              <span className="text-4xl font-bold">20</span>
              <span className="text-xs text-center">
                CHILDREN
                <br />
                EDUCATED
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

