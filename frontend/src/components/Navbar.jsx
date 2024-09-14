import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 sticky top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="text-white text-2xl font-bold w-[15%]">Concert Tickets</div>
        <ul className="flex space-x-6 w-[70%] justify-center">
          <li><Link href="#" className="text-white hover:text-indigo-500">Home</Link></li>
          <li><Link href="#" className="text-white hover:text-indigo-500">Concerts</Link></li>
          <li><Link href="#" className="text-white hover:text-indigo-500">About</Link></li>
          <li><Link href="#" className="text-white hover:text-indigo-500">Contact</Link></li>
        </ul>
        <div className='w-[15%] flex justify-end'>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign In</button>
        </div>
      </div>
    </nav>
  )
}
