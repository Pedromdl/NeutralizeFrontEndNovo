import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';

export default function Sessoes({ usuarioId }) {
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioId) return;

    const fetchSessoes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/sessoes/?paciente=${usuarioId}`
        );
        const data = await response.json();
        setSessoes(data);
      } catch (error) {
        console.error('Erro ao buscar sessões:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessoes();
  }, [usuarioId]);

  const abrirSessao = (id) => {
    navigate(`/sessoes/${id}`);
  };

  return (
    <Card title="Sessões do Paciente" size="al">
      <button className='black' onClick={() => navigate(`/sessoes/nova/${usuarioId}`)}     >
        + Nova Sessão
      </button>

      {loading ? (
        <p>Carregando sessões...</p>
      ) : sessoes.length === 0 ? (
        <p>Nenhuma sessão encontrada.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sessoes.map(sessao => {
            const [year, month, day] = sessao.data.split('-');
            const dataFormatada = `${day}/${month}/${year}`;


            return (
              <li
                key={sessao.id}
                style={{
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #ddd'
                }}
                onClick={() => abrirSessao(sessao.id)}
              >

                <strong>{`Sessão em ${dataFormatada}`}</strong>
              </li>
            );

          })}

        </ul>
      )}
    </Card>
  );
}
