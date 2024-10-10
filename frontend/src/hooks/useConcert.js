import { useEffect, useState } from "react"
import { getAllConcert, getOneConcert, postConcert, updateConcert } from "../services/concertServices"
import useLoading from "./useLoading";
import { showErrorToast, showSuccessToast } from "../utils/Toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../services/authService";

// Debounce utility function to delay function execution
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
  const nowLocation = location.pathname
  const [dataConcert, setConcert] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setLoading } = useLoading(false); // Set initial loading to false

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
      setLoading(true);
      const response = await getAllConcert();
      setConcert(response.data.data);
    } catch (error) {
      console.error("Failed to fetch concert data:", error);
      // Set empty array instead of null on error
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

  const refreshConcerts = () => {
    fetchConcertsDebounced();
  };

  return { 
    dataConcert,
    refreshConcerts
  };
}

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