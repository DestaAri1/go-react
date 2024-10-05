import React from 'react';
import { Link } from 'react-router-dom';

export default function DataConcerts({ dataConcert }) {
  return (
    <tbody>
      {dataConcert.map((concert) => (
        <tr key={concert.id} className="border-b">
          <td className="px-4 py-2">{concert.name}</td>
          <td className="px-4 py-2">{concert.date}</td>
          <td className="px-4 py-2">{concert.location}</td>
          <td className="px-4 py-2 flex">
            <Link 
                to={`/dashboard/event/${concert.id}`}
                key={concert.id} 
                className="mr-2 text-blue-500">Update</Link>
            <button className="text-red-500">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
