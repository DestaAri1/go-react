import React, { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/LoadingSpinner.js';
import useAuth from '../hooks/useAuth.js';
import useDropdown from '../hooks/useDropDown.js';
import DropdownUser from './partials/DropdownUser.jsx';
import LinkNavbar from '../components/LinkNavbar.jsx';

export default function Navbar({ title = "Concert Tickets" }) {
  const { token, user, setUser } = useAuth();
  const { isDropdownOpen, toggleDropdown } = useDropdown();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageKey, setProfileImageKey] = useState(Date.now());

  // Function to refresh profile image
  const refreshProfileImage = useCallback(() => {
    setProfileImageKey(Date.now());
  }, []);

  // Listen for custom event to refresh profile image
  useEffect(() => {
    window.addEventListener('refreshProfileImage', refreshProfileImage);
    return () => {
      window.removeEventListener('refreshProfileImage', refreshProfileImage);
    };
  }, [refreshProfileImage]);

  // Function to update user data
  const updateUserData = useCallback((newUserData) => {
    setUser(newUserData);
    refreshProfileImage();
  }, [setUser]);

  useEffect(() => {
    // This effect will run when the component mounts and whenever token or user changes
    // The actual user fetching logic is handled in the useAuth hook
    setIsLoading(!user && !!token);
  }, [user, token]);

  return (
    <nav className="bg-gray-900 p-4 sticky top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="text-white text-2xl font-bold w-[15%]">{title}</div>
        <ul className="flex space-x-6 w-[70%] justify-center">
          <li><LinkNavbar url={'/'} name={'Home'}/></li>
          <li><LinkNavbar url={'/concerts'} name={'Concerts'}/></li>
          <li><LinkNavbar url={'/about'} name={'About'}/></li>
          <li><LinkNavbar url={'/contact'} name={'Contact'}/></li>
        </ul>
        <div className='w-[15%] flex justify-end'>
          {isLoading ? (
            <LoadingSpinner />
          ) : token && user ? (
            <div className="relative">
              {user.image ? (
                <img
                  src={`http://127.0.0.1:3000/uploads/${user.image}?${profileImageKey}`}
                  alt="Profile"
                  className="flex items-center w-10 h-10 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                />
              ) : (
                <div className='flex items-center w-10 h-10 rounded-full cursor-pointer'>
                  <FontAwesomeIcon icon={faUser} onClick={toggleDropdown} />
                </div>
              )}
              {isDropdownOpen && (
                <DropdownUser user={user} updateUserData={updateUserData} />
              )}
            </div>
          ) : (
            <LinkNavbar url={'/login'} name={'Sign In'} style={'px-4 py-2 rounded-lg'}/>
          )}
        </div>
      </div>
    </nav>
  );
}