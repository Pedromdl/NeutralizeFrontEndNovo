import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos: dados considerados "frescos"
      cacheTime: 1000 * 60 * 30, // 30 minutos: quanto tempo fica guardado em memória
      refetchOnWindowFocus: false, // evita refetch ao voltar para a aba
      retry: 1, // número de tentativas caso falhe a requisição
    },
  },
});