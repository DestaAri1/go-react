import React, { useEffect } from 'react';
import Navbar from '../../layouts/Navbar.jsx';
import Footer from '../../layouts/Footer.jsx';
import ConcertList from '../../components/ConcertList.jsx';
import useConcert from '../../hooks/useConcert.js';
import { typeConcert } from '../../types/typeConcert.js';
import useLoading from '../../hooks/useLoading.js';
import LoadingSpinner from '../../components/LoadingSpinner.js';

export default function Home() {
  const { isLoading, setLoading } = useLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataConcert: typeConcert[] = useConcert() || [];

  useEffect(() => {
    if (dataConcert.length > 0) {
      setLoading(false);
    }
  }, [dataConcert, setLoading]);
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
      <div className='py-12'>
        <h2 className="text-4xl font-semibold text-center mb-8">Upcoming Concerts</h2>
        {isLoading ? (
          <LoadingSpinner color="text-gray-500" />
        ) : (
          <ConcertList
          concerts={dataConcert.slice(0, 3)}
          cols={3}
        />
        )}
      </div>

      <Footer />
    </div>
  );
}
