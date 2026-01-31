import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export function usePastasQuery(usuarioId) {
  return useQuery({
    queryKey: ['pastas', usuarioId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/pastas/?paciente=${usuarioId}`
      );
      return res.data;
    },
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });
}
