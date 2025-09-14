import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import './TreinoInterativo.css';

// 🔹 ModalRPE
function ModalRPE({ isOpen, onClose, onSelecionar }) {
  const [rpe, setRPE] = useState(0);
  if (!isOpen) return null;

  return (
    <div className="modal-rpe-overlay">
      <div className="modal-rpe-content">
        <button className="fechar" onClick={onClose}>×</button>
        <h3>Definir RPE</h3>
        <input type="range" min={0} max={10} step={1} value={rpe} onChange={(e) => setRPE(Number(e.target.value))} />
        <div className="valor-rpe">RPE: {rpe}</div>
        <button className="btn-confirmar" onClick={() => { onSelecionar(rpe); onClose(); }}>Confirmar</button>
      </div>
    </div>
  );
}

export default function TreinoInterativoPacientes() {
  const { treinoId } = useParams();
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

  const localStorageKey = `treino-${treinoId}-${user?.id}`;

  // 🔹 Cronômetro
  useEffect(() => {
    let intervalo;
    if (timerAtivo) intervalo = setInterval(() => setTempo(prev => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [timerAtivo]);

  // 🔹 Carregar treino + reidratar
  useEffect(() => {
    if (!treinoId || loading || !user) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/${treinoId}/`)
      .then(res => {
        const dados = res.data.exercicios || [];

        const orientacoesFormatadas = dados.map(ex => ({
          id: ex.id,
          titulo: ex.orientacao_detalhes.titulo,
          descricao: ex.orientacao_detalhes.descricao,
          videoUrl: ex.orientacao_detalhes.video_url,
          series: ex.series_planejadas,
          repeticoesPlanejada: ex.repeticoes_planejadas,
          cargaPlanejada: ex.carga_planejada,
          observacao: ex.observacao,
          treinoId
        }));

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
  }, [treinoId, loading, user]);

  useEffect(() => { if (treinoIniciado) setTimerAtivo(true); }, [treinoIniciado]);

  useEffect(() => {
    if (!user || !hidratado || !orientacoes.length || !resultados.length) return;
    const dados = { indiceAtual, resultados, realizados, temposExercicio, tempo, treinoIniciado, inicioExercicio, treinoExecutadoId };
    localStorage.setItem(localStorageKey, JSON.stringify(dados));
  }, [indiceAtual, resultados, realizados, temposExercicio, tempo, treinoIniciado, inicioExercicio, treinoExecutadoId, user, hidratado, orientacoes.length, localStorageKey]);

  function inicializarResultados(orientacoesFormatadas) {
    setOrientacoes(orientacoesFormatadas);
    setTemposExercicio(orientacoesFormatadas.map(() => 0));
    setRealizados(orientacoesFormatadas.map(() => false));
    setResultados(
      orientacoesFormatadas.map(ex => ({
        id: ex.id,
        series: Array.from({ length: ex.series }, () => ({ repeticoes: ex.repeticoesPlanejada, carga: ex.cargaPlanejada })),
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

  const formatarTempo = segundos => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (exIndex, sIndex, campo, valor) => {
    setResultados(prev => {
      const novo = [...prev];
      if (!novo[exIndex]) return prev;
      novo[exIndex].series[sIndex][campo] = valor;
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

  const definirRPE = valor => {
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
    const payload = { treino: treinoId };

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
        localStorage.removeItem(localStorageKey);
        setFinalizado(true);
      })
      .catch(err => { console.error('Erro ao salvar treino:', err); alert('Erro ao salvar treino.'); });
  };

  // ---------------- Render ----------------
  if (loading) return <Card title="Treino Interativo" size="al">Carregando...</Card>;
  if (erro) return <Card title="Treino Interativo" size="al">{erro}</Card>;
  if (!orientacoes.length) return <Card title="Treino Interativo" size="al">Nenhum exercício encontrado.</Card>;

  // 🔹 Tela finalizada
  if (finalizado) {
    return (
      <div className="treino-finalizado-container">
        <Card size="al">
          <h2>✅ Treino finalizado com sucesso!</h2>
          <p>Parabéns por completar seu treino!</p>
        </Card>
      </div>
    );
  }

  // 🔹 Tela carregando resultados
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
              <a
                href={exercicioAtual.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-video"
              >
                <img src="/blackplay.png" alt="Abrir vídeo" style={{ width: '26px', height: '26px' }} />
              </a>
            )}
          </div>

          {treinoIniciado ? (
            <>
              {exercicioAtual.observacao && (
                <div className="observacao-box">
                  <p style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#000' }}>
                    <strong>Observação:</strong> {exercicioAtual.observacao}
                  </p>
                </div>
              )}

              <div className="autofill-container">
                <p className="autofill-label" style={{ fontSize: '12px' }}>Preenchimento automático:</p>
                <div className="autofill-inputs">
                  <input type="number" placeholder="Reps" value={autoFill.repeticoes} onChange={(e) => setAutoFill({ ...autoFill, repeticoes: e.target.value })} />
                  <input type="number" placeholder="Kg" value={autoFill.carga} onChange={(e) => setAutoFill({ ...autoFill, carga: e.target.value })} />
                  <button onClick={aplicarAutoFill}>Aplicar</button>
                </div>
              </div>

              <div className="series-container">
                <div className="serie-header">
                  <span style={{ width: "60px", fontWeight: "bold" }}>Série</span>
                  <span style={{ width: "80px", fontWeight: "bold" }}>Reps</span>
                  <span style={{ width: "80px", fontWeight: "bold" }}>Carga</span>
                </div>

                {resAtual.series.map((serie, sIndex) => (
                  <div key={sIndex} className="serie-item">
                    <span style={{ width: "60px" }}>{sIndex + 1}</span>
                    <input
                      type="number"
                      placeholder="Reps"
                      value={serie.repeticoes}
                      onChange={(e) => handleInputChange(indiceAtual, sIndex, 'repeticoes', e.target.value)}
                      style={{ width: "70px" }}
                    />
                    <input
                      type="number"
                      placeholder="Kg"
                      value={serie.carga}
                      onChange={(e) => handleInputChange(indiceAtual, sIndex, 'carga', e.target.value)}
                      style={{ width: "70px" }}
                    />
                  </div>
                ))}

                <button className="btn-rpe" onClick={() => setModalRPEOpen(true)}>
                  {resAtual.rpe !== null ? `RPE: ${resAtual.rpe}` : 'Definir RPE'}
                </button>
              </div>

              <div>
                <button className="btn-principal btn-proximo" onClick={proximoExercicio}>Próximo Exercício</button>
                {realizados.every(Boolean) && <button className="btn-principal btn-finalizar" onClick={finalizarTreino}>Finalizar Treino</button>}
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
