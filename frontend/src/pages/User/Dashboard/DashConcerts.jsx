import React from 'react';
import Sidebar from './Partials/Sidebar';
import useSidenav from '../../../hooks/useSidenav.js';
import TopBar from './Partials/TopBar.jsx';
import ConcertList from './Partials/ConcertList.jsx';
import AddConcertModal from './Partials/AddConcertModal.jsx';
import useModal from '../../../hooks/useModal.js';
import useConcert from '../../../hooks/useConcert.js';
import useLoading from '../../../hooks/useLoading.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashConcerts() {
  const { isSidebarExpanded, handleToggleSidebar } = useSidenav();
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const { dataConcert, refreshConcerts } = useConcert();
  const { isLoading, setLoading } = useLoading();

  return (
    <>
      <ToastContainer/>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${isSidebarExpanded ? 'w-64' : 'w-20'} transition-all duration-300`}>
          <Sidebar
            isExpanded={isSidebarExpanded}
            toggleSidebar={handleToggleSidebar}
            title={'Events'}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* TopBar */}
          <TopBar />
          
          {/* Concert List */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Concerts</h2>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleOpenModal}
              >
                Add Concert
              </button>
            </div>
            
            <ConcertList 
              dataConcert={dataConcert}
              refreshConcerts={refreshConcerts}
              isLoading={isLoading}
              setLoading={setLoading}
            />
          </div>
        </div>

        {/* Add Concert Modal */}
        {isModalOpen && <AddConcertModal closeModal={handleCloseModal} />}
      </div>
    </>
  );
}