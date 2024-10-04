import React from 'react';

const concertData = [
  { id: 1, name: 'Rock Concert', date: '2024-10-12', location: 'New York' },
  { id: 2, name: 'Jazz Night', date: '2024-11-15', location: 'Los Angeles' },
  // Tambahkan data konser lainnya di sini
];

export default function ConcertList() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Concert Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Location</th>
          </tr>
        </thead>
        <tbody>
          {concertData.map((concert) => (
            <tr key={concert.id} className="border-b">
              <td className="px-4 py-2">{concert.name}</td>
              <td className="px-4 py-2">{concert.date}</td>
              <td className="px-4 py-2">{concert.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
