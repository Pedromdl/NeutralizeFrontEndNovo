import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';

function GraficoMobilidade({ usuarioId, dataSelecionada }) { // <-- recebe dataSelecionada
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      setCarregando(true);

      // Monta params para enviar na query string
      const params = { paciente: usuarioId };
      if (dataSelecionada) {
        params.data_avaliacao = dataSelecionada;
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/mobilidade/`, { params }) // <-- params no config
        .then(res => {
          const dadosTransformados = res.data.map(item => {
            const esquerdo = Number(item.lado_esquerdo);
            const direito = Number(item.lado_direito);
            const assimetria = Math.abs(esquerdo - direito) / Math.max(esquerdo, direito) * 100;

            return {
              Movimento: item.nome,
              Esquerdo: esquerdo,
              Direito: direito,
              Data: item.data_avaliacao,
              Assimetria: Number(assimetria.toFixed(1)) // em porcentagem
            };
          });

          setDados(dadosTransformados);
          setCarregando(false);
        })
        .catch(err => {
          console.error('Erro ao buscar mobilidade:', err);
          setCarregando(false);
        });
    }
  }, [usuarioId, dataSelecionada]); // Recarrega ao mudar a data

  if (carregando) return <p>Carregando dados de mobilidade...</p>;
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
      <BarChart
        data={dados}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Movimento" />
        <YAxis yAxisId="left" label={{ value: "Mobilidade (º)", angle: -90, position: "insideLeft" }} />
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

export default GraficoMobilidade;
