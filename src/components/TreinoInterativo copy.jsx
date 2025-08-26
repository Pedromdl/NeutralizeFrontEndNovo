import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

// 🔹 Modal RPE
function ModalRPE({ isOpen, onClose, onSelecionar }) {
  const [rpe, setRPE] = useState(0);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setRPE(Number(e.target.value));
  };

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
          onChange={handleChange}
          style={{
            width: '100%',
            height: '25px',
            borderRadius: '12px',
            appearance: 'none',
            background: 'linear-gradient(to right, #16a34a, #f59e0b, #dc2626)',
            outline: 'none',
          }}
        />
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>RPE: {rpe}</div>

        <button
          onClick={() => { onSelecionar(rpe); onClose(); }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Confirmar RPE
        </button>
      </div>
    </div>
  );
}

export default function SecaoInterativaTeste() {
  const navigate = useNavigate();

const orientacoesMock = [
  { 
    id: 1,
    titulo: 'Agachamento Livre',
    series: 3,
    repeticoesPlanejada: 12,
    cargaPlanejada: 20,
    descricao: 'Agache mantendo a coluna reta e o abdômen contraído.',
    videoUrl: 'https://www.youtube.com/watch?v=1xMaFs0L3ao'
  },
  { 
    id: 2,
    titulo: 'Flexão de Braço',
    series: 3,
    repeticoesPlanejada: 15,
    cargaPlanejada: 0, // peso corporal
    descricao: 'Mantenha o corpo alinhado e os cotovelos próximos ao tronco.',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  { 
    id: 3,
    titulo: 'Prancha Isométrica',
    series: 3,
    repeticoesPlanejada: 1,  // segurar 1 série (tempo pode ser controlado no timer)
    cargaPlanejada: 0,
    descricao: 'Ative o core e mantenha quadris alinhados com ombros.',
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
  }
];



  const [indiceAtual, setIndiceAtual] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

const [resultados, setResultados] = useState(
  orientacoesMock.map((ex) => ({
    id: ex.id,
    series: Array.from({ length: ex.series }, () => ({
      repeticoes: ex.repeticoesPadrao,
      carga: ex.cargaPadrao
    })),
    rpe: null
  }))
);

  const [autoFill, setAutoFill] = useState({ repeticoes: '', carga: '' });
  const [modalRPEOpen, setModalRPEOpen] = useState(false);

  // 🔹 Cronômetro
  const [tempo, setTempo] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(true);

  // 🔹 Guarda o tempo de início do exercício atual
  const [inicioExercicio, setInicioExercicio] = useState(0);

  // 🔹 Guarda o tempo gasto por exercício
  const [temposExercicio, setTemposExercicio] = useState(
    orientacoesMock.map(() => 0)
  );

  // 🔹 Estado para marcar exercícios realizados
  const [realizados, setRealizados] = useState(
    orientacoesMock.map(() => false)
  );

  useEffect(() => {
    let intervalo;
    if (timerAtivo) {
      intervalo = setInterval(() => setTempo(prev => prev + 1), 1000);
    }
    return () => clearInterval(intervalo);
  }, [timerAtivo]);

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
  };

  const handleInputChange = (exercicioIndex, serieIndex, campo, valor) => {
    setResultados((prev) => {
      const novo = [...prev];
      novo[exercicioIndex].series[serieIndex][campo] = valor;
      return novo;
    });
  };

  const aplicarAutoFill = () => {
    setResultados((prev) => {
      const novo = [...prev];
      novo[indiceAtual].series = novo[indiceAtual].series.map(() => ({
        repeticoes: autoFill.repeticoes,
        carga: autoFill.carga
      }));
      return novo;
    });
  };

  const definirRPE = (valor) => {
    setResultados((prev) => {
      const novo = [...prev];
      novo[indiceAtual].rpe = valor;
      return novo;
    });
  };

  // 🔹 Avança para o próximo exercício não realizado
  const proximoExercicio = () => {
    const tempoGasto = tempo - inicioExercicio;

    // Marca como realizado e salva o tempo gasto
    setRealizados(prev => {
      const novo = [...prev];
      novo[indiceAtual] = true;
      return novo;
    });

    setTemposExercicio(prev => {
      const novo = [...prev];
      novo[indiceAtual] = tempoGasto;
      return novo;
    });

    // Próximo exercício não realizado
    const proximoNaoRealizado = realizados.findIndex((feito, i) => !feito && i !== indiceAtual);

    if (proximoNaoRealizado !== -1) {
      setIndiceAtual(proximoNaoRealizado);
      setInicioExercicio(tempo);
    } else {
      setFinalizado(true);
      setTimerAtivo(false);
      console.log('Resultados finais:', resultados);
    }
  };

  if (finalizado) {
    return (
      <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        <h2>✅ Treino Finalizado</h2>
        <p>Parabéns! Você concluiu todos os exercícios.</p>
        <p>⏱ Tempo total: {formatarTempo(tempo)}</p>

        <h3>📊 Seu desempenho:</h3>
        {resultados.map((res, i) => (
          <div key={res.id} style={{ marginBottom: '1rem' }}>
            <h4>{orientacoesMock[i].titulo}</h4>
            {res.series.map((s, idx) => (
              <p key={idx}>
                Série {idx + 1}: {s.repeticoes || '-'} reps | {s.carga || '-'} kg
              </p>
            ))}
            <p>RPE: {res.rpe !== null ? res.rpe : '-'}</p>
            <p>Tempo: {formatarTempo(temposExercicio[i])}</p>
          </div>
        ))}

        <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>← Voltar</button>
      </div>
    );
  }

  const exercicioAtual = orientacoesMock[indiceAtual];
  const porcentagem = Math.round((realizados.filter(Boolean).length / orientacoesMock.length) * 100);

  return (
    <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <p style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
        Tempo decorrido: {formatarTempo(tempo)}
      </p>

      {/* Barra de progresso */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          {orientacoesMock.map((ex, index) => (
            <div
              key={ex.id}
              onClick={() => setIndiceAtual(index)} // apenas visualiza
              style={{
                flex: 1,
                height: '8px',
                margin: '0 5px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: index === indiceAtual ? '#2563eb' : realizados[index] ? '#4ade80' : '#cbd5e1'
              }}
              title={ex.titulo}
            />
          ))}
        </div>
        <p style={{ fontSize: '14px', textAlign: 'right', color: '#475569' }}>{porcentagem}% concluído</p>
      </div>

      {/* Título + vídeo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>{exercicioAtual.titulo}</h3>
        <button onClick={() => window.open(exercicioAtual.videoUrl, '_blank')} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#2563eb', border: 'none', borderRadius: '50%',
          width: '36px', height: '36px', cursor: 'pointer', color: 'white'
        }} title="Assistir vídeo">
          <Play size={20} />
        </button>
      </div>

      <p>{exercicioAtual.descricao}</p>

      {/* AutoFill */}
      <div style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
        <h4>Preencher automaticamente todas as séries:</h4>
        <input type="number" placeholder="Reps" value={autoFill.repeticoes} onChange={(e) => setAutoFill({ ...autoFill, repeticoes: e.target.value })} style={{ width: '70px', padding: '5px', marginRight: '10px' }} />
        <input type="number" placeholder="Kg" value={autoFill.carga} onChange={(e) => setAutoFill({ ...autoFill, carga: e.target.value })} style={{ width: '70px', padding: '5px', marginRight: '10px' }} />
        <button onClick={aplicarAutoFill} style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Aplicar</button>
      </div>

      {/* Séries */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '0.5rem', fontWeight: 'bold', width: 'fit-content' }}>
          <span style={{ width: '60px' }}>Série</span>
          <span style={{ width: '70px' }}>Repetições</span>
          <span style={{ width: '70px' }}>Carga (kg)</span>
        </div>

        {resultados[indiceAtual].series.map((serie, sIndex) => (
          <div key={sIndex} style={{ display: 'flex', gap: '10px', marginBottom: '0.5rem' }}>
            <span>Série {sIndex + 1}:</span>
            <input type="number" placeholder="Reps" value={serie.repeticoes} onChange={(e) => handleInputChange(indiceAtual, sIndex, 'repeticoes', e.target.value)} style={{ width: '70px', padding: '5px' }} />
            <input type="number" placeholder="Kg" value={serie.carga} onChange={(e) => handleInputChange(indiceAtual, sIndex, 'carga', e.target.value)} style={{ width: '70px', padding: '5px' }} />
          </div>
        ))}

        {/* Botão para abrir modal RPE */}
        <button onClick={() => setModalRPEOpen(true)} style={{ marginTop: '10px', padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {resultados[indiceAtual].rpe !== null ? `RPE: ${resultados[indiceAtual].rpe}` : 'Definir RPE'}
        </button>
      </div>

      {/* Navegação */}
      <button onClick={() => {
        if (indiceAtual > 0) {
          setIndiceAtual(indiceAtual - 1);
          setAutoFill({ repeticoes: '', carga: '' });
        } else {
          navigate(-1);
        }
      }}
        style={{
          marginTop: '1rem', marginRight: '1rem', padding: '10px 20px',
          backgroundColor: indiceAtual > 0 ? '#2563eb' : '#dc2626',
          color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>
        {indiceAtual > 0 ? '← Voltar' : 'Sair do Treino'}
      </button>

      <button onClick={proximoExercicio} style={{
        marginTop: '1rem', padding: '10px 20px',
        backgroundColor: '#2563eb', color: '#fff',
        border: 'none', borderRadius: '8px', cursor: 'pointer'
      }}>
        Próximo Exercício
      </button>

      {/* Modal RPE */}
      <ModalRPE
        isOpen={modalRPEOpen}
        onClose={() => setModalRPEOpen(false)}
        onSelecionar={definirRPE}
      />
    </div>
  );
}
