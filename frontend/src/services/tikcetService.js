import axios from 'axios';
import { getToken } from '../utils/AuthRoute.js';

const API_URL = "http://localhost:3000/api";
const token = getToken()
const header = {
  "Content-Type": "multipart/form-data",
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
}

export const getAllTickets = async() => {
    try {
      const response = await axios.get(`${API_URL}/ticket`, {
        headers:header})
      return response
    } catch (error) {
      if (error.response) {
        throw error.response.data.message;
      }
      throw new Error("Network error");
    }
}

export const getOneTicket = async(id) => {
  try {
    const response = await axios.get(`${API_URL}/ticket/${id}`, {
      headers:header})
      return response.data.data
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}

export const createTicket = async(eventId) => {
  try {
    const response = await axios.post(`${API_URL}/ticket`, {
      eventId
    },{
      headers:header
    })
    return response
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}
