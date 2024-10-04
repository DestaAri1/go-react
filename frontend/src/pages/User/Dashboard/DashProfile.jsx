import React from 'react'
import Sidebar from './Partials/Sidebar.jsx';
import TopBar from './Partials/TopBar.jsx';
import Profile from './Partials/Profile.jsx';
import useSidenav from '../../../hooks/useSidenav.js';

export default function DashProfile() {
  const {isSidebarExpanded, handleToggleSidebar} = useSidenav();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${isSidebarExpanded ? 'w-64' : 'w-20'} transition-all duration-300`}>
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={handleToggleSidebar} title={'Profile'} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar />

        {/* Profile Content */}
        <Profile/>
      </div>
    </div>
  )
}
