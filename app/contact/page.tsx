import React from 'react'
import ContactForm from './contact-form'

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-beige text-gray-800">
      <h1 className="text-3xl font-bold mb-4">To join free book exchange</h1>
      <p className="text-lg">
        If you’re someone who lives in Mumbai and is looking for a trustworthy place where readers can borrow your books or where you find a pool of books you can borrow for free- fill out the below details
      </p>
        <ContactForm />
    </div>
  )
}

export default page