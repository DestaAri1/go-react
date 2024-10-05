import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange, text_color = 'text-white' }) {
  return (
    <div className="flex items-center justify-center mt-4">
      <button 
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span className={`mx-4 ${text_color}`}>Page {currentPage} of {totalPages}</span>
      <button 
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
