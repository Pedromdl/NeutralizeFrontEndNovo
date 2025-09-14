import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';

export default function OrientacoesPaciente() {
  const { user, loading } = useContext(AuthContext); // pega o paciente logado
  const [pastaSelecionada, setPastaSelecionada] = useState(null);

  // 🔹 Fetch das pastas usando React Query
  const { data: pastas = [], isLoading, isError } = useQuery(
    ['pastas', user?.id],
    async () => {
      if (!user) return [];
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`
      );
      return data;
    },
    {
      enabled: !!user, // só roda se user existir
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
      refetchOnWindowFocus: false,
    }
  );

  if (loading || isLoading)
    return <Card title="Minhas Orientações" size="al">Carregando...</Card>;

  if (!user) return <Card title="Minhas Orientações" size="al">Usuário não autenticado</Card>;
  if (isError) return <Card title="Minhas Orientações" size="al">Não foi possível carregar as pastas</Card>;

  return (
    <div className="conteudo">
      <Card title="Minhas Orientações" size="al">
        {!pastaSelecionada ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastas.length > 0 ? pastas.map((pasta) => (
              <li
                key={pasta.id}
                style={{
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #ddd',
                }}
                onClick={() => setPastaSelecionada(pasta)}
              >
                {pasta.nome}
              </li>
            )) : <li>Nenhuma pasta encontrada.</li>}
          </ul>
        ) : (
          <>
            <button
              onClick={() => setPastaSelecionada(null)}
              style={{ marginBottom: '1rem' }}
            >
              ← Voltar para pastas
            </button>
            <h2>{pastaSelecionada.nome}</h2>
            {pastaSelecionada.secoes?.map((secao) => (
              <Link
                key={secao.id}
                to={`/paciente/treinos/${secao.id}`} 
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <h3>{secao.titulo}</h3>
              </Link>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
