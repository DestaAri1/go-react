import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useConcert from '../../hooks/useConcert.js';
import useLoading from '../../hooks/useLoading.js';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import { showSuccessToast } from '../../utils/Toast.js';
import { getToken } from '../../services/authService.js';
import { useScrollPosition } from '../../hooks/useScrollPositon.js';

const ConcertList = lazy(()=>import('../../components/ConcertList.jsx'));
const Navbar = lazy(() => import('../../layouts/Navbar.jsx'))
const Footer = lazy(() => import('../../layouts/Footer.jsx'))

export default function Home() {
  const { isLoading, setLoading } = useLoading(true);
  const location = useLocation();
  const message = location.state?.message;
  const { dataConcert, refreshConcerts } = useConcert();
  const [contentLoaded, setContentLoaded] = useState(false);

  // Implementasi scroll position
  const { isReady } = useScrollPosition('home-page');

  // Effect untuk handling data concert
  useEffect(() => {
    if (dataConcert !== null) {
      setLoading(false);
      setContentLoaded(true);
    }
  }, [dataConcert, setLoading]);

  // Effect untuk refresh concerts
  useEffect(() => {
    const token = getToken();
    if (token) {
      refreshConcerts();
    }
  }, [refreshConcerts]);

  // Effect untuk handling toast message
  useEffect(() => {
    const hasShownToast = localStorage.getItem('hasShownToast');

    if (message && !hasShownToast) {
      showSuccessToast(message);
      localStorage.setItem('hasShownToast', 'true');
    }

    return () => {
      localStorage.removeItem('hasShownToast');
    };
  }, [message]);

  // Komponen loading fallback
  const LazyLoadFallback = () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <LoadingSpinner color="text-gray-500" />
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gray-900 text-white flex flex-col justify-between"
      style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}
    >
      <Suspense fallback={<LazyLoadFallback />}>
        <Navbar />
      </Suspense>

      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-96"
        style={{ 
          backgroundImage: `url('/concert.jpg')`,
          minHeight: '400px'
        }}
        role="img"
        aria-label="Concert background"
        onLoad={() => setContentLoaded(true)}
      >
        <div className="h-full bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Concert Tickets</h1>
          <p className="text-lg mb-6">Book your favorite concert tickets now!</p>
          <Link
            to={"/concerts"}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Explore Concerts
          </Link>
        </div>
      </div>

      {/* Concert List Section */}
      <div 
        className='py-12'
        style={{ minHeight: '300px' }}
      >
        <h2 className="text-4xl font-semibold text-center mb-8">
          Upcoming Concerts
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner color="text-gray-500" />
          </div>
        ) : (
          <Suspense fallback={<LazyLoadFallback />}>
            {dataConcert && dataConcert.length > 0 ? (
              <div className="container mx-auto px-4">
                <ConcertList
                  concerts={dataConcert.slice(0, 3)}
                  cols={3}
                />
                <div className="text-center mt-8">
                  <Link
                    to="/concerts"
                    className="inline-block bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    View All Concerts
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                No concerts available at the moment
              </div>
            )}
          </Suspense>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-indigo-500 text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-400">
                Simple and secure ticket booking process
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-indigo-500 text-4xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">Guaranteed Tickets</h3>
              <p className="text-gray-400">
                All tickets are verified and guaranteed
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-indigo-500 text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Best Experience</h3>
              <p className="text-gray-400">
                Premium concert experience for all fans
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<LazyLoadFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
}