import React from 'react';
import { Link } from 'react-router-dom';

export default function TicketList({ dataTicket }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-4'>
      {dataTicket.length > 0 ? (
        dataTicket.map((ticket) => (
          <Link 
            key={ticket.id} 
            to={`/tickets/${ticket.id}`} 
            className='bg-gray-800 p-4 rounded-lg shadow-md'
          >
            <h3 className='text-2xl font-bold'>{ticket.event.name}</h3>
            <p className='text-lg'>{ticket.event.location}</p>
            <p className='text-sm'>Date: {new Date(ticket.event.date).toLocaleDateString()}</p>
            <p className='text-sm'>Entered: {ticket.entered ? 'Yes' : 'No'}</p>
          </Link>
        ))
      ) : (
        <p className="text-center">No tickets available.</p>
      )}
    </div>
  );
}
