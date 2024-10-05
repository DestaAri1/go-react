import React, { useEffect, useState } from 'react';
import useConcert from '../../../../hooks/useConcert';
import { typeConcert } from '../../../../types/typeConcert';
import useLoading from '../../../../hooks/useLoading';
import DataConcerts from './DataConcerts';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { getTotalPages, paginate } from '../../../../hooks/usePagination.tsx';
import Pagination from '../../../../components/Pagination.jsx';

export default function ConcertList() {
  const dataConcert: typeConcert[] = useConcert() || [];
  const { isLoading, setLoading } = useLoading()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 8;

  useEffect(() => {
    if (dataConcert.length > 0) {
      setLoading(false);
    }
  }, [dataConcert, setLoading]);

  const totalPages: number = getTotalPages(dataConcert, itemsPerPage);
  
  const paginatedConcerts: typeConcert[] = paginate(dataConcert, currentPage, itemsPerPage);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Concert Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td><LoadingSpinner /></td>
            </tr>
          </tbody>
        ) : (
          dataConcert.length >= 0 ? (
              <DataConcerts dataConcert={paginatedConcerts} />
          ) : (
            <div className='text-center text-white'>No data</div>
          )
        )}
      </table>
      {dataConcert.length >= 0 ? (
          <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          text_color='text-black'
        />
      ) : (
        ''
      )}
    </div>
  );
}
