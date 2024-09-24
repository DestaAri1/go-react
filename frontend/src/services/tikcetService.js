import axios from 'axios';
import { getToken } from '../utils/AuthRoute.js';

const API_URL = "http://localhost:3000/api";
const token = getToken()

export const getAllTickets = async() => {
    try {
      const response = await axios.get(`${API_URL}/ticket`, {
        headers:{
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          }})
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
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        }})
      return response
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}
