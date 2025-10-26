import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../components/css/HistoricoTreinos.css';

export default function HistoricoTreinos() {
  const { data: treinos = [], isLoading, isError } = useQuery(
    ['treinosHistoricoRapido'],
    async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orientacoes/historico_treinos/`
      );
      return data;
    }
  );

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="conteudo">
      <Card title="Histórico de Treinos" size="al">
        {isLoading ? (
          <p className="historico-treinos-status">Carregando...</p>
        ) : isError ? (
          <p className="historico-treinos-status">Erro ao carregar os treinos executados.</p>
        ) : treinos.length > 0 ? (
          <ul className="historico-treinos-list">
            {treinos.map((t, index) => (
              <motion.li
                key={t.id}
                className="historico-treinos-item"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={`/paciente/treinosexecutados/${t.id}`}
                  className="historico-treinos-link"
                >
                  {t.treino_nome || 'Treino executado sem nome'} -{' '}
                  {t.data ? new Date(t.data).toLocaleDateString() : '-'}
                </Link>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="historico-treinos-status">Nenhum treino executado encontrado.</p>
        )}
      </Card>
    </div>
  );
}
