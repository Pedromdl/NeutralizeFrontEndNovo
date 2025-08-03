import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Card from '../../components/Card'; // Caminho conforme sua estrutura
import '../../components/css/DadosUsuario.css'; // Reaproveita o CSS

function GraficoProgresso({ usuarioId }) {
  const [movimentos, setMovimentos] = useState([]);
  const [movimentoSelecionadoId, setMovimentoSelecionadoId] = useState(null);
  const [dados, setDados] = useState([]);
  const [carregandoMovimentos, setCarregandoMovimentos] = useState(true);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!usuarioId) return;
    setCarregandoMovimentos(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/forca/`, { params: { paciente: usuarioId } })
  .then(res => {
    const movimentosUnicos = Array.from(
      new Map(
        res.data.map(item => [item.movimento_forca, {
          id: item.movimento_forca,
          nome: item.movimento_forca_nome
        }])
      ).values()
    );
    setMovimentos(movimentosUnicos);
    if (movimentosUnicos.length > 0) setMovimentoSelecionadoId(movimentosUnicos[0].id);
    setCarregandoMovimentos(false);
  })
      .catch(() => {
        setErro('Erro ao carregar movimentos.');
        setCarregandoMovimentos(false);
      });
  }, [usuarioId]);

  useEffect(() => {
  if (!usuarioId || !movimentoSelecionadoId) return;
  setCarregandoDados(true);
  setErro(null);

  axios.get(`${import.meta.env.VITE_API_URL}/api/forca/`, {
    params: {
      paciente: usuarioId,
      movimento_forca: movimentoSelecionadoId, // Corrigido: enviar o ID correto
      ordering: 'data_avaliacao', // Ordem cronológica do mais velho para o mais novo
    }
  })
    .then(res => {
      const dadosFormatados = res.data.map(item => {
        const esquerdo = Number(item.lado_esquerdo);
        const direito = Number(item.lado_direito);
        const assimetria = Math.abs(direito - esquerdo) / Math.max(direito, esquerdo) * 100;

        return {
          movimento_forca: item.movimento_forca_nome,
          data_avaliacao: item.data_avaliacao,
          Esquerdo: esquerdo,
          Direito: direito,
          Assimetria: Number(assimetria.toFixed(1)), // arredonda para 1 casa decimal
        };
      });

      // Garante que os dados estejam em ordem crescente de data, mesmo se o backend falhar nisso
      const dadosOrdenados = dadosFormatados.sort(
        (a, b) => new Date(a.data_avaliacao) - new Date(b.data_avaliacao)
      );

      setDados(dadosOrdenados);
      setCarregandoDados(false);
    })
    .catch(() => {
      setErro('Erro ao carregar dados de progresso.');
      setCarregandoDados(false);
    });
}, [usuarioId, movimentoSelecionadoId]);

  if (carregandoMovimentos) return null;
  if (movimentos.length === 0) return null;

  return (
    <Card title="Progresso da Força Muscular" size="al">
      {erro && <p>{erro}</p>}

      <div className="campo" style={{ marginBottom: '1rem' }}>
        <label htmlFor="movimento-select">Selecione o movimento:</label>
        <select
          id="movimento-select"
          value={movimentoSelecionadoId || ''}
          onChange={(e) => setMovimentoSelecionadoId(Number(e.target.value))}
          style={{ marginLeft: 10, padding: 5 }}
        >
          {movimentos.map(mov => (
            <option key={mov.id} value={mov.id}>
              {mov.nome}
            </option>
          ))}
        </select>
      </div>

      {carregandoDados && <p>Carregando dados do movimento...</p>}

      {!carregandoDados && dados.length === 0 && (
        <p>Nenhum dado encontrado para este movimento.</p>
      )}

      {!carregandoDados && dados.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={dados}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="data_avaliacao"
              tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
            />
            <YAxis label={{ value: 'Força (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              labelFormatter={(label) => `Data: ${new Date(label).toLocaleDateString()}`}
            />
            <Legend />
            <Line type="monotone" dataKey="Esquerdo" stroke="#282829" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Direito" stroke="#B7DE42" />
            <Line type="monotone" dataKey="Assimetria" stroke="#FF7F50" strokeDasharray="5 5" name="Assimetria (%)" yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export default GraficoProgresso;
