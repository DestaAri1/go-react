import React, { useEffect, useState } from 'react';
import Navbar from '../../layouts/Navbar';
import useLoading from '../../hooks/useLoading';
import useConcert from '../../hooks/useConcert';
import Footer from '../../layouts/Footer';
import ConcertList from '../../components/ConcertList.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import Pagination from '../../components/Pagination.jsx';
import { typeConcert } from '../../types/typeConcert.tsx';
import { getTotalPages, paginate } from '../../hooks/usePagination.tsx';

export default function Concert() {
  const { isLoading, setLoading } = useLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataConcert: typeConcert[] = useConcert() || [];

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 8;

  useEffect(() => {
    if (dataConcert.length >= 0) {
      setLoading(false);
    }
  }, [dataConcert, setLoading]);

  const totalPages: number = getTotalPages(dataConcert, itemsPerPage);
  
  const paginatedConcerts: typeConcert[] = paginate(dataConcert, currentPage, itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex-grow mt-2 container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-8">Concert List</h2>
        
        {isLoading ? (
          <LoadingSpinner color="text-gray-500" />
        ) : (
          <>
            {dataConcert.length > 0 ? (
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