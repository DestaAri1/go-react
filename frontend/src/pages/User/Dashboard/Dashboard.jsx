import React from 'react'
import Sidebar from './Partials/Sidebar'
import DashboardContent from './Partials/DashboardContent'
import TopBar from './Partials/TopBar'

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar />

        {/* Dashboard Content */}
        <DashboardContent />
      </div>
    </div>
  )
}
