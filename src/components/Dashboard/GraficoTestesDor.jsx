import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { AuthContext } from '../../context/AuthContext';

function GraficoTesteDor({ usuarioId, dataSelecionada }) {
  const { user } = useContext(AuthContext);

  const { data: dados = [], isLoading, isError } = useQuery(
    ['testesDor', usuarioId, dataSelecionada],
    async () => {
      if (!usuarioId) return [];

      const params = { paciente: usuarioId };
      if (dataSelecionada) params.data_avaliacao = dataSelecionada;

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/testedor/`, { params });

      return data.map(item => ({
        id: item.id,
        Teste: item.teste_nome,
        Resultado: Number(item.resultado),
        Data: item.data_avaliacao,
        Observacao: item.observacao || 'Nenhuma',
      }));
    },
    {
      enabled: !!usuarioId,
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <p>Carregando dados de dor...</p>;
  if (isError) return <p>Erro ao carregar dados de dor.</p>;
  if (!dados.length) return <p>Nenhum dado encontrado.</p>;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;

    return (
      <div style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
        <p><strong>{data.Teste}</strong></p>
        <p>Resultado: {data.Resultado}</p>
        <p>Observação: {data.Observacao}</p>
        <p style={{ fontSize: '0.85rem', marginTop: 6, color: '#666' }}>
          Data da Avaliação: {data.Data}
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dados} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="id"
          tickFormatter={(idValue) => {
            const item = dados.find(d => d.id === idValue);
            return item ? item.Teste : '';
          }}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Resultado" fill="#ff4d4d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoTesteDor;
