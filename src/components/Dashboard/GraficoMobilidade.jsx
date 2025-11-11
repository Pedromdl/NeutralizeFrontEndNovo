import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';
import { AuthContext } from '../../context/AuthContext';

function GraficoMobilidade({ usuarioId, dataSelecionada, token }) {
  const { user } = useContext(AuthContext);

  const { data: dados = [], isLoading, isError } = useQuery(
    ['mobilidade', usuarioId, dataSelecionada, token],
    async () => {
      if (!usuarioId && !token) return [];

      // 🔹 MODO 1 — autenticado
      if (usuarioId) {
        const params = { paciente: usuarioId };
        if (dataSelecionada) params.data_avaliacao = dataSelecionada;

        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/mobilidade/`, { params });
        return mapearDados(data, false);
      }

      // 🔹 MODO 2 — público (sem autenticação, via token)
      if (token) {
        const params = {};
        if (dataSelecionada) params.data_avaliacao = dataSelecionada;

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/mobilidade-publica/${token}/`,
          { params }
        );
        return mapearDados(data, true);
      }
    },
    {
      enabled: !!usuarioId || !!token,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  // 🔹 Normalização dos dados (autenticado vs público)
  function mapearDados(data, isPublic) {
    return data.map(item => {
      const esquerdo = Number(item.lado_esquerdo);
      const direito = Number(item.lado_direito);
      const assimetria = Math.abs(esquerdo - direito) / Math.max(esquerdo, direito) * 100;

      return {
        Movimento: item.nome_teste, // tanto público quanto interno usam esse campo agora
        Esquerdo: esquerdo,
        Direito: direito,
        Data: item.data_avaliacao,
        Assimetria: Number(assimetria.toFixed(1)),
      };
    });
  }

  if (isLoading) return <p>Carregando dados de mobilidade...</p>;
  if (isError) return <p>Erro ao carregar dados de mobilidade.</p>;
  if (!dados.length) return <p>Nenhum dado encontrado.</p>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const dataAvaliacao = payload[0].payload.Data;

    return (
      <div style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
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
        <XAxis dataKey="Movimento" />
        <YAxis yAxisId="left" label={{ value: "Mobilidade (º)", angle: -90, position: "insideLeft" }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: "Assimetria (%)", angle: 90, position: "insideRight" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar yAxisId="left" dataKey="Esquerdo" fill="#282829" />
        <Bar yAxisId="left" dataKey="Direito" fill="#b7de42" />
        <Line yAxisId="right" type="monotone" dataKey="Assimetria" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoMobilidade;
