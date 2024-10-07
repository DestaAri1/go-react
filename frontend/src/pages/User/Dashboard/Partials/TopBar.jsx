import React, { useEffect, useRef } from 'react';
import useDropdown from '../../../../hooks/useDropDown.js';
import useAuth from '../../../../hooks/useAuth.js';
import DropdownUser from '../../../../layouts/partials/DropdownUser.jsx';
import LoadingSpinner from '../../../../components/LoadingSpinner.js';
import { FaSearch } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function TopBar() {
  const { isDropdownOpen, toggleDropdown, closeDropdown } = useDropdown();
  const { user, loading } = useAuth(); // Pastikan useAuth mengembalikan user dan loading state
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  // Jika sedang loading, tampilkan spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex justify-between items-center bg-white shadow-lg p-4">
      {/* Search Bar */}
      <div className="w-1/3 relative">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search..."
        />
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
      </div>

      {/* User Profile or Loading */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-2 rounded-md transition duration-200"
          >
          {user.image !== '' ? (
              <img
              src={`http://127.0.0.1:3000/uploads/${user.image}`} // Pastikan URL gambar benar
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }} // Fallback jika gambar tidak ada
            />
          ) : (
            <div className='flex items-center w-10 h-10 rounded-full cursor-pointer'>
              <FontAwesomeIcon icon={faUser}/>
            </div>
          )}
            <span className="font-medium text-gray-700">{user.name}</span>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border-gray-200 rounded-md shadow-lg">
              <DropdownUser user={user} />
            </div>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
