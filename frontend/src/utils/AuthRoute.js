import React from 'react'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from '../hooks/useAuth';

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
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

export const AdminRoute = ({children}) => {
  const {user} = useAuth()

  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  // Periksa apakah user sudah ada dan apakah role-nya adalah admin (role 0)
  if (user && user.role !== 0) {
    return <Navigate to="/" />; // Redirect jika bukan admin
  }

  return <>{children}</>;
}

export const DeleteToken = function () {
  Cookies.remove("token", {path : '/'})
}