import { useState } from 'react';

export default function useLoading() {
  const [isLoading, setIsLoading] = useState(true);

  const setLoading = (status) => {
    setIsLoading(status);
  };

  return {
    isLoading,
    setLoading
  };
}
