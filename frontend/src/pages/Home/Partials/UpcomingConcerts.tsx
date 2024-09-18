import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function UpcomingConcerts() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Simulasi loading dengan delay 1 detik
      return () => clearTimeout(timer); // Bersihkan timer saat komponen unmount
    }, []);
  
    const concerts = [
      {
        img: '/concert2.jpg',
        artist: 'Artist Name 1',
        date: '12th Sept 2024',
      },
      {
        img: 'https://example.com/concert2.jpg',
        artist: 'Artist Name 2',
        date: '20th Sept 2024',
      },
      {
        img: 'https://example.com/concert3.jpg',
        artist: 'Artist Name 3',
        date: '25th Sept 2024',
      },
    ];
  return (
    <div className="py-12">
        <h2 className="text-4xl font-semibold text-center mb-8">Upcoming Concerts</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.map((concert, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-48 object-cover" src={concert.img} alt={`Concert ${index + 1}`} />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{concert.artist}</h3>
                  <p className="text-gray-400 mb-4">Concert Date: {concert.date}</p>
                  <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Buy Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
