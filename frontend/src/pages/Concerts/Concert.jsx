import React, { useEffect, useState } from 'react';
import Navbar from '../../layouts/Navbar.jsx';
import useLoading from '../../hooks/useLoading.js';
import Footer from '../../layouts/Footer.jsx';
import ConcertList from '../../components/ConcertList.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import Pagination from '../../components/Pagination.jsx';
import { getTotalPages, paginate } from '../../hooks/usePagination.jsx';
import useConcert from '../../hooks/useConcert.js';

export default function Concert() {
  const { isLoading, setLoading } = useLoading(true);
  const { dataConcert, refreshConcerts } = useConcert();
  
  // Paksa dataConcert menjadi array, meskipun datanya tidak sesuai
  const dataConcertReal = Array.isArray(dataConcert) ? dataConcert : [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (dataConcert === null || dataConcert.length === 0) {
      // Panggil refreshConcerts hanya jika dataConcert kosong atau null
      refreshConcerts();
    }
    setLoading(false);
  }, [dataConcert, setLoading, refreshConcerts]);
  

  const totalPages = getTotalPages(dataConcertReal, itemsPerPage);
  const paginatedConcerts = paginate(dataConcertReal, currentPage, itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex-grow mt-2 container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-8">Concert List</h2>

                {isLoading ? (
          <LoadingSpinner color="text-gray-500" />
        ) : (
          <>
            {Array.isArray(dataConcert) && dataConcert.length > 0 ? (
              <>
                <ConcertList concerts={paginatedConcerts} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center">No concerts available</div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
