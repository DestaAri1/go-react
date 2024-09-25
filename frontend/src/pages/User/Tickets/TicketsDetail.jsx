import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOneTicket } from '../../../services/tikcetService';
import Navbar from '../../../layouts/Navbar';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getOneTicket(id);  
        setTicketData(data.data.data);
      } catch (error) {
        // Cek apakah error adalah masalah koneksi jaringan
        if (!error.response) {
          setError('Network error: Please check your internet connection.');
        } else {
          setError(error.message || 'An unexpected error occurred.');
        }
      }
    };

    fetchTicket();
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar/>
      {ticketData ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">{ticketData.ticket.event.name}</h2>
          <p className="text-lg mb-2">Location: {ticketData.ticket.event.location}</p>
          <p className="text-sm mb-2">Date: {new Date(ticketData.ticket.event.date).toLocaleDateString()}</p>
          <p className="text-sm mb-4">Entered: {ticketData.ticket.entered ? 'Yes' : 'No'}</p>

          {/* Menampilkan kode QR */}
          <div className="mb-4">
            <img src={`data:image/png;base64,${ticketData.qrcode}`} alt="QR Code" />
          </div>

          {/* Informasi Tambahan */}
          <p className="text-sm">Total Tickets Purchased: {ticketData.ticket.event.totalTicketsPurchased}</p>
          <p className="text-sm">Total Tickets Entered: {ticketData.ticket.event.totalTicketsEntered}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TicketDetail;
