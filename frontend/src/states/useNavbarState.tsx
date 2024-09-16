import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteToken } from '../hooks/AuthRoute.js';

export default function useNavbarState() {
const [token, setToken] = useState<string | null>(null);          // Untuk menyimpan token dari cookie
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Mengatur buka/tutup dropdown
  const [isLoading, setIsLoading] = useState(true);   // Mengatur state loading
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Mengatur status saat logout
  const navigate = useNavigate();

  // Cek token di cookie
useEffect(() => {
  const tokenFromCookie = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null; // Fallback ke null jika undefined
  setToken(tokenFromCookie);
  setIsLoading(false);
}, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen); // Membuka/menutup dropdown
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi loading logout
    DeleteToken();    // Menghapus token dari cookie atau local storage
    setToken(null);
    setIsDropdownOpen(false);  // Tutup dropdown setelah logout
    setIsLoggingOut(false);
    navigate("/login"); // Redirect ke halaman login
  };

  return {
    token,
    isDropdownOpen,
    isLoading,
    isLoggingOut,
    handleDropdownToggle,
    handleLogout
  };
}
