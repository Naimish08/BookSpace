import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Poppins } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
})
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "BookSpace",
  description: "A community where readers and books are celebrated",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-poppins`}>
        <header className="bg-[#ffefd0] p-4 flex justify-between items-center">
          <Link href="/" className="text-[#5b3758] text-xl font-bold">
            BookSpace
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-[#5b3758]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-[#5b3758]">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/club" className="text-[#5b3758]">
                  Club
                </Link>
              </li>
              <li>
                <Link href="/join-us" className="text-[#5b3758]">
                  Join Us
                </Link>
              </li>
              <li>
                <Link href="/writers" className="text-[#5b3758]">
                  Writers
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-[#5b3758]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#5b3758]">
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer className="bg-[#b27b92] text-[#ffffff] p-6">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-5">
            <div>
              <h3 className="font-bold mb-2">BookSpace</h3>
            </div>
            <div>
              <h3 className="font-bold mb-2">Address</h3>
              <p className="text-sm">
              Dwarkadas J. Sanghvi College of Engineering, 
                <br />
                Vile Parle West, Mumbai-400056
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Contact</h3>
              <p className="text-sm">bookspace@gmail.com</p>
              <p className="text-sm">+91 98765432</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Follow us</h3>
              <div className="flex space-x-2">
                <div className="w-6 h-6 rounded-full bg-white">
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer"/>
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="30" />
                </div>
                <div className="w-6 h-6 rounded-full bg-white">
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="30" />
                </a>
                </div>
                <div className="w-6 h-6 rounded-full bg-white">
                <a href="mailto:example@gmail.com">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Gmail" width="30" />
                </a>

                </div>
                <div className="w-6 h-6 rounded-full bg-white">
                <a href="tel:+1234567890">
                <img src="https://cdn-icons-png.flaticon.com/512/159/159832.png" alt="Phone" width="30" />
                </a>
                 </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}



import './globals.css'