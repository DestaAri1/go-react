import React from 'react'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const getToken = function () {
  return Cookies.get('token')
}

export const AuthRoute = ({children}) => {
    if (getToken()) {
      return <Navigate to="/" />; // Redirect ke halaman utama jika token ditemukan
    }
    
    return <>{children}</>;
}

export const ProtectedRoute = ({children}) =>  {
  if (!getToken()) {
    return <Navigate to="/login" />; // Redirect ke login jika token tidak ada
  }
  
  return <>{children}</>;
}

export const DeleteToken = function () {
  Cookies.remove("token", {path : '/'})
}