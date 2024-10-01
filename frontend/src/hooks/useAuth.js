// useAuth.js
import { useEffect, useState } from 'react';
import { getUser, getToken, removeToken, setToken, login as authLogin } from '../services/authService.js';

export default function useAuth() {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      getUser()
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await authLogin(email, password);
    setToken(response.data.token);
    setTokenState(response.data.token);
    setUser(response.data.user);
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
    logout
  };
}