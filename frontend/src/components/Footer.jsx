import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 Concert Tickets. All rights reserved.</p>
      <ul className="flex justify-center space-x-6 mt-4">
        <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
        <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
        <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
      </ul>
    </div>
  </footer>
  )
}
