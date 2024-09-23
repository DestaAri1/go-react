import React from 'react'
import Navbar from '../../../layouts/Navbar.jsx'
import Footer from '../../../layouts/Footer.jsx'

export default function Tickets() {
  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col'>
        <Navbar title='My Tickets'/>

        <div className='py-8'>
          <h2 className="text-4xl font-semibold text-center mb-8">My Tickets</h2>
        </div>
        <Footer/>
    </div>
  )
}
