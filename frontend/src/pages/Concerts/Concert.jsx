import React, { useEffect, useState } from 'react';
import Navbar from '../../layouts/Navbar.jsx';
import useLoading from '../../hooks/useLoading.js';
import Footer from '../../layouts/Footer.jsx';
import ConcertList from '../../components/ConcertList.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import Pagination from '../../components/Pagination.jsx';
import { getTotalPages, paginate } from '../../hooks/usePagination.jsx';
import useConcert from '../../hooks/useConcert.js';
import { useScrollPosition } from '../../hooks/useScrollPositon.js';

export default function Concert() {
  // Hapus useLoading karena kita akan menggunakan loading state dari useConcert
  const { dataConcert } = useConcert();
  const { isReady } = useScrollPosition('home-page');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Tambahkan state untuk track apakah data sedang loading
  const {isLoading, setLoading} = useLoading(true);

  // Effect untuk mengatur loading state berdasarkan ketersediaan data
  useEffect(() => {
    if (dataConcert !== null) {
      setLoading(false);
    }
  }, [dataConcert]);

  const concertData = React.useMemo(() => {
    const dataConcertReal = Array.isArray(dataConcert) ? dataConcert : [];
    const totalPages = getTotalPages(dataConcertReal, itemsPerPage);
    const paginatedConcerts = paginate(dataConcertReal, currentPage, itemsPerPage);

    return {
      dataConcertReal,
      totalPages,
      paginatedConcerts
    };
  }, [dataConcert, currentPage, itemsPerPage]);

  const LazyLoadFallback = React.memo(() => (
    <div className="flex justify-center items-center min-h-[200px]">
      <LoadingSpinner color="text-gray-500" />
    </div>
  ));

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex flex-col justify-between"
      style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}
    >
      <Navbar />
      <div
        className="flex-grow mt-2 container mx-auto px-4"
        style={{ minHeight: '500px' }}
      >
        <h2 className="text-4xl font-semibold text-center mb-8">Concert List</h2>
        
        {isLoading ? (
          <LoadingSpinner color="text-gray-500" />
        ) : (
          <>
            {concertData.dataConcertReal.length > 0 ? (
              <>
                <ConcertList concerts={concertData.paginatedConcerts} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={concertData.totalPages}
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