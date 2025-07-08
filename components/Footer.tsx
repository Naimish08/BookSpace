// components/Footer.tsx
import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#BA7FCB] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BOOKSPACE</h3>
            <p> </p>
          </div>
          <div>
            <h4 className="font-bold mt-4 mb-2">Contact</h4>
            <p className="text-sm">bookspace@gmail.com</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Follow us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/bookspace__"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://fb_link"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter_link"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
