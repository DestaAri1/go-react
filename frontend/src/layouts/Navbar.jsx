import React, { useState, useCallback, useEffect, lazy, Suspense, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth.js';
import useDropdown from '../hooks/useDropDown.js';

const LoadingSpinner = lazy(() => import('../components/LoadingSpinner.js'));
const DropdownUser = lazy(() => import('./partials/DropdownUser.jsx'));
const LinkNavbar = lazy(() => import('../components/LinkNavbar.jsx'));

export default function Navbar({ title = "Concert Tickets" }) {
  const { token, user, setUser } = useAuth();
  const { isDropdownOpen, toggleDropdown } = useDropdown();
  const [profileImageKey, setProfileImageKey] = useState(Date.now());

  const refreshProfileImage = useCallback(() => {
    setProfileImageKey(Date.now());
  }, []);

  useEffect(() => {
    window.addEventListener('refreshProfileImage', refreshProfileImage);
    return () => {
      window.removeEventListener('refreshProfileImage', refreshProfileImage);
    };
  }, [refreshProfileImage]);

  const updateUserData = useCallback((newUserData) => {
    setUser(newUserData);
    refreshProfileImage();
  }, [setUser, refreshProfileImage]);

  // Hapus useEffect dan isLoading state yang tidak perlu
  // karena loading state sudah dihandle di useAuth

  const userSection = useMemo(() => {
    if (!token) {
      return (
        <Suspense fallback={<LoadingSpinner/>}>
          <LinkNavbar url={'/login'} name={'Sign In'} style={'px-4 py-2 rounded-lg'} />
        </Suspense>
      );
    }

    if (!user) {
      return (
        <Suspense fallback={<LoadingSpinner/>}>
          <LoadingSpinner />
        </Suspense>
      );
    }

    return (
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
          <Suspense fallback={<LoadingSpinner/>}>
            <DropdownUser user={user} updateUserData={updateUserData} />
          </Suspense>
        )}
      </div>
    );
  }, [token, user, profileImageKey, isDropdownOpen, toggleDropdown, updateUserData]);

  return (
    <nav className="bg-gray-900 p-4 sticky top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="text-white text-2xl font-bold w-[15%]">{title}</div>
        <Suspense fallback={<LoadingSpinner/>}>
          <ul className="flex space-x-6 w-[70%] justify-center">
            <li><LinkNavbar url={'/'} name={'Home'} /></li>
            <li><LinkNavbar url={'/concerts'} name={'Concerts'} /></li>
            <li><LinkNavbar url={'/about'} name={'About'} /></li>
            <li><LinkNavbar url={'/contact'} name={'Contact'} /></li>
          </ul>
        </Suspense>
        <div className='w-[15%] flex justify-end'>
          {userSection}
        </div>
      </div>
    </nav>
  );
}