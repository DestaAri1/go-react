import { getToken } from '../utils/AuthRoute';
import axios from 'axios';

const API_URL = "http://localhost:3000/api";
const token = getToken();

export const getAllConcert = async () => {
  try {
    const response = await axios.get(`${API_URL}/event`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
};

export const postConcert = async (name, location, date) => {
  try {
    const response = await axios.post(`${API_URL}/event`,
      { name, location, date },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
    throw new Error("Network error");
  }
}