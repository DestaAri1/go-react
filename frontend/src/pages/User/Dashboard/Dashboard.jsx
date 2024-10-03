import React, { useState } from 'react';
import Sidebar from './Partials/Sidebar';
import DashboardContent from './Partials/DashboardContent';
import TopBar from './Partials/TopBar';

export default function Dashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // State to track sidebar size

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
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* TopBar */}
        <TopBar />

        {/* Dashboard Content */}
        <DashboardContent />
      </div>
    </div>
  );
}
