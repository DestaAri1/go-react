import { useState } from 'react';

export default function useDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return {
    isDropdownOpen,
    toggleDropdown
  };
}
