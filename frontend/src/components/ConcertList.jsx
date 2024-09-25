import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import useLoading from '../hooks/useLoading.js';
import { useState } from 'react';
import { createTicket } from '../services/tikcetService.js';

export default function ConcertList({ concerts, cols = 4 }) {
  const [formData, setFormData] = useState({ id: '' });
  const [error, setError] = useState();
  const { isLoading, setLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e, concertId) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTicket(concertId); // Pass the correct event ID
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create data');
    } finally {
      setLoading(false);
    }
  };

  if (!Array.isArray(concerts) || concerts.length === 0) {
    return <div className="text-white text-center">No concerts available</div>;
  }

  const getGridCols = () => {
    switch (cols) {
      case 3:
        return 'lg:grid-cols-3';
      case 4:
        return 'lg:grid-cols-4';
      default:
        return 'lg:grid-cols-4';
    }
  };

  return (
    <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 ${getGridCols()} gap-6`}>
      {concerts.map((concert, index) => {
        const concertDate = parseISO(concert.date);
        const formattedDate = format(concertDate, 'dd MMMM yyyy', { locale: id });

        return (
          <div key={concert.id || index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img className="w-full h-48 object-cover" src={concert.image} alt={`${concert.name} concert`} />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{concert.name}</h3>
              <h4 className="text-lg font-medium mb-2">{concert.location}</h4>
              <p className="text-gray-400 mb-4">Concert Date: {formattedDate}</p>
              {/* Remove hidden input and handle concertId directly */}
              <button
                onClick={(e) => handleSubmit(e, concert.id)} // Pass concert.id directly to handleSubmit
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
