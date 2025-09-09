import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function usePastas(usuarioId) {
  const queryClient = useQueryClient();

  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const [modalPastaAberto, setModalPastaAberto] = useState(false);
  const [modalSecaoAberto, setModalSecaoAberto] = useState(false);

  // 🔹 Buscar pastas
  const { data: pastas = [] } = useQuery(
    ['pastas', usuarioId],
    async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/?paciente=${usuarioId}`);
      return res.data;
    },
    { enabled: !!usuarioId, staleTime: 1000 * 60 * 5 } // 5 min
  );

  // 🔹 Criar pasta
  const criarPastaMutation = useMutation(
    async (nome) => axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`, { paciente: usuarioId, nome }),
    {
      onSuccess: () => queryClient.invalidateQueries(['pastas', usuarioId]),
    }
  );

  // 🔹 Criar seção
  const criarSecaoMutation = useMutation(
    async ({ pastaId, titulo }) => axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/`, { pasta: pastaId, titulo }),
    {
      onSuccess: () => queryClient.invalidateQueries(['pastas', usuarioId]),
    }
  );

  return {
    pastas,
    pastaSelecionada,
    setPastaSelecionada,
    modalPastaAberto,
    setModalPastaAberto,
    modalSecaoAberto,
    setModalSecaoAberto,
    criarPasta: criarPastaMutation.mutate,
    criarSecao: criarSecaoMutation.mutate,
  };
}
