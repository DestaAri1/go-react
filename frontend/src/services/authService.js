import axios from 'axios';
import Cookies from 'js-cookie';

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
        // Jika login berhasil, ambil token dari response
        const { token } = response.data.data;

        // Simpan token ke dalam cookies
        Cookies.set('token', token, { expires: 1 }); // Simpan token selama 7 hari
    
        return response.data;
    // return response.data;  // Data yang diterima setelah login berhasil
  } catch (error) {
    throw error.response.data; // Return error dari server
  }
};

// Fungsi untuk registrasi
export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
    }, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    });
    // Jika login berhasil, ambil token dari response
    const { token } = response.data.data;

    // Simpan token ke dalam cookies
    Cookies.set('token', token, { expires: 1 }); // Simpan token selama 1 hari

    return response.data; 
    // return response.data; // Data yang diterima setelah registrasi berhasil
  } catch (error) {
    throw error.response.data; // Return error dari server
  }
};
