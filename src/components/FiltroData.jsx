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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4}}>
  <label htmlFor="filtro-data" style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
  </label>
  <select
    id="filtro-data"
    value={valorSelecionado || ''}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '10px 12px',
      borderRadius: '10px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f9fafb',
      fontSize: '0.95rem',
      color: '#111827',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease-in-out',
      appearance: 'none', // remove a seta padrão
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='gray' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      backgroundSize: '16px 16px',
    }}
    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
