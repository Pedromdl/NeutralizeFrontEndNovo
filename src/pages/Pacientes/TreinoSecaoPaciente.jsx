import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

export default function TreinosSecaoPaciente() {
  const { secaoId } = useParams();
  const [treinos, setTreinos] = useState([]);
  const [secao, setSecao] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/${secaoId}/`)
      .then(res => setSecao(res.data))
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/?secao=${secaoId}`)
      .then(res => setTreinos(res.data))
      .catch(err => console.error(err));
  }, [secaoId]);

  if (!secao) return <p>Carregando seção...</p>;

  return (
    <div className="conteudo">
      <Card title={`Treinos da seção: ${secao.titulo}`} size="al">
        {treinos.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {treinos.map(t => (
              <li key={t.id} style={{ marginBottom: '0.5rem' }}>
                {/* Alterado para abrir TreinoInterativo */}
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
