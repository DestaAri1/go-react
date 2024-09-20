import React, { useEffect } from 'react';
import Navbar from '../../layouts/Navbar.jsx'; // Import komponen dari .jsx
import useLoading from '../../hooks/useLoading.js';
import useConcert from '../../hooks/useConcert.js';
import Footer from '../../layouts/Footer.jsx';
import ConsertList from './partials/ConsertList.jsx';

interface ConcertList {
  image: string;
  name: string;
  location: string;
  date: string;
}

export default function Concert() {
  const { isLoading, setLoading } = useLoading(true);
  const dataConcert: ConcertList[] | null = useConcert(); // Tentukan tipe data

  console.log(dataConcert);
  

  useEffect(() => {
    if (dataConcert) {
      setLoading(false); // Set loading ke false saat dataConcert tersedia
    }
  }, [dataConcert, setLoading]);

  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col'>
      <Navbar />

      <div className='flex-grow mt-2'>
        <h2 className="text-4xl font-semibold text-center mb-8">Upcoming Concerts</h2>
        {isLoading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : (
          <ConsertList concerts={dataConcert} />
        )}
      </div>
      <Footer />
    </div>
  );
}
