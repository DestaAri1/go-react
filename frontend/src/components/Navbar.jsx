import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner.js';
import useNavbarState from '../states/useNavbarState.tsx';

export default function Navbar(props) {
  const {
    token,
    isDropdownOpen,
    isLoading,
    isLoggingOut,
    handleDropdownToggle,
    handleLogout
  } = useNavbarState();  // Gunakan state dan handler dari custom hook

  return (
    <nav className="bg-gray-900 p-4 sticky top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="text-white text-2xl font-bold w-[15%]">Concert Tickets</div>
        <ul className="flex space-x-6 w-[70%] justify-center">
          <li><Link to="/" className="text-white hover:text-indigo-500">Home</Link></li>
          <li><Link to="/concerts" className="text-white hover:text-indigo-500">Concerts</Link></li>
          <li><Link to="/about" className="text-white hover:text-indigo-500">About</Link></li>
          <li><Link to="/contact" className="text-white hover:text-indigo-500">Contact</Link></li>
        </ul>
        <div className='w-[15%] flex justify-end'>
          {isLoading ? (
            <LoadingSpinner />  // Tampilkan spinner jika sedang loading
          ) : token ? (
            <div className="relative">
              <div className='w-10 h-10 rounded-full cursor-pointer'>
                <FontAwesomeIcon icon={faUser} onClick={handleDropdownToggle} />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</Link>
                  <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? <LoadingSpinner color='text-gray-900'/> : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
