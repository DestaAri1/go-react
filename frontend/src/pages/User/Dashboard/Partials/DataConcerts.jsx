import React from 'react';
import { Link } from 'react-router-dom';
import useModal from '../../../../hooks/useModal';

export default function DataConcerts({ dataConcert }) {
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  return (
    <>
      {dataConcert.map((concert) => (
        <tr key={concert.id} className="border-b">
          <td className="px-4 py-2">{concert.name}</td>
          <td className="px-4 py-2">{concert.date}</td>
          <td className="px-4 py-2">{concert.location}</td>
          <td className="px-4 py-2 flex">
            <Link 
                to={`/dashboard/event/${concert.id}`}
                key={concert.id} 
                className="mr-2 px-3 bg-blue-500 rounded-md text-white py-1">Update</Link>
            <button className="text-red-500" onClick={isModalOpen}>Delete</button>
          </td>
        </tr>
      ))}
    </>
  );
}
