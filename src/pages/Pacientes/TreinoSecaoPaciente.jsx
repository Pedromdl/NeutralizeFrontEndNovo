import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Card from '../../components/Card';

export default function TreinosSecaoPaciente() {
  const { secaoId } = useParams();

  // 🔹 Fetch da seção
  const { data: secao, isLoading: loadingSecao, isError: erroSecao } = useQuery(
    ['secao', secaoId],
    async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/${secaoId}/`);
      return data;
    },
    { enabled: !!secaoId }
  );

  // 🔹 Fetch dos treinos da seção
  const { data: treinos = [], isLoading: loadingTreinos, isError: erroTreinos } = useQuery(
    ['treinosSecao', secaoId],
    async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/?secao=${secaoId}`);
      return data;
    },
    { enabled: !!secaoId }
  );

  if (loadingSecao || loadingTreinos) return <Card title="Treinos da Seção" size="al">Carregando...</Card>;
  if (erroSecao) return <Card title="Treinos da Seção" size="al">Erro ao carregar a seção.</Card>;
  if (erroTreinos) return <Card title="Treinos da Seção" size="al">Erro ao carregar os treinos.</Card>;

  return (
    <div className="conteudo">
      <Card title={`Treinos da seção: ${secao.titulo}`} size="al">
        {treinos.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {treinos.map(t => (
              <li key={t.id} style={{ marginBottom: '0.5rem' }}>
                <Link
                  to={`/paciente/treinos/${t.id}`} 
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    backgroundColor: '#f0f0f0',
                    padding: '1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {t.nome || 'Treino sem nome'}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum treino disponível nesta seção.</p>
        )}
      </Card>
    </div>
  );
}
