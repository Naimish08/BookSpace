import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Instagram, Youtube, Twitter, Globe } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 font-poppins">
      {/* Header */}
      <header className="bg-yellow-100 px-4 py-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-bold text-amber-800 font-playfair">BookSpace</div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-amber-800 font-medium">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-amber-800 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-amber-800 font-medium">
              Events
            </a>
            <a href="#" className="text-gray-700 hover:text-amber-800 font-medium">
              Club
            </a>
            <a href="#" className="text-gray-700 hover:text-amber-800 font-medium">
              Join Us
            </a>
            <a href="#" className="text-gray-700 hover:text-amber-800 font-medium">
              Writers
            </a>
            <User className="w-8 h-8 text-gray-700" />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-7xl font-bold text-white mb-8 font-dancing-script">BOOKCLUB</h1>
          <div className="bg-white/10 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 font-poppins">Hey, which book are you reading?</h2>
            <p className="text-xl font-light font-poppins">Tell us here _______________</p>
          </div>
        </div>
      </section>

      {/* June's Read Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-8 mb-8">
            <h2 className="text-5xl font-bold text-white text-center mb-12 font-playfair">June's Read</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-purple-800 rounded-lg p-8 mb-6 h-64 flex items-center justify-center">
                  <p className="text-white text-lg font-poppins">Image of book directly import from dashboard</p>
                </div>
                <h3 className="text-3xl font-bold text-white font-playfair">Fiction</h3>
              </div>
              <div className="text-center">
                <div className="bg-purple-800 rounded-lg p-8 mb-6 h-64 flex items-center justify-center">
                  <p className="text-white text-lg font-poppins">Image of book directly import from dashboard</p>
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
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-4 font-playfair">Fiction</h3>
              </div>
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-4 font-playfair">Non-Fiction</h3>
              </div>
            </div>

            <div className="text-center mb-8">
              <Button className="bg-purple-900 hover:bg-purple-800 text-white px-10 py-4 rounded-full text-lg font-semibold font-poppins">
                Did you read today?
              </Button>
            </div>

            <div className="bg-purple-800 rounded-lg p-8 mb-8">
              <h3 className="text-6xl font-bold text-white text-center mb-8 font-dancing-script">My Progress</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-white mb-6 font-playfair">Fiction</h4>
                  <div className="flex justify-center mb-6">
                    <div className="bg-amber-600 rounded-lg p-4 w-48 h-24 flex items-center justify-center">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((plant, index) => (
                          <div key={index} className="text-green-400 text-2xl">
                            🌱
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3 mb-4">
                    {[20, 40, 60, 80, 100].map((percent, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full ${index < 3 ? "bg-purple-400" : "bg-purple-900"} mb-2`}
                        ></div>
                        <span className="text-white text-sm font-poppins font-medium">{percent}%</span>
                      </div>
                    ))}
                  </div>
                  <Progress value={60} className="w-full" />
                </div>

                <div className="text-center">
                  <h4 className="text-2xl font-bold text-white mb-6 font-playfair">Non-Fiction</h4>
                  <div className="flex justify-center mb-6">
                    <div className="bg-amber-600 rounded-lg p-4 w-48 h-24 flex items-center justify-center">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((plant, index) => (
                          <div key={index} className="text-green-400 text-2xl">
                            🌱
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3 mb-4">
                    {[20, 40, 60, 80, 100].map((percent, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full ${index < 4 ? "bg-purple-900" : "bg-purple-400"} mb-2`}
                        ></div>
                        <span className="text-white text-sm font-poppins font-medium">{percent}%</span>
                      </div>
                    ))}
                  </div>
                  <Progress value={80} className="w-full" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold font-poppins">
                Read this Book? Wanna share your thoughts?
              </Button>
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
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-white font-playfair">Book's we've read</h2>
              <Button
                variant="outline"
                className="rounded-full bg-purple-900 text-white border-white hover:bg-purple-800"
              >
                —
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-purple-800 rounded-lg h-56"></div>
              <div className="bg-red-600 rounded-lg h-56 flex items-center justify-center p-4">
                <div className="text-center text-white">
                  <h3 className="font-bold text-lg font-playfair mb-2">BookSpace</h3>
                  <p className="text-sm font-poppins mb-1">Book Exchange & Blind Date with a Book</p>
                  <p className="text-lg font-bold font-poppins mb-1">14th Feb</p>
                  <p className="text-xs font-poppins">International Book Giving Day Special</p>
                </div>
              </div>
              <div className="bg-yellow-500 rounded-lg h-56 flex items-center justify-center">
                <div className="text-center text-purple-900">
                  <div className="text-5xl mb-3">📚</div>
                  <h3 className="font-bold text-xl font-playfair mb-2">BOOK DRIVE</h3>
                  <p className="text-sm font-poppins font-semibold">MARCH 1-14</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-4xl font-bold mb-4 font-playfair tracking-widest">BOOKSPACE</h3>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4 font-playfair">Address</h4>
              <p className="text-sm mb-2 font-poppins">Over-bridge | Sanghvi College of Engineering,</p>
              <p className="text-sm mb-6 font-poppins">Vile Parle West Mumbai-400056</p>

              <h4 className="text-xl font-bold mb-3 font-playfair">Contact</h4>
              <p className="text-sm font-poppins">bookspace@gmail.com</p>
              <p className="text-sm font-poppins">+91 9876543210</p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4 font-playfair">Follow us</h4>
              <div className="flex space-x-4">
                <Instagram className="w-7 h-7" />
                <Youtube className="w-7 h-7" />
                <Twitter className="w-7 h-7" />
                <Globe className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
