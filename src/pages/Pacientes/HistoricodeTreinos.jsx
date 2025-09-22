import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';

export default function HistoricoTreinos() {
  // 🔹 Fetch dos treinos executados do paciente (apenas nome + data)
  const { data: treinos = [], isLoading, isError } = useQuery(
    ['treinosHistoricoRapido'],
    async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orientacoes/historico_treinos/`
      );
      return data;
    }
  );

  if (isLoading) return <Card title="Histórico de Treinos" size="al">Carregando...</Card>;
  if (isError) return <Card title="Histórico de Treinos" size="al">Erro ao carregar os treinos executados.</Card>;

  return (
    <div className="conteudo">
      <Card title="Histórico de Treinos" size="al">
        {treinos.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {treinos.map(t => (
                <li key={t.id} style={{ marginBottom: '0.5rem' }}>
                    <Link
                        to={`/paciente/treinosexecutados/${t.id}`}
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
                        {t.treino_nome || 'Treino executado sem nome'} - {t.data ? new Date(t.data).toLocaleDateString() : '-'}
                    </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum treino executado encontrado.</p>
        )}
      </Card>
    </div>
  );
}
