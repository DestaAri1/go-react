import React from 'react'

export default function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">User Stats</h2>
            <p>100 active users</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Sales</h2>
            <p>$5000 this month</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <p>5 tasks pending</p>
        </div>
        </div>
    </div>
  )
}
