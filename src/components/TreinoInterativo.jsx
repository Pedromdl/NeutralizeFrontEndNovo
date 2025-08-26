import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';

// 🔹 Modal RPE
function ModalRPE({ isOpen, onClose, onSelecionar }) {
  const [rpe, setRPE] = useState(0);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
        width: '350px', textAlign: 'center', position: 'relative'
      }}>
        <h3>Definir RPE</h3>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>X</button>

        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={rpe}
          onChange={(e) => setRPE(Number(e.target.value))}
          style={{
            width: '100%', height: '25px', borderRadius: '12px', appearance: 'none',
            background: 'linear-gradient(to right, #16a34a, #f59e0b, #dc2626)', outline: 'none'
          }}
        />
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>RPE: {rpe}</div>

        <button
          onClick={() => { onSelecionar(rpe); onClose(); }}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Confirmar RPE
        </button>
      </div>
    </div>
  );
}

export default function TreinoInterativo() {
  const { secaoId } = useParams();
  const navigate = useNavigate();

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

  // 🔹 Carregar orientações da seção
  useEffect(() => {
    if (!secaoId) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinos/?secao=${secaoId}`)
      .then(res => {
        const pasta = res.data[0];
        const dados = pasta?.exercicios || [];

        const orientacoesFormatadas = dados.map(ex => ({
          id: ex.id,
          titulo: ex.orientacao_detalhes?.titulo || '',
          descricao: ex.orientacao_detalhes?.descricao || '',
          videoUrl: ex.orientacao_detalhes?.video_url || '',
          series: ex.series_planejadas,
          repeticoesPlanejada: ex.repeticoes_planejadas,
          cargaPlanejada: ex.carga_planejada,
          pastaId: pasta.id
        }));

        setOrientacoes(orientacoesFormatadas);
        setTemposExercicio(orientacoesFormatadas.map(() => 0));
        setRealizados(orientacoesFormatadas.map(() => false));
        setResultados(orientacoesFormatadas.map(ex => ({
          id: ex.id,
          series: Array.from({ length: ex.series }, () => ({
            repeticoes: ex.repeticoesPlanejada,
            carga: ex.cargaPlanejada
          })),
          rpe: null
        })));
      })
      .catch(err => console.error('Erro ao carregar orientações:', err));
  }, [secaoId]);

  // 🔹 Cronômetro
  useEffect(() => {
    let intervalo;
    if (timerAtivo) intervalo = setInterval(() => setTempo(prev => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [timerAtivo]);

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
  };

  const handleInputChange = (exercicioIndex, serieIndex, campo, valor) => {
    setResultados(prev => {
      const novo = [...prev];
      novo[exercicioIndex].series[serieIndex][campo] = valor;
      return novo;
    });
  };

  const aplicarAutoFill = () => {
    setResultados(prev => {
      const novo = [...prev];
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
      novo[indiceAtual].rpe = valor;
      return novo;
    });
  };

  const proximoExercicio = () => {
    const tempoGasto = tempo - inicioExercicio;
    setRealizados(prev => { const novo = [...prev]; novo[indiceAtual] = true; return novo; });
    setTemposExercicio(prev => { const novo = [...prev]; novo[indiceAtual] = tempoGasto; return novo; });

    const proximoNaoRealizado = realizados.findIndex((feito, i) => !feito && i !== indiceAtual);
    if (proximoNaoRealizado !== -1) {
      setIndiceAtual(proximoNaoRealizado);
      setInicioExercicio(tempo);
    } else {
      setFinalizado(true);
      setTimerAtivo(false);
    }
  };

  // 🔹 Iniciar treino
  const iniciarTreino = () => {
  if (!orientacoes.length) return;
  const pastaId = orientacoes[0].pastaId;

  const usuario = JSON.parse(localStorage.getItem('usuarioSelecionado')); // pegar o paciente

  const payload = {
    treino: pastaId,
    paciente: usuario?.id
  };

  console.log("Payload enviado:", payload);  // aqui você verá exatamente o JSON
  console.log("URL:", `${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/`);

  axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/`, payload)
    .then(resExec => {
      setTreinoExecutadoId(resExec.data.id);
      setTreinoIniciado(true);
      setInicioExercicio(tempo);
      setTimerAtivo(true);
    })
    .catch(err => {
      console.error('Erro ao iniciar execução:', err.response?.data || err);
    });
};

  // 🔹 Finalizar treino
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
      .then(() => alert('Treino salvo com sucesso!'))
      .catch(err => {
        console.error('Erro ao salvar treino:', err);
        alert('Erro ao salvar treino.');
      });
  };

  if (!orientacoes.length) return <p>Carregando exercícios...</p>;

  if (finalizado) {
    return (
      <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        <h2>✅ Treino Finalizado</h2>
        <p>⏱ Tempo total: {formatarTempo(tempo)}</p>

        {resultados.map((res, i) => (
          <div key={res.id} style={{ marginBottom: '1rem' }}>
            <h4>{orientacoes[i].titulo}</h4>
            {res.series.map((s, idx) => (
              <p key={idx}>Série {idx + 1}: {s.repeticoes || '-'} reps | {s.carga || '-'} kg</p>
            ))}
            <p>RPE: {res.rpe !== null ? res.rpe : '-'}</p>
            <p>Tempo: {formatarTempo(temposExercicio[i])}</p>
          </div>
        ))}

        <div style={{ marginTop: '1rem' }}>
          <button onClick={finalizarTreino} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}>💾 Salvar Treino</button>
          <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Voltar</button>
        </div>
      </div>
    );
  }

  const exercicioAtual = orientacoes[indiceAtual];
  const porcentagem = Math.round((realizados.filter(Boolean).length / orientacoes.length) * 100);

  return (
    <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Tempo decorrido */}
      <p style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>Tempo decorrido: {formatarTempo(tempo)}</p>

      {/* Barra de progresso */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          {orientacoes.map((ex, index) => (
            <div key={ex.id} onClick={() => setIndiceAtual(index)}
              style={{ flex: 1, height: '8px', margin: '0 5px', borderRadius: '4px', cursor: 'pointer', backgroundColor: index === indiceAtual ? '#2563eb' : realizados[index] ? '#4ade80' : '#cbd5e1' }}
              title={ex.titulo}
            />
          ))}
        </div>
        <p style={{ fontSize: '14px', textAlign: 'right', color: '#475569' }}>{porcentagem}% concluído</p>
      </div>

      {/* Exercício atual */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>{exercicioAtual.titulo}</h3>
        {exercicioAtual.videoUrl && (
          <button onClick={() => window.open(exercicioAtual.videoUrl, '_blank')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'white' }}>
            <Play size={20} />
          </button>
        )}
      </div>
      <p>{exercicioAtual.descricao}</p>

      {/* Séries (apenas se treino iniciado) */}
      {treinoIniciado ? (
        <>
          <div style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            <h4>Preencher automaticamente todas as séries:</h4>
            <input type="number" placeholder="Reps" value={autoFill.repeticoes} onChange={(e) => setAutoFill({ ...autoFill, repeticoes: e.target.value })} style={{ width: '70px', padding: '5px', marginRight: '10px' }} />
            <input type="number" placeholder="Kg" value={autoFill.carga} onChange={(e) => setAutoFill({ ...autoFill, carga: e.target.value })} style={{ width: '70px', padding: '5px', marginRight: '10px' }} />
            <button onClick={aplicarAutoFill} style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Aplicar</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
            {resultados[indiceAtual].series.map((serie, sIndex) => (
              <div key={sIndex} style={{ display: 'flex', gap: '10px', marginBottom: '0.5rem' }}>
                <span>Série {sIndex + 1}:</span>
                <input type="number" placeholder="Reps" value={serie.repeticoes} onChange={(e) => handleInputChange(indiceAtual, sIndex, 'repeticoes', e.target.value)} style={{ width: '70px', padding: '5px' }} />
                <input type="number" placeholder="Kg" value={serie.carga} onChange={(e) => handleInputChange(indiceAtual, sIndex, 'carga', e.target.value)} style={{ width: '70px', padding: '5px' }} />
              </div>
            ))}
            <button onClick={() => setModalRPEOpen(true)} style={{ marginTop: '10px', padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {resultados[indiceAtual].rpe !== null ? `RPE: ${resultados[indiceAtual].rpe}` : 'Definir RPE'}
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={proximoExercicio} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Próximo Exercício</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={iniciarTreino} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>▶️ Iniciar Treino</button>
        </div>
      )}

      <ModalRPE isOpen={modalRPEOpen} onClose={() => setModalRPEOpen(false)} onSelecionar={definirRPE} />
    </div>
  );
}
