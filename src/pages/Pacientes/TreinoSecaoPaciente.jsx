import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Card from '../../components/Card';
import '../../components/css/TreinosSecaoPaciente.css';

export default function TreinosSecaoPaciente() {
  const { secaoId } = useParams();

  const { data: treinos = [], isLoading, isError } = useQuery(
    ['treinosSecao', secaoId],
    async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/por_secao/?secao=${secaoId}`
      );
      return data;
    },
    { enabled: !!secaoId }
  );

  return (
    <div className="conteudo">
      {isLoading ? (
        <p className="treinos-secao-status">Carregando...</p>
      ) : isError ? (
        <p className="treinos-secao-status">Erro ao carregar os treinos.</p>
      ) : (
        <Card title="Treinos da Seção" size="al">
          {treinos.length > 0 ? (
            <ul className="treinos-secao-list">
              {treinos.map((t) => (
                <li key={t.id} className="treinos-secao-item">
                  <Link to={`/paciente/treinos/${t.id}`} className="treinos-secao-link">
                    {t.nome || 'Treino sem nome'}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="treinos-secao-status">Nenhum treino disponível nesta seção.</p>
          )}
        </Card>
      )}
    </div>
  );
}
