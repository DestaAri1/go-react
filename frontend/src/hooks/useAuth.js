import { useEffect, useState } from 'react';
import { getUser, getToken, removeToken, setToken, login as authLogin } from '../services/authService.js';

export default function useAuth() {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const currentToken = getToken();
      
      if (currentToken) {
        setTokenState(currentToken);
        try {
          const userData = await getUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Jika gagal mengambil data user, hapus token
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []); // Run once on mount

  const login = async (email, password) => {
    try {
      const response = await authLogin(email, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setTokenState(newToken);
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return {
    token,
    user,
    setUser,
    login,
    logout,
    isLoading
  };
}