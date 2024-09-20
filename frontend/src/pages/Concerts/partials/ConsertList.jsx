import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale'; // Locale Indonesia untuk format tanggal

export default function ConcertList({ concerts }) {
  if (!Array.isArray(concerts) || concerts.length === 0) {
    return <div className='text-white text-center'>No concerts available</div>;
  }

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {concerts.map((concert, index) => {
        const concertDate = parseISO(concert.date);
        const formattedDate = format(concertDate, 'dd MMMM yyyy', { locale: id });
        const formattedTime = format(concertDate, 'HH:mm');

        return (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img className="w-full h-48 object-cover" src={concert.image} alt={`Concert ${index + 1}`} />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{concert.name}</h3>
              <h3 className="text-xl font-semibold mb-2">{concert.location}</h3>
              <p className="text-gray-400 mb-4">Concert Date: {formattedDate} - Jam: {formattedTime}</p>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Buy Tickets
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
