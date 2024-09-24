import React, { useEffect } from 'react';
import Navbar from '../../../layouts/Navbar.jsx';
import Footer from '../../../layouts/Footer.jsx';
import useLoading from '../../../hooks/useLoading.js';
import useTicket from '../../../hooks/useTickets.js';
import LoadingSpinner from '../../../components/LoadingSpinner.js';
import TicketList from '../../../components/TicketList.jsx';

export default function Tickets() {
  const { isLoading, setLoading } = useLoading(true);
  const dataTicket = useTicket() || [];

  useEffect(() => {
    if (dataTicket.length > 0) {
      setLoading(false);
    }
  }, [dataTicket, setLoading]);

  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col'>
      <Navbar title='My Tickets' />

      <div className='py-8'>
        <h2 className="text-4xl font-semibold text-center mb-8">My Tickets</h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <TicketList dataTicket={dataTicket} />
        )}

      </div>

      <Footer />
    </div>
  );
}
