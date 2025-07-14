import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

export default function OrientacoesComPastas({ usuarioId }) {
  const [pastas, setPastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (usuarioId) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/pastas/?paciente=${usuarioId}`)
        .then((response) => setPastas(response.data))
        .catch((error) => console.error('Erro ao carregar pastas:', error));
    }
  }, [usuarioId]);

  const entrarNaPasta = (pasta) => {
    setPastaSelecionada(pasta);
  };

  const voltarLista = () => {
    setPastaSelecionada(null);
  };

  const abrirSecao = (pastaId, secaoId) => {
    // Rota interna do frontend (não a da API!)
    navigate(`/orientacoes/${pastaId}/secao/${secaoId}`);
  };

  return (
    <Card title="Orientações do Paciente" size="al">
      {!pastaSelecionada ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pastas.map((pasta) => (
            <li
              key={pasta.id}
              style={{ cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}
              onClick={() => entrarNaPasta(pasta)}
            >
              {pasta.nome} ({pasta.secoes?.reduce((total, secao) => total + (secao.orientacoes?.length || 0), 0)} exercícios)
            </li>
          ))}
        </ul>
      ) : (
        <>
          <button onClick={voltarLista} style={{ marginBottom: '1rem' }}>
            ← Voltar para pastas
          </button>
          <h2>{pastaSelecionada.nome}</h2>

          {pastaSelecionada.secoes?.map((secao) => (
            <div
              key={secao.id}
              onClick={() => abrirSecao(pastaSelecionada.id, secao.id)}
              style={{
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '0.5rem',
              }}
            >
              <h3>{secao.titulo}</h3>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}
