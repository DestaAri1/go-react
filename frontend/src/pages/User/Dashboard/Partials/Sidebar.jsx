import React from 'react'

export default function Sidebar() {
  return (
    <div className="fixed h-screen w-64 bg-gray-800 text-white">
        <h2 className="text-2xl font-bold text-center py-4">Dashboard</h2>
        <ul>
        <li className="py-2 px-4 hover:bg-gray-700">Overview</li>
        <li className="py-2 px-4 hover:bg-gray-700">Users</li>
        <li className="py-2 px-4 hover:bg-gray-700">Settings</li>
        </ul>
    </div>
  )
}
