import Image from "next/image"
import SetCountDown from "./SetCoundDown"

export default function Events() {
  return (
    <main className="min-h-screen bg-[#ffefd0]">
      <div className="max-w-6xl mx-auto">
        <section className="bg-[#9d5583] p-10 text-whiten ">
          <h1 className="text-2xl font-bold mb-4 text-[#ffefd0]">What's Next?</h1>

          <div className="grid grid-cols-3 ">
            <div className="col-span-2">
              <div className="bg-[#f0befd] rounded-xl p-4 text-center ml-40">
                <div className="text-[#5b3758] text-4xl font-bold mb-4"><SetCountDown /></div>
                <p className="text-[#5b3758] font-medium">Event Name</p>
                <p className="text-[#5b3758] text-sm mt-2">Time: 4pm Venue: Vile Parle, Garden</p>
                <p className="text-[#5b3758] text-sm mt-4">(Invites automatically are send on their gmail)</p>
                <button className="bg-[#ffefd0] text-[#9d5583] px-4 py-2 rounded-md mt-4">Register Now</button>
              </div>
            </div>
            <div className="col-span-1 mt-12">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Event illustration"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
          </div>
        </section>

        <section className="py-6">
          <p className="text-center m-6">Snap Shot of our Flagship/ last event </p>

          <div className="grid grid-cols-2 gap-6 mb-8 bg-[#f8bcfc] p-6">
            <div>
              <h2 className="text-2xl font-bold text-[#9d5583] mb-2 text-center">Blind Date with a Book</h2>
              <div className="text-4xl font-bold text-center">×</div>
              <h2 className="text-2xl font-bold text-black mb-4 text-center">Book Exchange</h2>
              <p className="text-center">Gargee's Cipher Animation</p>
              <div className="flex justify-center gap-4 mt-4">
                <div className="w-12 h-12 rounded-full bg-[#9d5583]"></div>
                <div className="w-12 h-12 rounded-full bg-[#9d5583]"></div>
                <div className="w-12 h-12 rounded-full bg-[#9d5583]"></div>
                <div className="w-12 h-12 rounded-full bg-[#9d5583]"></div>
              </div>
            </div>
            <div>
              <div className="w-64 h-64 rounded-full bg-[#9d5583] mx-auto"></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">Mark Your Calenders</h2>
            <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
              <div className="calendar-header text-center mb-4">
                <h3 className="text-3xl font-bold">april</h3>
                <p>2023</p>
              </div>
              <div className="calendar-container">
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  <div>SUN</div>
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div>SAT</div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <div key={day} className={`p-2 ${day === 15 || day === 22 ? "bg-[#c5a7ba] rounded-full" : ""}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-center mt-4">
                (When the reader taps on the circle, a little box of basic info shows up)
              </p>
            </div>
          </div>

          <div className="m-8 ">
            <h2 className="text-xl font-bold mb-4 text-center">Our Past Events...</h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="event-card bg-white rounded-lg overflow-hidden shadow-md">
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
            <p className="text-center mt-4">Click on the event to know more</p>
          </div>

          <div className="bg-[#c5a7ba] rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2 text-center text-white">SUGGESTION BOX</h2>
            <p className="text-center text-white mb-4">Drop what's on your mind</p>

            <form className="space-y-4">
              <div>
                <input type="text" placeholder="Name:" className="w-full p-2 rounded-md" />
              </div>
              <div>
                <input type="text" placeholder="Contact:" className="w-full p-2 rounded-md" />
              </div>
              <div>
                <input type="email" placeholder="Email" className="w-full p-2 rounded-md" />
              </div>
              <div>
                <textarea placeholder="Your Idea:" className="w-full p-2 rounded-md h-24"></textarea>
              </div>
              <div className="text-right">
                <button type="submit" className="bg-[#9d5583] text-white px-4 py-2 rounded-md">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

