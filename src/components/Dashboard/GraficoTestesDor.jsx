import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function GraficoTesteDor({ usuarioId, dataSelecionada }) { // recebe a dataSelecionada
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      setCarregando(true);

      const params = { paciente: usuarioId };
      if (dataSelecionada) {
        params.data_avaliacao = dataSelecionada; // inclui filtro de data
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/testedor/`, { params })
        .then(res => {
          const dadosTransformados = res.data.map(item => ({
            id: item.id,
            Teste: item.teste_nome,
            Resultado: Number(item.resultado),
            Data: item.data_avaliacao,
            Observacao: item.observacao || 'Nenhuma',
          }));

          setDados(dadosTransformados);
          setCarregando(false);
        })
        .catch(err => {
          console.error('Erro ao buscar testes de dor:', err);
          setCarregando(false);
        });
    }
  }, [usuarioId, dataSelecionada]); // reexecuta se mudar usuário ou data

  if (carregando) return <p>Carregando dados de dor...</p>;
  if (!dados.length) return <p>Nenhum dado encontrado.</p>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;

    return (
      <div style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
        <p><strong>{data.Teste}</strong></p>
        <p>Resultado: {data.Resultado}</p>
        <p>Observação: {data.Observacao || 'Nenhuma'}</p>
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
