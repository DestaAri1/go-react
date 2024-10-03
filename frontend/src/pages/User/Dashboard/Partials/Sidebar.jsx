import React from 'react';
import { FaTachometerAlt, FaUsers, FaCog, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { MdEvent } from "react-icons/md";
import LinkSidebar from '../../../../components/LinkSidebar';

export default function Sidebar({ isExpanded, toggleSidebar }) {
  return (
    <div
      className={`fixed h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Toggle Button */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 right-[-15px] w-8 h-16 bg-gray-900 flex items-center justify-center rounded-r-full shadow-md cursor-pointer transition-all duration-300"
        onClick={toggleSidebar}
      >
        <button className="text-white focus:outline-none">
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`p-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 translate-x-[-100%]'} 
        ${isExpanded ? 'block' : 'hidden'}`}
      >
        <h2 className="text-2xl font-bold text-center">Dashboard</h2>
        <hr className="border-gray-700 mt-4" />
      </div>

      <div className="space-y-2 mt-6">
        <LinkSidebar
          Icon={FaTachometerAlt}
          url={'/dashboard'}
          text={'Dashboard'}
          isExpanded={isExpanded}
        />
        <LinkSidebar
          Icon={MdEvent}
          url={'/dashboard/event'}
          text={'Event'}
          isExpanded={isExpanded}
        />
        <LinkSidebar
          Icon={FaCog}
          text={'Settings'}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}
