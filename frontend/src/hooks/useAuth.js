import { useEffect, useState } from 'react';
import { getUser } from '../services/authService';
import { DeleteToken, getToken } from '../utils/AuthRoute.js';

export default function useAuth() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tokenFromCookie = getToken();
    setToken(tokenFromCookie);

    if (tokenFromCookie) {
      getUser()
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          DeleteToken();
        });
    }
  }, []);

  const logout = (navigate) => {
    DeleteToken();
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return {
    token,
    user,
    setUser,
    logout
  };
}
