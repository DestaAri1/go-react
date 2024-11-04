import { useEffect, useState } from "react"
import { getAllConcert, getOneConcert, postConcert, updateConcert } from "../services/concertServices"
import useLoading from "./useLoading";
import { showErrorToast, showSuccessToast } from "../utils/Toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../services/authService";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

// Constants for cookie and encryption
const CONCERT_DATA_COOKIE = 'concert_data';
const COOKIE_EXPIRY = 1; // Cookie expires in 1 day
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'your-fallback-secret-key-here'; // Idealnya gunakan environment variable

// Utility functions for encryption/decryption
const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

const decryptData = (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Utility functions for cookie management with encryption
const getConcertDataFromCookie = () => {
  try {
    const encryptedCookieData = Cookies.get(CONCERT_DATA_COOKIE);
    if (encryptedCookieData) {
      const decryptedData = decryptData(encryptedCookieData);
      if (decryptedData) {
        const { data, timestamp } = decryptedData;
        // Check if cache is still valid (within 5 minutes)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading from cookie:', error);
    return null;
  }
};

const setConcertDataToCookie = (data) => {
  try {
    const cookieData = {
      data,
      timestamp: Date.now()
    };
    const encryptedData = encryptData(cookieData);
    if (encryptedData) {
      Cookies.set(CONCERT_DATA_COOKIE, encryptedData, { expires: COOKIE_EXPIRY });
    }
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default function useConcert() {
  const location = useLocation();
  const nowLocation = location.pathname;
  const [dataConcert, setConcert] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setLoading } = useLoading(false);

  const nowLoc = (path) => {
    switch (path) {
      case '/dashboard/event':
        return 0;
      default:
        return 1000;
    }
  };

  const fetchConcerts = async () => {
    const token = getToken();
    if (!token) {
      console.error("Token is missing, cannot fetch concerts");
      return;
    }

    try {
      // First, try to get encrypted data from cookie
      const cachedData = getConcertDataFromCookie();
      if (cachedData) {
        console.log('Using cached concert data');
        setConcert(cachedData);
        return;
      }

      // If no valid cached data, fetch from API
      setLoading(true);
      const response = await getAllConcert();
      const concertData = response.data.data;
      setConcert(concertData);
      
      // Save the new encrypted data to cookie
      setConcertDataToCookie(concertData);
    } catch (error) {
      console.error("Failed to fetch concert data:", error);
      setConcert([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConcertsDebounced = debounce(fetchConcerts, nowLoc(nowLocation));

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      fetchConcertsDebounced();
    }
  }, [isInitialized, fetchConcertsDebounced]);

  const refreshConcerts = async () => {
    // Force fetch from API and update encrypted cookie
    try {
      setLoading(true);
      const response = await getAllConcert();
      const concertData = response.data.data;
      setConcert(concertData);
      setConcertDataToCookie(concertData);
    } catch (error) {
      console.error("Failed to refresh concert data:", error);
      setConcert([]);
    } finally {
      setLoading(false);
    }
  };

  // Add function to clear cookie cache
  const clearConcertCache = () => {
    Cookies.remove(CONCERT_DATA_COOKIE);
  };

  return { 
    dataConcert,
    refreshConcerts,
    clearConcertCache
  };
}

// Export encryption utilities if needed elsewhere
export const cookieEncryption = {
  encryptData,
  decryptData
};

export const useConcertForm = (initialData, closeModal) => {
  const [concertData, setConcertData] = useState(initialData);
  const { isLoading, setLoading } = useLoading(false);

  const handleChange = (e) => {
    setConcertData({
      ...concertData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await postConcert(
        concertData.name,
        concertData.location,
        concertData.date
      );

      if (response?.data?.message) {
        showSuccessToast(response.data.message);
        setTimeout(() => {
          closeModal();  // Tetap memanggil closeModal setelah toast
        }, 500); // Memberikan waktu untuk toast muncul sebelum modal tertutup
      }
    } catch (error) {
      console.error('Error handling concert:', error);
      showErrorToast(error.message || 'Failed to submit concert');
    } finally {
      setLoading(false);
    }
  };

  return {
    concertData,
    handleChange,
    handleSubmit,
    isLoading,
  };
};

export const useConcertUpdateForm = (initialData) => {
  const navitage = useNavigate()
  const [concertData, setConcertData] = useState(initialData);
  const { isLoading, setLoading } = useLoading(false);

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        await getOneConcert(initialData.id)
        .then((r) => {
          const concert = r.data.data;
          
          // Konversi format date ISO ke format 'YYYY-MM-DD' untuk input form
          const formattedDate = new Date(concert.date).toISOString().split('T')[0];
          
          setConcertData({
            ...concert,
            date: formattedDate // Hanya ambil tanggal saja
          });
        })
      } catch (error) {
        console.error('Error fetching concert data', error);
      }
    };

    fetchConcert();
  }, [initialData.id]);

  const handleChange = (e) => {
    setConcertData({
      ...concertData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await updateConcert(
        concertData.id, // Tambahkan ID sebagai parameter pertama
        concertData.name,
        concertData.location,
        concertData.date
      );

      if (response?.data?.message) {
        showSuccessToast(response.data.message);
      }
       
      navitage('/dashboard/event')
    } catch (error) {
      console.error('Error handling concert:', error);
      showErrorToast(error.message || 'Failed to submit concert');
    } finally {
      setLoading(false);
    }
  };

  return {
    concertData,
    handleChange,
    handleSubmit,
    isLoading,
  };
};

export const deleteConcert = (initialData, closeModal) => {
  
}