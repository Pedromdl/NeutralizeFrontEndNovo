import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';
import { AuthContext } from '../../context/AuthContext';

function GraficoTesteFuncao({ usuarioId, dataSelecionada, token }) {
  const { user } = useContext(AuthContext);

  const { data: dados = [], isLoading, isError } = useQuery(
    ['testeFuncao', usuarioId, dataSelecionada, token],
    async () => {
      if (!usuarioId && !token) return [];

      let params = {};
      if (dataSelecionada) params.data_avaliacao = dataSelecionada;

      let responseData = [];

      // 🔹 Modo autenticado
      if (usuarioId) {
        params.paciente = usuarioId;
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/testefuncao/`, { params });
        responseData = data;
      }

      // 🔹 Modo público
      if (token) {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/funcao-publica/${token}/`, { params });
        responseData = data;
      }

      return responseData.map(item => {
        const esquerdo = Number(item.lado_esquerdo) || 0;
        const direito = Number(item.lado_direito) || 0;
        const assimetria = (esquerdo && direito)
          ? Math.abs(esquerdo - direito) / Math.max(esquerdo, direito) * 100
          : 0;

        return {
          Teste: item.teste_nome || item.teste_id,
          Esquerdo: esquerdo,
          Direito: direito,
          Data: item.data_avaliacao,
          Assimetria: Number(assimetria.toFixed(1)),
        };
      });
    },
    {
      enabled: !!usuarioId || !!token,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <p>Carregando dados de função...</p>;
  if (isError) return <p>Erro ao carregar dados de função.</p>;
  if (!dados.length) return <p>Nenhum dado encontrado.</p>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const dataAvaliacao = payload[0].payload.Data;

    return (
      <div style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
        <p><strong>{label}</strong></p>
        {payload.map((item) => (
          <p key={item.name} style={{ color: item.color }}>
            {item.name}: {item.value} {item.name === 'Assimetria' ? '%' : 'º'}
          </p>
        ))}
        <p style={{ fontSize: '0.85rem', marginTop: 6, color: '#666' }}>
          Data da Avaliação: {dataAvaliacao}
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dados} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Teste" />
        <YAxis yAxisId="left" label={{ value: "Teste", angle: -90, position: "insideLeft" }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Assimetria (%)", angle: 90, position: "insideRight" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar yAxisId="left" dataKey="Esquerdo" fill="#282829" />
        <Bar yAxisId="left" dataKey="Direito" fill="#b7de42" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Assimetria"
          stroke="#ff7300"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoTesteFuncao;
