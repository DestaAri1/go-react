import axios from 'axios';
import Cookies from 'js-cookie';
import { getToken } from '../utils/AuthRoute';

const API_URL = "http://localhost:3000/api"; // Ganti dengan URL API backend-mu

// Fungsi untuk login
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
    Cookies.set('token', token, { expires: 1 }); // Simpan token selama 1 hari

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data; 
    }
    throw new Error("Network error");
  }
};

// Fungsi untuk registrasi
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
    Cookies.set('token', token, { expires: 1 }); // Simpan token selama 1 hari

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error("Network error");
  }
};

// Fungsi untuk mendapatkan data user
export const getUser = async () => {
  try {
    const token = getToken(); // Ambil token dari cookie

    if (!token) {
      throw new Error('Token is missing');
    }

    const response = await axios.get(`${API_URL}/auth/getUser`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,  // Sertakan token dalam header Authorization
      },
    });

    return response.data.data; // Pastikan ini sesuai dengan struktur data respons
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
};
