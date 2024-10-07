import { useEffect, useState } from "react"
import { getAllConcert, getOneConcert, postConcert, updateConcert } from "../services/concertServices"
import useLoading from "./useLoading";
import { showErrorToast, showSuccessToast } from "../utils/Toast";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/authService";

export default function useConcert() {
  const [dataConcert, setConcert] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchConcerts = async () => {
    try {
      const response = await getAllConcert();
      setConcert(response.data.data);
    } catch (error) {
      console.error("Failed to fetch concert data:", error);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token && !isInitialized) {
      setIsInitialized(true);
      fetchConcerts();
    }
  }, [isInitialized]);

  // Menambahkan method untuk memperbarui data
  const refreshConcerts = () => {
    fetchConcerts();
  };

  return { dataConcert, refreshConcerts };
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