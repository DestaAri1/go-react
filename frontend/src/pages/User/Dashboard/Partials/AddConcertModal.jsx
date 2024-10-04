import React, { useState, useEffect } from 'react';
import Input from '../../../../components/Input';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useConcertForm } from '../../../../hooks/useConcert';

export default function AddConcertModal({ closeModal }) {
  const [isVisible, setIsVisible] = useState(false);

  // Gunakan hook useConcertForm, dengan data awal untuk concert kosong
  const { concertData, handleChange, handleSubmit, isLoading } = useConcertForm({
    name: '',
    date: '',
    location: ''
  }, closeModal);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white p-6 rounded-md shadow-lg w-96 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Add Concert</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label={'Name'}
              type={'text'}
              value={concertData.name}
              name={'name'}
              tampilan={'admin'}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="mb-4">
            <Input
              label={'Date'}
              type={'datetime-local'}
              value={concertData.date}
              name={'date'}
              tampilan={'admin'}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="mb-4">
            <Input
              label={'Location'}
              type={'text'}
              value={concertData.location}
              name={'location'}
              tampilan={'admin'}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isLoading ? <LoadingSpinner/> : 'Save Concert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
