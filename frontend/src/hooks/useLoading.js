import { useState } from 'react';

export default function useLoading(initialLoading = true) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const setLoading = (status) => {
    setIsLoading(status);
  };

  return {
    isLoading,
    setLoading
  };
}
