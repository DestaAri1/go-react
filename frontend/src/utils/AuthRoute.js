import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner'; // Sesuaikan dengan path yang benar

export const getToken = () => {
  return Cookies.get('token');
}

export const AuthRoute = ({children}) => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (getToken()) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

export const ProtectedRoute = ({children}) => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!getToken()) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

export const AdminRoute = ({children}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!getToken()) {
    return <Navigate to="/login" />;
  }
  
  if (user && user.role !== 0) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

export const DeleteToken = () => {
  Cookies.remove("token", { path: '/' });
}