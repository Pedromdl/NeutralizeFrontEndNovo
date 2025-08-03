import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';

function GraficoEstabilidade({ usuarioId, dataSelecionada }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      setCarregando(true);

      const params = { paciente: usuarioId };
      if (dataSelecionada) {
        params.data_avaliacao = dataSelecionada;
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/estabilidade/`, { params }) 
        .then(res => {

          const dadosTransformados = res.data.map(item => {

            // Convertendo os lados para números (ajuste conforme seus dados)
            const esquerdo = Number(item.lado_esquerdo) || 0;
            const direito = Number(item.lado_direito) || 0;

            const assimetria = (esquerdo && direito)
              ? Math.abs(esquerdo - direito) / Math.max(esquerdo, direito) * 100
              : 0;

            return {
              movimento_estabilidade: item.movimento_estabilidade_nome || item.movimento_estabilidade, // depende do seu serializer
              Esquerdo: esquerdo,
              Direito: direito,
              Data: item.data_avaliacao,
              Assimetria: Number(assimetria.toFixed(1)),
              Resultado: item.resultado_unico || '',
              Observacao: item.observacao || ''   // <== adiciona aqui
            };
          });

          setDados(dadosTransformados);
          setCarregando(false);
        })
        .catch(err => {
          console.error('Erro ao buscar estabilidade:', err);
          setCarregando(false);
        });
    }
  }, [usuarioId, dataSelecionada]);

  if (carregando) return <p>Carregando estabilidade...</p>;
  if (!dados.length) return <p>Nenhum dado encontrado.</p>;

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
        {payload[0].payload.Resultado && (
          <p><em>Resultado: {payload[0].payload.Resultado}</em></p>
        )}
        {payload[0].payload.Observacao && (
          <p><em>Observação: {payload[0].payload.Observacao}</em></p>
        )}
        <p style={{ fontSize: '0.85rem', marginTop: 6, color: '#666' }}>
          Data da Avaliação: {dataAvaliacao}
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={dados}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="movimento_estabilidade" />
        <YAxis yAxisId="left" />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Assimetria (%)", angle: 90, position: "insideRight" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
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

export default GraficoEstabilidade;
