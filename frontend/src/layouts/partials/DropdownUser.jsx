import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import useLoading from '../../hooks/useLoading.js';
import useAuth from '../../hooks/useAuth.js';
import { showErrorToast } from '../../utils/Toast.js';

export default function DropdownUser({ user }) {
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoading(false);
  const { logout } = useAuth();
  const location = useLocation(); // Hook untuk mendapatkan lokasi rute saat ini

  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
      logout(navigate);
    } catch (e) {
      showErrorToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
      {/* Jika saat ini berada di Dashboard, tampilkan link Home, jika tidak tampilkan link Dashboard */}
      {location.pathname === '/dashboard' ? (
        <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Home</Link>
      ) : (
        user.role === 0 && (
          <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Dashboard</Link>
        )
      )}
      <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</Link>
      <Link to="/tickets" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Tickets</Link>
      <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</Link>
      <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLogout}>
        {isLoading ? <LoadingSpinner color='text-gray-900' /> : "Sign Out"}
      </button>
    </div>
  );
}
