import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';
import { AuthContext } from '../../context/AuthContext';

function GraficoEstabilidade({ usuarioId, dataSelecionada }) {
  const { user } = useContext(AuthContext);

  const { data: dados = [], isLoading, isError } = useQuery(
    ['estabilidade', usuarioId, dataSelecionada],
    async () => {
      if (!usuarioId) return [];

      const params = { paciente: usuarioId };
      if (dataSelecionada) params.data_avaliacao = dataSelecionada;

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/estabilidade/`, { params });

      return data.map(item => {
        const esquerdo = Number(item.lado_esquerdo) || 0;
        const direito = Number(item.lado_direito) || 0;
        const assimetria = (esquerdo && direito)
          ? Math.abs(esquerdo - direito) / Math.max(esquerdo, direito) * 100
          : 0;

        return {
          movimento_estabilidade: item.movimento_estabilidade_nome || item.movimento_estabilidade,
          Esquerdo: esquerdo,
          Direito: direito,
          Data: item.data_avaliacao,
          Assimetria: Number(assimetria.toFixed(1)),
          Observacao: item.observacao || ''
        };
      });
    },
    {
      enabled: !!usuarioId,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <p>Carregando estabilidade...</p>;
  if (isError) return <p>Erro ao carregar estabilidade.</p>;
  if (!dados.length) return <p>Nenhum dado encontrado.</p>;

  // 🔹 Agrupar os dados por movimento_estabilidade_nome
  const dadosAgrupados = dados.reduce((acc, item) => {
    const key = item.movimento_estabilidade;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const dataAvaliacao = payload[0].payload.Data;

    return (
      <div style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
        <p><strong>{label}</strong></p>
        {payload.map((item) => (
          <p key={item.name} style={{ color: item.color }}>
            {item.name}: {item.value} {item.name === 'Assimetria' ? '%' : ''}
          </p>
        ))}
        {payload[0].payload.Observacao && (
          <p style={{ whiteSpace: 'pre-wrap' }}>
            <em>Observação: {payload[0].payload.Observacao}</em>
          </p>
        )}
        <p style={{ fontSize: '0.85rem', marginTop: 6, color: '#666' }}>
          Data da Avaliação: {dataAvaliacao}
        </p>
      </div>
    );
  };

  // 🔹 Legenda global manual
  const LegendaGlobal = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <div style={{ width: 15, height: 15, background: '#282829' }}></div>
        <span>Esquerdo</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <div style={{ width: 15, height: 15, background: '#b7de42' }}></div>
        <span>Direito</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <div style={{ width: 15, height: 3, background: '#ff7300' }}></div>
        <span>Assimetria</span>
      </div>
    </div>
  );

  return (
    <>
      <LegendaGlobal />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {Object.entries(dadosAgrupados).map(([movimento, valores]) => (
          <div
            key={movimento}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{movimento}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={valores} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Data" />
                <YAxis yAxisId="left" label={{ value: 'Valor', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                {/* Legend removido dos gráficos */}
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
          </div>
        ))}
      </div>
    </>
  );
}

export default GraficoEstabilidade;
