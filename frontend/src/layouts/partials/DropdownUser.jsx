import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import useLoading from '../../hooks/useLoading.js';
import useAuth from '../../hooks/useAuth.js';
import { showErrorToast } from '../../utils/Toast.js';
import LinkDropDown from '../../components/LinkDropDown.jsx';

export default function DropdownUser({ user }) {
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoading(false);
  const { logout } = useAuth();
  const {id} = useParams()
  const location = useLocation();
  const nowLocation = location.pathname

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
      {user.role === 0 && (nowLocation === '/dashboard' || nowLocation === '/dashboard/profile' || nowLocation === '/dashboard/event'
      || nowLocation === `/dashboard/event/${id}`) ? (
        <div>
          <LinkDropDown url={"/"} name={'Home'}/>
          <LinkDropDown url={"/dashboard/profile"} name={'Profile'}/>
        </div>
      ) : (
        user && (
          <div>
            {user.role === 0 && (
              <LinkDropDown url={'/dashboard'} name={"Dashboard"}/>
            )}
            <LinkDropDown url={'/profile'} name={"Profile"}/>
            <LinkDropDown url={'/tickets'} name={"Tickets"}/>
            <LinkDropDown url={'/settings'} name={"Settings"}/>
          </div>
        )
      )}
      <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLogout}>
        {isLoading ? <LoadingSpinner color='text-gray-900' /> : "Sign Out"}
      </button>
    </div>
  );
}
