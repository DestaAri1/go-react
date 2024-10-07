import React, { useEffect } from 'react';
import Navbar from '../../layouts/Navbar.jsx';
import Footer from '../../layouts/Footer.jsx';
import ConcertList from '../../components/ConcertList.jsx';
import useConcert from '../../hooks/useConcert.js';
import useLoading from '../../hooks/useLoading.js';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import { Link, useLocation } from 'react-router-dom';
import { showSuccessToast } from '../../utils/Toast.js';
import { getToken } from '../../services/authService.js';

export default function Home() {
  const { isLoading, setLoading } = useLoading(true);
  const location = useLocation();
  const message = location.state?.message;
  const { dataConcert, refreshConcerts } = useConcert();

  useEffect(() => {
    if (dataConcert !== null) {
      setLoading(false);
    }
  }, [dataConcert, setLoading]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      refreshConcerts();
    }
  }, []);
  
  useEffect(() => {
    // Menangani notifikasi
    const hasShownToast = localStorage.getItem('hasShownToast');
  
    if (message && !hasShownToast) {
      showSuccessToast(message);
      localStorage.setItem('hasShownToast', 'true');
    }
  
    // Reset status saat keluar dari halaman
    return () => {
      localStorage.removeItem('hasShownToast');
    };
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      <Navbar />
      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-96"
        style={{ backgroundImage: `url('/concert.jpg')` }}
        role="img"
        aria-label="Concert background">
        <div className="h-full bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Concert Tickets</h1>
          <p className="text-lg mb-6">Book your favorite concert tickets now!</p>
          <Link to={"/concerts"} className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Explore Concerts
          </Link>
        </div>
      </div>
      
      <div className='py-12'>
        <h2 className="text-4xl font-semibold text-center mb-8">Upcoming Concerts</h2>
        {isLoading ? (
          <LoadingSpinner color="text-gray-500" />
        ) : (
          dataConcert.length > 0 ? (
            <ConcertList
              concerts={dataConcert.slice(0, 3)}
              cols={3}
            />
          ) : (
            <div className="text-center">No concerts available</div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
