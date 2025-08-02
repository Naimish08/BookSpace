import { Input } from '@/components/ui/input'
import React from 'react'

const ContactForm = () => {
  return (
    <>
        <Input
            type='text'
            placeholder='Enter your name'
            className='mt-4 w-auto max-w-md p-2 border border-gray-300 rounded'
        />
        <Input
            type='email'
            placeholder='Enter your email'
            className='mt-4 w-auto max-w-md p-2 border border-gray-300 rounded'
        />
        <Input
            type='tel'
            placeholder='Enter your contact'
            className='mt-4 w-auto max-w-md p-2 border border-gray-300 rounded'
        />
        <Input
            type='submit'
            placeholder='Submit'
            className='mt-4 w-auto max-w-md p-2 border border-gray-300 rounded cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200'
        />
    </>
  )
}

export default ContactForm