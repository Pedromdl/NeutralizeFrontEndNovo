// hooks/useEventos.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useEventos() {
  return useQuery(
    ['eventos'],
    async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/eventos/`);
      return res.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
