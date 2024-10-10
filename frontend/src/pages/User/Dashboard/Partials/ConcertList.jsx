import React, { useEffect, useState, useCallback } from 'react';
import DataConcerts from './DataConcerts.jsx';
import LoadingSpinner from '../../../../components/LoadingSpinner.js';
import { getTotalPages, paginate } from '../../../../hooks/usePagination.jsx';
import Pagination from '../../../../components/Pagination.jsx';
import { RefreshCw } from 'lucide-react';

export default function ConcertList({ dataConcert, refreshConcerts, isLoading, setLoading }) {
  const dataConcertReal = Array.isArray(dataConcert) ? dataConcert : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    if (dataConcert === null || dataConcert.length === 0) {
      setLoading(true)
    }
    setLoading(false);
  }, [dataConcert, setLoading]);

  // Set up timer for refresh button
  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowRefreshButton(true);
      }, 5000);
    } else {
      setShowRefreshButton(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshConcerts();
    } finally {
      setIsRefreshing(false);
      setShowRefreshButton(false);
    }
  }, [refreshConcerts]);

  const totalPages = getTotalPages(dataConcertReal, itemsPerPage);
  const paginatedConcerts = paginate(dataConcertReal, currentPage, itemsPerPage);

  const RefreshButton = () => (
    <button
      onClick={handleRefresh}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      disabled={isRefreshing}
    >
      <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
    </button>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left border">Concert Name</th>
            <th className="px-4 py-2 text-left border">Date</th>
            <th className="px-4 py-2 text-left border">Location</th>
            <th className="px-4 py-2 text-left border">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center py-10">
                <div className="flex flex-col items-center gap-4">
                  <LoadingSpinner color='text-red-500' />
                  {showRefreshButton && (
                    <div className="mt-4">
                      <RefreshButton />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            Array.isArray(dataConcert) && dataConcert.length > 0 ? (
              <DataConcerts dataConcert={paginatedConcerts} />
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">
                  <div className="flex flex-col items-center gap-4">
                    <span>No data available</span>
                    <RefreshButton />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {Array.isArray(dataConcert) && dataConcert.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          text_color="text-black"
        />
      ) : null}
    </div>
  );
}