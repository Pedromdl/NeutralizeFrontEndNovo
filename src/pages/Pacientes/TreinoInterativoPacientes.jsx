import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import { Play } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './TreinoInterativo.css';

// 🔹 ModalRPE
function ModalRPE({ isOpen, onClose, onSelecionar }) {
  const [rpe, setRPE] = useState(0);
  if (!isOpen) return null;

  return (
    <div className="modal-rpe-overlay">
      <div className="modal-rpe-content">
        <h3>Definir RPE</h3>
        <button className="fechar" onClick={onClose}>X</button>
        <input
          type="range"
          min={0} max={10} step={1}
          value={rpe}
          onChange={(e) => setRPE(Number(e.target.value))}
        />
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>RPE: {rpe}</div>
        <button className="btn-confirmar" onClick={() => { onSelecionar(rpe); onClose(); }}>
          Confirmar RPE
        </button>
      </div>
    </div>
  );
}

export default function TreinoInterativoPacientes() {
  const { secaoId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const [orientacoes, setOrientacoes] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [modalRPEOpen, setModalRPEOpen] = useState(false);
  const [autoFill, setAutoFill] = useState({ repeticoes: '', carga: '' });
  const [tempo, setTempo] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [inicioExercicio, setInicioExercicio] = useState(0);
  const [temposExercicio, setTemposExercicio] = useState([]);
  const [realizados, setRealizados] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [treinoExecutadoId, setTreinoExecutadoId] = useState(null);
  const [treinoIniciado, setTreinoIniciado] = useState(false);
  const [erro, setErro] = useState(null);
  const [hidratado, setHidratado] = useState(false);

  const localStorageKey = `treino-${secaoId}-${user?.id}`;

  // 🔹 Cronômetro
  useEffect(() => {
    let intervalo;
    if (timerAtivo) intervalo = setInterval(() => setTempo((prev) => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [timerAtivo]);

  // 🔹 Reidratar treino + carregar orientações
  useEffect(() => {
    if (!secaoId || loading || !user) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/?secao=${secaoId}&paciente=${user.id}`)
      .then(res => {
        const pasta = res.data[0];
        const dados = pasta?.exercicios || [];

        const orientacoesFormatadas = dados.map(ex => ({
          id: ex.id,
          titulo: ex.orientacao_detalhes.titulo,
          descricao: ex.orientacao_detalhes.descricao,
          videoUrl: ex.orientacao_detalhes.video_url,
          series: ex.series_planejadas,
          repeticoesPlanejada: ex.repeticoes_planejadas,
          cargaPlanejada: ex.carga_planejada,
          pastaId: pasta.id
        }));

        // Tentar reidratar
        const salvoRaw = localStorage.getItem(localStorageKey);
        if (salvoRaw) {
          try {
            const salvo = JSON.parse(salvoRaw);
            const byId = new Map((salvo.resultados || []).map(r => [r.id, r]));
            const resultadosHydrated = orientacoesFormatadas.map(ex => {
              const saved = byId.get(ex.id);
              const series = Array.from({ length: ex.series }, (_, i) => {
                const s = saved?.series?.[i];
                return {
                  repeticoes: s?.repeticoes ?? ex.repeticoesPlanejada ?? '',
                  carga: s?.carga ?? ex.cargaPlanejada ?? ''
                };
              });
              return { id: ex.id, rpe: saved?.rpe ?? null, series };
            });

            setOrientacoes(orientacoesFormatadas);
            setResultados(resultadosHydrated);
            setRealizados(Array.from({ length: orientacoesFormatadas.length }, (_, i) => !!salvo.realizados?.[i]));
            setTemposExercicio(Array.from({ length: orientacoesFormatadas.length }, (_, i) => salvo.temposExercicio?.[i] ?? 0));
            setIndiceAtual(Math.min(salvo.indiceAtual ?? 0, orientacoesFormatadas.length - 1));
            setTempo(salvo.tempo ?? 0);
            setTreinoIniciado(!!salvo.treinoIniciado);
            setInicioExercicio(salvo.inicioExercicio ?? 0);
            setTreinoExecutadoId(salvo.treinoExecutadoId ?? null);
          } catch {
            inicializarResultados(orientacoesFormatadas);
          }
        } else {
          inicializarResultados(orientacoesFormatadas);
        }

        setHidratado(true);
      })
      .catch(() => setErro('Erro ao carregar exercícios.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secaoId, loading, user]);

  // 🔹 Iniciar cronômetro se treino já iniciado
  useEffect(() => {
    if (treinoIniciado) setTimerAtivo(true);
  }, [treinoIniciado]);

  // 🔹 Persistir no localStorage
  useEffect(() => {
    if (!user || !hidratado || !orientacoes.length || !resultados.length) return;

    const dados = {
      indiceAtual,
      resultados,
      realizados,
      temposExercicio,
      tempo,
      treinoIniciado,
      inicioExercicio,
      treinoExecutadoId
    };
    localStorage.setItem(localStorageKey, JSON.stringify(dados));
  }, [
    indiceAtual, resultados, realizados, temposExercicio, tempo,
    treinoIniciado, inicioExercicio, treinoExecutadoId,
    user, hidratado, orientacoes.length, localStorageKey
  ]);

  function inicializarResultados(orientacoesFormatadas) {
    setOrientacoes(orientacoesFormatadas);
    setTemposExercicio(orientacoesFormatadas.map(() => 0));
    setRealizados(orientacoesFormatadas.map(() => false));
    setResultados(
      orientacoesFormatadas.map(ex => ({
        id: ex.id,
        series: Array.from({ length: ex.series }, () => ({
          repeticoes: ex.repeticoesPlanejada,
          carga: ex.cargaPlanejada
        })),
        rpe: null
      }))
    );
    setIndiceAtual(0);
    setTempo(0);
    setTreinoIniciado(false);
    setInicioExercicio(0);
    setTreinoExecutadoId(null);
    setFinalizado(false);
  }

  // ---------------- Auxiliares ----------------
  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
  };

  const handleInputChange = (exercicioIndex, serieIndex, campo, valor) => {
    setResultados(prev => {
      const novo = [...prev];
      if (!novo[exercicioIndex]) return prev;
      novo[exercicioIndex].series[serieIndex][campo] = valor;
      return novo;
    });
  };

  const aplicarAutoFill = () => {
    setResultados(prev => {
      const novo = [...prev];
      if (!novo[indiceAtual]) return prev;
      novo[indiceAtual].series = novo[indiceAtual].series.map(() => ({
        repeticoes: autoFill.repeticoes,
        carga: autoFill.carga
      }));
      return novo;
    });
  };

  const definirRPE = (valor) => {
    setResultados(prev => {
      const novo = [...prev];
      if (!novo[indiceAtual]) return prev;
      novo[indiceAtual].rpe = valor;
      return novo;
    });
  };

  const proximoExercicio = () => {
    const tempoGasto = tempo - inicioExercicio;

    setTemposExercicio(prev => {
      const novo = [...prev];
      novo[indiceAtual] = tempoGasto;
      return novo;
    });

    setRealizados(prev => {
      const novo = [...prev];
      novo[indiceAtual] = true;

      const proximoNaoRealizado = novo.findIndex((feito, i) => !feito && i !== indiceAtual);
      if (proximoNaoRealizado !== -1) setIndiceAtual(proximoNaoRealizado);
      else {
        setFinalizado(true);
        setTimerAtivo(false);
      }

      return novo;
    });

    setInicioExercicio(tempo);
  };

  const iniciarTreino = () => {
    if (!orientacoes.length) return;
    const pastaId = orientacoes[0].pastaId;
    const payload = { treino: pastaId };

    axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/`, payload)
      .then(resExec => {
        setTreinoExecutadoId(resExec.data.id);
        setTreinoIniciado(true);
        setInicioExercicio(tempo);
        setTimerAtivo(true);
      })
      .catch(err => console.error('Erro ao iniciar execução:', err.response?.data || err));
  };

  const finalizarTreino = () => {
    if (!treinoExecutadoId) return alert('Execução do treino não iniciada.');

    const payload = {
      tempo_total: tempo,
      series: resultados.map(exercicio => ({
        exercicio_id: exercicio.id,
        rpe: exercicio.rpe,
        series: exercicio.series.map((s, index) => ({
          numero: index + 1,
          repeticoes: s.repeticoes,
          carga: s.carga,
        }))
      }))
    };

    axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/${treinoExecutadoId}/finalizar/`, payload)
      .then(() => {
        alert('Treino salvo com sucesso!');
        localStorage.removeItem(localStorageKey);
      })
      .catch(err => { console.error('Erro ao salvar treino:', err); alert('Erro ao salvar treino.'); });
  };

  // ---------------- Render ----------------
  if (loading) return <Card title="Treino Interativo" size="al">Carregando...</Card>;
  if (erro) return <Card title="Treino Interativo" size="al">{erro}</Card>;
  if (!orientacoes.length) return <Card title="Treino Interativo" size="al">Nenhum exercício encontrado.</Card>;
  if (!hidratado || !resultados.length || !resultados[indiceAtual]) {
    return (
      <Card title="Treino Interativo" size="al">
        Carregando treino...
      </Card>
    );
  }

  const exercicioAtual = orientacoes[indiceAtual];
  const porcentagem = Math.round((realizados.filter(Boolean).length / orientacoes.length) * 100);
  const resAtual = resultados[indiceAtual];

  return (
    <div className="conteudo">
      <Card size="al">
        <div className="treino-container">
          <p style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
            Tempo decorrido: {formatarTempo(tempo)}
          </p>

          <div className="progress-bar-container">
            <div className="progress-bar">
              {orientacoes.map((ex, index) => (
                <div key={ex.id} onClick={() => setIndiceAtual(index)}
                  className={`progress-step ${index === indiceAtual ? 'atual' : realizados[index] ? 'concluido' : 'pendente'}`}
                  title={ex.titulo}
                />
              ))}
            </div>
            <p className="progress-porcentagem">{porcentagem}% concluído</p>
          </div>

          <div className="exercicio-titulo">
            <h3>{exercicioAtual.titulo}</h3>
            {exercicioAtual.videoUrl && (
              <button onClick={() => window.open(exercicioAtual.videoUrl, '_blank')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'white' }}>
                <Play size={20} />
              </button>
            )}
          </div>
          <p className="exercicio-descricao">{exercicioAtual.descricao}</p>

          {treinoIniciado ? (
            <>
              <div className="autofill-container">
                <p className="autofill-label">Preenchimento automático:</p>
                <div className="autofill-inputs">
                  <input type="number" placeholder="Reps" value={autoFill.repeticoes} onChange={(e) => setAutoFill({ ...autoFill, repeticoes: e.target.value })} />
                  <input type="number" placeholder="Kg" value={autoFill.carga} onChange={(e) => setAutoFill({ ...autoFill, carga: e.target.value })} />
                  <button onClick={aplicarAutoFill}>Aplicar</button>
                </div>
              </div>

              <div className="series-container">
                {resAtual.series.map((serie, sIndex) => (
                  <div key={sIndex} className="serie-item">
                    <span>Série {sIndex + 1}:</span>
                    <input type="number" placeholder="Reps" value={serie.repeticoes} onChange={(e) => handleInputChange(indiceAtual, sIndex, 'repeticoes', e.target.value)} />
                    <input type="number" placeholder="Kg" value={serie.carga} onChange={(e) => handleInputChange(indiceAtual, sIndex, 'carga', e.target.value)} />
                  </div>
                ))}
                <button className="btn-rpe" onClick={() => setModalRPEOpen(true)}>
                  {resAtual.rpe !== null ? `RPE: ${resAtual.rpe}` : 'Definir RPE'}
                </button>
              </div>

              <div>
                <button className="btn-principal btn-proximo" onClick={proximoExercicio}>Próximo Exercício</button>
                {finalizado && <button className="btn-principal btn-finalizar" onClick={finalizarTreino}>Finalizar Treino</button>}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="btn-principal btn-iniciar" onClick={iniciarTreino}>Iniciar Treino</button>
            </div>
          )}
        </div>

        <ModalRPE isOpen={modalRPEOpen} onClose={() => setModalRPEOpen(false)} onSelecionar={definirRPE} />
      </Card>
    </div>
  );
}
