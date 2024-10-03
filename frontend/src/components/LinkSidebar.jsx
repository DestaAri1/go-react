import React from 'react'
import { Link } from 'react-router-dom'

export default function LinkSidebar({text, Icon, url, isExpanded}) {
  
  return (
  <Link
    to={url}
    className="py-3 px-4 hover:bg-gray-800 flex items-center space-x-3 cursor-pointer transition-all duration-300"
  >
    <Icon className={`text-lg transition-transform duration-300 ${isExpanded ? 'scale-100' : 'scale-75'}`} />
    <span
      className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} 
      ${!isExpanded && 'hidden'}`}
    >
      {text}
    </span>
  </Link>
  )
}
