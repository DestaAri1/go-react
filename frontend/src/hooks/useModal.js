// hooks/useModal.js
import { useState } from 'react';

export default function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    handleOpenModal,
    handleCloseModal
  };
}
