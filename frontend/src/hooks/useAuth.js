import { useEffect, useState } from 'react';
import { getUser, GetToken, removeToken, setToken } from '../services/authService';

export default function useAuth() {
  const [token, setTokenState] = useState(GetToken());
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
    const response = await login(email, password);
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