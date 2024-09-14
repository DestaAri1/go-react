import React from 'react'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthRoute = ({children}) => {
    const token =  Cookies.get('token');

    if (token) {
      return <Navigate to="/" />; // Redirect ke halaman utama jika token ditemukan
    }
    
    return <>{children}</>;
}

export const ProtectedRoute = ({children}) => {
  const token = Cookies.get('token'); // Atau dari state management

  if (!token) {
    return <Navigate to="/login" />; // Redirect ke login jika token tidak ada
  }
  
  return <>{children}</>;
}
