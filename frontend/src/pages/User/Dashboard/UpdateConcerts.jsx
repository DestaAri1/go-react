import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Partials/Sidebar';
import useSidenav from '../../../hooks/useSidenav';
import TopBar from './Partials/TopBar';
import { useConcertUpdateForm } from '../../../hooks/useConcert';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Input from '../../../components/Input';

export default function UpdateConcert() {
  const { id } = useParams();
  const { isSidebarExpanded, handleToggleSidebar } = useSidenav();
  const { concertData, handleChange, handleSubmit, isLoading } = useConcertUpdateForm({
    name: '',
    date: '',
    location: '',
    id: id
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarExpanded ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-800`}>
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={handleToggleSidebar} title={'Profile'} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">Update Concert</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <div className="mb-4">
              <Input
                label={'Change Name'}
                type={'text'}
                name={'name'}
                value={concertData.name}
                onChange={handleChange}
                tampilan='admin'
                required={true}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={concertData.date}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={concertData.location}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    'Update Concert'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
