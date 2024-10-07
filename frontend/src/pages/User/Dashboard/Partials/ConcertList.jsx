import React, { useEffect, useState } from 'react';
import useConcert from '../../../../hooks/useConcert.js';
import useLoading from '../../../../hooks/useLoading.js';
import DataConcerts from './DataConcerts.jsx';
import LoadingSpinner from '../../../../components/LoadingSpinner.js';
import { getTotalPages, paginate } from '../../../../hooks/usePagination.jsx';
import Pagination from '../../../../components/Pagination.jsx';

export default function ConcertList() {
  const { dataConcert, refreshConcerts } = useConcert();
  const dataConcertReal = Array.isArray(dataConcert) ? dataConcert : [];
  const { isLoading, setLoading } = useLoading()
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
          Array.isArray(dataConcert) && dataConcert.length > 0 ? (
              <DataConcerts dataConcert={paginatedConcerts} />
          ) : (
            <tbody>
              <tr>
                <td><div className='text-center text-white'>No data</div></td>
              </tr>
            </tbody>
          )
        )}
      </table>
      {Array.isArray(dataConcert) && dataConcert.length > 0 ? (
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
