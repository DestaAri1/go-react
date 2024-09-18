import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import UpcomingConcerts from './Partials/UpcomingConcerts.tsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      <Navbar />
      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-96"
        style={{ backgroundImage: `url('/concert.jpg')` }}>
        <div className="h-full bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Concert Tickets</h1>
          <p className="text-lg mb-6">Book your favorite concert tickets now!</p>
          <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Explore Concerts
          </button>
        </div>
      </div>

      <UpcomingConcerts/>
      <Footer />
    </div>
  );
}
