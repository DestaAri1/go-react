import React, { useEffect, useRef } from 'react';
import useDropdown from '../../../../hooks/useDropDown.js';
import useAuth from '../../../../hooks/useAuth.js';
import DropdownUser from '../../../../layouts/partials/DropdownUser.jsx';
import LoadingSpinner from '../../../../components/LoadingSpinner.js';

export default function TopBar() {
  const { isDropdownOpen, toggleDropdown, closeDropdown } = useDropdown();
  const { user } = useAuth();
  const dropdownRef = useRef(null); // Ref for dropdown element

  useEffect(() => {
    // Function to handle click outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown(); // Close dropdown when clicked outside
      }
    };

    // Add event listener to detect click outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  return (
    <div className="flex justify-between items-center bg-white shadow-md p-4">
      {/* Search Bar */}
      <div className="w-1/3">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Search..."
        />
      </div>

      {/* User Profile */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center space-x-2">
            <img
              src={`http://127.0.0.1:3000/uploads/${user.image}`}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{user.name}</span>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <DropdownUser user={user} />
          )}
        </div>
      ) : (
        <LoadingSpinner/>
      )}
    </div>
  );
}
