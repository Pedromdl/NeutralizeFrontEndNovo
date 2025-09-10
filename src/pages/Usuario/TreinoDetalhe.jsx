import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

// 🔹 Modal para adicionar exercício
function ModalAdicionarExercicio({ isOpen, onClose, exerciciosDisponiveis, onSalvar }) {
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
  const [observacao, setObservacao] = useState(''); // ✅ aqui
  const [series, setSeries] = useState(1);
  const [repeticoes, setRepeticoes] = useState(10);
  const [carga, setCarga] = useState(0);

  if (!isOpen) return null;

  const handleSalvar = () => {
    if (!exercicioSelecionado) return;
    onSalvar({
      ...exercicioSelecionado,
      series_planejadas: series,
      repeticoes_planejadas: repeticoes,
      carga_planejada: carga,
      observacao: observacao
    });
    setExercicioSelecionado(null);
    setSeries(1);
    setRepeticoes(10);
    setCarga(0);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-conteudo">
        <h2>Adicionar Exercício</h2>

        <div className="modal-form">
          <label>
            Exercício
            <select
              value={exercicioSelecionado?.id || ''}
              onChange={(e) => {
                const ex = exerciciosDisponiveis.find(ex => ex.id === Number(e.target.value));
                setExercicioSelecionado(ex);
              }}
            >
              <option value="">Selecione um exercício</option>
              {exerciciosDisponiveis.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.titulo}</option>
              ))}
            </select>
          </label>

          <div className="modal-inputs">
            <label>
              Séries
              <input type="number" value={series} onChange={e => setSeries(Number(e.target.value))} />
            </label>
            <label>
              Repetições
              <input type="number" value={repeticoes} onChange={e => setRepeticoes(Number(e.target.value))} />
            </label>
            <label>
              Carga
              <input type="number" value={carga} onChange={e => setCarga(Number(e.target.value))} />
            </label>
            <label>
              Observação
              <input type="text" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="modal-botoes">
          <button className="btn-salvar" onClick={handleSalvar}>Salvar</button>
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}


export default function TreinoDetalhe() {
  const { id } = useParams(); // id da seção
  const navigate = useNavigate();

  const [secao, setSecao] = useState(null);
  const [treinosSecao, setTreinosSecao] = useState([]);
  const [treinoNome, setTreinoNome] = useState('');
  const [treinoCriado, setTreinoCriado] = useState(null);
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [treinoSelecionadoParaAdicionar, setTreinoSelecionadoParaAdicionar] = useState(null);

  // Carrega a seção
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/${id}/`)
      .then(res => setSecao(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Carrega os treinos da seção
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/?secao=${id}`)
      .then(res => {
        // adiciona campo local para controlar se o card está expandido e exercícios já adicionados
        const treinosComEstado = res.data.map(t => ({
          ...t,
          expandido: false,
          exerciciosDoTreino: t.exercicios || []
        }));
        setTreinosSecao(treinosComEstado);
      })
      .catch(err => console.error(err));
  }, [id]);

  // Carrega banco de exercícios disponíveis
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/bancoexercicios/`)
      .then(res => setExerciciosDisponiveis(res.data))
      .catch(err => console.error(err));
  }, []);

  // Criar treino
  const criarTreino = async () => {
    if (!treinoNome.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/`, {
        secao: id,
        nome: treinoNome
      });
      setTreinoCriado(response.data);
      setTreinosSecao([...treinosSecao, { ...response.data, expandido: false, exerciciosDoTreino: [] }]);
      setTreinoNome('');
    } catch (err) {
      console.error(err);
    }
  };

  // Abrir modal de adicionar exercício
  const abrirModal = (treino) => {
    setTreinoSelecionadoParaAdicionar(treino);
    setModalAberto(true);
  };

  // Salvar exercício no treino
  const salvarExercicioNoTreino = async (ex) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/exerciciosprescritos/`, {
        treino: treinoSelecionadoParaAdicionar.id,
        orientacao: ex.id,
        series_planejadas: ex.series_planejadas,
        repeticoes_planejadas: ex.repeticoes_planejadas,
        carga_planejada: ex.carga_planejada,
        observacao: ex.observacao  // ← novo campo
      });
      // atualiza localmente
      setTreinosSecao(treinosSecao.map(t => {
        if (t.id === treinoSelecionadoParaAdicionar.id) {
          return {
            ...t,
            exerciciosDoTreino: [...t.exerciciosDoTreino, response.data]
          };
        }
        return t;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!secao) return <p>Carregando seção...</p>;

  return (
    <div className="conteudo">
      {/* Card superior: criar treino */}
      <Card title={`${secao.titulo}`} size="al">
        <div className="user-search">
          <input
            className="input"
            type="text"
            value={treinoNome}
            onChange={(e) => setTreinoNome(e.target.value)}
          placeholder="Nome do treino"
        />
        </div>
        <button onClick={criarTreino}>Salvar Treino</button>
      </Card>

      {/* Lista de treinos existentes */}
      {treinosSecao.length > 0 && (
        <div style={{ width: '100%', marginTop: '1rem' }}>
          {treinosSecao.map(t => (
            <Card key={t.id} title={t.nome || 'Treino sem nome'} size="al">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setTreinosSecao(
                  treinosSecao.map(tr => tr.id === t.id ? { ...tr, expandido: !tr.expandido } : tr)
                )}>
                  {t.expandido ? '▼' : '►'}
                </button>
                <button onClick={() => navigate(`/treinos/${t.id}/editar`)}>Editar</button>
              </div>

              {t.expandido && (
                <div style={{ marginTop: '1rem' }}>
                  {/* Lista de exercícios do treino */}
                  {t.exerciciosDoTreino.length > 0 && (
                    <div className="tabela-exercicios-wrapper">
                     <table className="tabela-exercicios">
  <thead>
    <tr>
      <th>Exercício</th>
      <th>Séries</th>
      <th>Repetições</th>
      <th>Carga</th>
      <th>Observação</th>  {/* nova coluna */}
    </tr>
  </thead>
  <tbody>
    {t.exerciciosDoTreino.map(ex => (
      <tr key={ex.id}>
        <td>{ex.orientacao_detalhes.titulo}</td>
        <td>{ex.series_planejadas}</td>
        <td>{ex.repeticoes_planejadas}</td>
        <td>{ex.carga_planejada}</td>
        <td>{ex.observacao || '-'}</td> 
      </tr>
    ))}
  </tbody>
</table>
                    </div>
                  )}

                  <button onClick={() => abrirModal(t)}>Adicionar Exercício</button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <ModalAdicionarExercicio
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        exerciciosDisponiveis={exerciciosDisponiveis}
        onSalvar={salvarExercicioNoTreino}
      />
    </div>
  );
}
