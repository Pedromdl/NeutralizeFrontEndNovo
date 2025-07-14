import { useEffect, useState } from 'react';
import axios from 'axios';

function FiltroData({ usuarioId, valorSelecionado, onChange }) {
  const [datas, setDatas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      setCarregando(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/datas-disponiveis/`, {
          params: { paciente: usuarioId },
        })
        .then((res) => {
          setDatas(res.data);
          setCarregando(false);
        })
        .catch((err) => {
          console.error('Erro ao buscar datas disponíveis:', err);
          setCarregando(false);
        });
    }
  }, [usuarioId]);

  if (carregando) return <p>Carregando datas...</p>;
  if (datas.length === 0) return <p>Nenhuma data encontrada.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor="filtro-data" style={{ fontWeight: 500 }}>
        Filtrar por data da avaliação:
      </label>
      <select
        id="filtro-data"
        value={valorSelecionado || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          background: '#fff',
          fontSize: '1rem',
        }}
      >
        <option value="">Mais recente</option>
        {datas.map((data) => (
          <option key={data} value={data}>
            {new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(data))}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FiltroData;
