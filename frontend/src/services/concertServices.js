import { getToken } from '../utils/AuthRoute';
import axios from 'axios';

const API_URL = "http://localhost:3000/api";
// Buat instance axios terpisah untuk concert service
const concertAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

// Tambahkan interceptor untuk menambahkan token pada setiap request
concertAxios.interceptors.request.use(
  (config) => {
    const token = getToken(); // Mengambil token terbaru setiap request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllConcert = async () => {
  try {
    const response = await concertAxios.get('/event');
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
};

export const getOneConcert = async(id) => {
  try {
    const response = await concertAxios.get(`/event/${id}`)
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}

export const postConcert = async (name, location, date) => {
  try {
    const response = await concertAxios.post('/event', {
      name, location, date
    })
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}

export const updateConcert = async(id, name, location, date) => {
  try {
    const response = await concertAxios.put(`/event/${id}`, {
      name, location, date
    })
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}

export const deleteContent = async(id) => {
  try {
    const response = await concertAxios.delete(`event/${id}`)
    return response
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}