import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/LoadingSpinner.js';
import useAuth from '../hooks/useAuth.js';
import useDropdown from '../hooks/useDropDown.js';
import useLoading from '../hooks/useLoading.js';
import DropdownUser from './partials/DropdownUser.tsx';

export default function Navbar({title = "Concert Tickets"}) {
  const { token, user } = useAuth();
  const { isDropdownOpen, toggleDropdown } = useDropdown();
  const { isLoading, setLoading } = useLoading();

  // No need to set loading based on token here
  useEffect(() => {
    if (!token) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [token, setLoading]);

  return (
    <nav className="bg-gray-900 p-4 sticky top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="text-white text-2xl font-bold w-[15%]">{title}</div>
        <ul className="flex space-x-6 w-[70%] justify-center">
          <li><Link to="/" className="text-white hover:text-indigo-500">Home</Link></li>
          <li><Link to="/concerts" className="text-white hover:text-indigo-500">Concerts</Link></li>
          <li><Link to="/about" className="text-white hover:text-indigo-500">About</Link></li>
          <li><Link to="/contact" className="text-white hover:text-indigo-500">Contact</Link></li>
        </ul>
        <div className='w-[15%] flex justify-end'>
          {isLoading ? (
            <LoadingSpinner />
          ) : token ? (
            <div className="relative">
              {user && user.image ? (
                <img
                  src={`http://127.0.0.1:3000/uploads/${user.image}`}
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
                <DropdownUser/>
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
