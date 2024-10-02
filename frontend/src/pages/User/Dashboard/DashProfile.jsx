import React from 'react'
import Sidebar from './Partials/Sidebar.jsx';
import TopBar from './Partials/TopBar.jsx';
import Profile from './Partials/Profile.jsx';

export default function DashProfile() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className='w-64'></div>
      <Sidebar />

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
