import { useEffect, useState } from "react"
import { getAllConcert, postConcert } from "../services/concertServices"
import useLoading from "./useLoading";
import { showErrorToast, showSuccessToast } from "../utils/Toast";

export default function useConcert() {
    const [ dataConcert, setConcert] = useState(null)

    useEffect(() => {
        getAllConcert()
        .then((r) => setConcert(r.data.data))
        .catch((error) => console.error("Failed to fetch user data:", error));
    }, [])
  return dataConcert
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
      const formattedDate = new Date(concertData.date).toISOString();

      const response = await postConcert(
        concertData.name,
        concertData.location,
        formattedDate
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