import { useQuery } from '@tanstack/react-query';

interface Breed {
  id: string;
  name: string;
}

const fetchBreeds = async (): Promise<Breed[]> => {
  const response = await fetch('http://localhost:3001/api/breeds');
  if (!response.ok) {
    throw new Error('Failed to fetch breeds');
  }
  return response.json();
};

export const useBreeds = () => {
  return useQuery({
    queryKey: ['breeds'],
    queryFn: fetchBreeds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
