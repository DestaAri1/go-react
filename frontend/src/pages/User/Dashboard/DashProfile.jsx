import React, { useState } from 'react'
import Sidebar from './Partials/Sidebar.jsx';
import TopBar from './Partials/TopBar.jsx';
import Profile from './Partials/Profile.jsx';

export default function DashProfile() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // State to track sidebar siz

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded); // Toggle sidebar size
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${isSidebarExpanded ? 'w-64' : 'w-20'} transition-all duration-300`}>
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={handleToggleSidebar} />
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
