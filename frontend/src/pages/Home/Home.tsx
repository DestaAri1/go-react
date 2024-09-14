import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
    <Navbar/>
    {/* Hero Section */}
    <div className="bg-cover bg-center h-96" style={{ backgroundImage: `url('/concert.jpg')` }}>
      <div className="h-full bg-black bg-opacity-60 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Concert Tickets</h1>
        <p className="text-lg mb-6">Book your favorite concert tickets now!</p>
        <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">Explore Concerts</button>
      </div>
    </div>

    {/* Upcoming Concerts Section */}
    <div className="py-12">
      <h2 className="text-4xl font-semibold text-center mb-8">Upcoming Concerts</h2>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Concert Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <img className="w-full h-48 object-cover" src="/concert2.jpg" alt="Concert 1" />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Artist Name</h3>
            <p className="text-gray-400 mb-4">Concert Date: 12th Sept 2024</p>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Buy Tickets</button>
          </div>
        </div>

        {/* Concert Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <img className="w-full h-48 object-cover" src="https://example.com/concert2.jpg" alt="Concert 2" />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Artist Name</h3>
            <p className="text-gray-400 mb-4">Concert Date: 20th Sept 2024</p>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Buy Tickets</button>
          </div>
        </div>

        {/* Concert Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <img className="w-full h-48 object-cover" src="https://example.com/concert3.jpg" alt="Concert 3" />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Artist Name</h3>
            <p className="text-gray-400 mb-4">Concert Date: 25th Sept 2024</p>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Buy Tickets</button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  )
}
