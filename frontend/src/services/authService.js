// authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = "http://localhost:3000/api"; 

export const getToken = () => {
  return Cookies.get('token') || localStorage.getItem('token');
};

export const setToken = (token) => {
  Cookies.set('token', token, {
    expires: 1, // Expires in 1 day
    path: '/',
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production' // Use secure flag in production
  });
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  Cookies.remove('token', { path: '/' });
  localStorage.removeItem('token');
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    }, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });

    const { token } = response.data.data;
    setToken(token);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error("Network error");
  }
};

export const getUser = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${API_URL}/auth/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    removeToken();
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
    }, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });

    const { token } = response.data.data;
    setToken(token);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error("Network error");
  }
};

export const updateUser = async (username, password, image) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  if (image) {
    formData.append('image', image);
  }

  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/user/update_profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Network error");
  }
};