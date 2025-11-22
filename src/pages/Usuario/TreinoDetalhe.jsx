import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import "../../components/css/TreinoDetalhe.css";
import { Edit, X, Check } from 'lucide-react'; // 🔹 ícones

// 🔹 Modal para adicionar/editar exercício
function ModalExercicio({ isOpen, onClose, exerciciosDisponiveis, onSalvar, exercicioAtual }) {
  const [exercicioSelecionado, setExercicioSelecionado] = useState(exercicioAtual?.orientacao_detalhes || null);
  const [observacao, setObservacao] = useState(exercicioAtual?.observacao || '');
  const [series, setSeries] = useState(exercicioAtual?.series_planejadas || 1);
  const [repeticoes, setRepeticoes] = useState(exercicioAtual?.repeticoes_planejadas || 10);
  const [carga, setCarga] = useState(exercicioAtual?.carga_planejada || 0);

  useEffect(() => {
    if (exercicioAtual) {
      setExercicioSelecionado(exercicioAtual.orientacao_detalhes);
      setObservacao(exercicioAtual.observacao);
      setSeries(exercicioAtual.series_planejadas);
      setRepeticoes(exercicioAtual.repeticoes_planejadas);
      setCarga(exercicioAtual.carga_planejada);
    } else {
      setExercicioSelecionado(null);
      setObservacao('');
      setSeries(1);
      setRepeticoes(10);
      setCarga(0);
    }
  }, [exercicioAtual]);

  if (!isOpen) return null;

  const handleSalvar = () => {
    if (!exercicioSelecionado) return;

    onSalvar({
      id: exercicioAtual?.id,
      orientacao: exercicioSelecionado.id,
      series_planejadas: series,
      repeticoes_planejadas: repeticoes,
      carga_planejada: carga,
      observacao,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-conteudo">
        <h2>{exercicioAtual ? 'Editar Exercício' : 'Adicionar Exercício'}</h2>
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
              <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)} />
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [secao, setSecao] = useState(null);
  const [treinosSecao, setTreinosSecao] = useState([]);
  const [treinoNome, setTreinoNome] = useState('');
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [treinoSelecionadoParaAdicionar, setTreinoSelecionadoParaAdicionar] = useState(null);
  const [exercicioSelecionadoParaEditar, setExercicioSelecionadoParaEditar] = useState(null);

  // 🔹 Carrega treinos da seção
  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        const resTreinos = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/treinos/?secao=${id}`
        );
        const tituloSecao = resTreinos.data[0]?.secao_titulo || 'Seção';

        const treinosComExpandido = resTreinos.data.map(t => ({
          ...t,
          expandido: false,
          exerciciosDoTreino: t.exercicios || []
        }));

        setSecao({ id, titulo: tituloSecao });
        setTreinosSecao(treinosComExpandido);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTreinos();
  }, [id]);

  // 🔹 Carrega exercícios disponíveis
  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bancoexercicios/`);
        setExerciciosDisponiveis(res.data);
      } catch (err) {
        console.error('Erro ao buscar exercícios:', err);
      }
    };
    fetchExercicios();
  }, []);

  // 🔹 Criar treino
  const criarTreino = async () => {
    if (!treinoNome.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/treinos/`, {
        secao: id,
        nome: treinoNome
      });
      setTreinosSecao([...treinosSecao, { ...response.data, expandido: false, exerciciosDoTreino: [] }]);
      setTreinoNome('');
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Abrir modal adicionar
  const abrirModalAdicionar = (treino) => {
    setTreinoSelecionadoParaAdicionar(treino);
    setExercicioSelecionadoParaEditar(null);
    setModalAberto(true);
  };

  // 🔹 Abrir modal editar
  const abrirModalEditar = (exercicio, treino) => {
    setTreinoSelecionadoParaAdicionar(treino);
    setExercicioSelecionadoParaEditar(exercicio);
    setModalAberto(true);
  };

  // 🔹 Salvar exercício
  const salvarExercicio = async (ex) => {
    try {
      if (ex.id) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/exerciciosprescritos/${ex.id}/`,
          {
            treino: treinoSelecionadoParaAdicionar.id,
            orientacao: ex.orientacao,
            series_planejadas: ex.series_planejadas,
            repeticoes_planejadas: ex.repeticoes_planejadas,
            carga_planejada: ex.carga_planejada,
            observacao: ex.observacao,
          }
        );

        setTreinosSecao(treinosSecao.map(t => {
          if (t.id === treinoSelecionadoParaAdicionar.id) {
            return {
              ...t,
              exerciciosDoTreino: t.exerciciosDoTreino.map(e =>
                e.id === ex.id ? res.data : e
              ),
            };
          }
          return t;
        }));
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/exerciciosprescritos/`,
          { treino: treinoSelecionadoParaAdicionar.id, ...ex }
        );

        setTreinosSecao(treinosSecao.map(t => {
          if (t.id === treinoSelecionadoParaAdicionar.id) {
            return {
              ...t,
              exerciciosDoTreino: [...t.exerciciosDoTreino, res.data],
            };
          }
          return t;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Excluir exercício
  const excluirExercicio = async (exercicioId, treinoId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/exerciciosprescritos/${exercicioId}/`);
      setTreinosSecao(treinosSecao.map(t => {
        if (t.id === treinoId) {
          return {
            ...t,
            exerciciosDoTreino: t.exerciciosDoTreino.filter(e => e.id !== exercicioId),
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
      <Card title={secao.titulo} size="al">
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

      {treinosSecao.map(t => (
  <Card 
    key={t.id} 
    title={
      <div className="treino-titulo-container">
        {t.editandoNome ? (
          <input
            type="text"
            value={t.nome}
            autoFocus
            className="treino-titulo-input"
            onChange={e => setTreinosSecao(
              treinosSecao.map(tr => tr.id === t.id ? { ...tr, nome: e.target.value } : tr)
            )}
            onBlur={async () => {
              try {
                const res = await axios.patch(
                  `${import.meta.env.VITE_API_URL}/api/treinos/${t.id}/`,
                  { nome: t.nome }
                );
                setTreinosSecao(treinosSecao.map(tr => tr.id === t.id ? { ...tr, nome: res.data.nome, editandoNome: false } : tr));
              } catch (err) {
                console.error(err);
              }
            }}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
          />
        ) : (
          <>
            <span className="treino-titulo-texto">{t.nome || 'Treino sem nome'}</span>
            <Edit 
              size={18} 
              className="treino-titulo-icone"
              onClick={() => setTreinosSecao(
                treinosSecao.map(tr => tr.id === t.id ? { ...tr, editandoNome: true } : tr)
              )}
            />
          </>
        )}
      </div>
    } 
    size="al"
  >
    {/* =================== AQUI MANTÉM O CONTEÚDO ORIGINAL =================== */}
    <div className="treino-header-botoes">
      <button onClick={() =>
        setTreinosSecao(
          treinosSecao.map(tr => tr.id === t.id ? { ...tr, expandido: !tr.expandido } : tr)
        )
      }>
        {t.expandido ? '▼' : '►'}
      </button>
      <button onClick={() => navigate(`/treinos/${t.id}/editar`)}>Editar</button>
    </div>

    {t.expandido && (
      <div>
        {t.exerciciosDoTreino.length > 0 ? (
          <div className="tabela-exercicios-wrapper">
            <table className="tabela-exercicios">
              <thead>
                <tr>
                  <th>Exercício</th>
                  <th>Séries</th>
                  <th>Repetições</th>
                  <th>Carga</th>
                  <th>Observação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {t.exerciciosDoTreino.map(ex => (
                  <tr key={ex.id}>
                    <td>{ex.orientacao_detalhes?.titulo}</td>
                    <td>{ex.series_planejadas}</td>
                    <td>{ex.repeticoes_planejadas}</td>
                    <td>{ex.carga_planejada}</td>
                    <td>{ex.observacao || '-'}</td>
                    <td>
                      <button 
                        onClick={() => abrirModalEditar(ex, t)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => excluirExercicio(ex.id, t.id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhum exercício adicionado ainda.</p>
        )}

        <button 
          className="btn-adicionar-exercicio"
          onClick={() => abrirModalAdicionar(t)}
        >
          Adicionar Exercício
        </button>
      </div>
    )}
    {/* ======================================================================= */}
  </Card>
))}

      <ModalExercicio
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        exerciciosDisponiveis={exerciciosDisponiveis}
        onSalvar={salvarExercicio}
        exercicioAtual={exercicioSelecionadoParaEditar}
      />
    </div>
  );
}
