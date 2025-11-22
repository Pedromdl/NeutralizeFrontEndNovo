// components/ModalDetalhesTreino.jsx
import { X, User, Dumbbell, Calendar, Clock, BarChart } from 'lucide-react';
import './ModalDetalhesTreino.css';

export default function ModalDetalhesTreino({ treino, onClose }) {
  if (!treino) return null;

  const formatarTempo = (segundos) => {
    if (!segundos) return '-';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return horas > 0 ? `${horas}h ${minutos}m` : `${minutos}m`;
  };

  const formatarData = (dataString) => {
    // 🔹 REMOVEMOS AS HORAS - apenas data
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>Detalhes do Treino</h2>
          <button className="btn-fechar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Informações Principais */}
        <div className="modal-info-grid">
          <div className="info-card">
            <User size={20} />
            <div>
              <label>Paciente</label>
              <span>{treino.paciente_nome || 'N/A'}</span>
            </div>
          </div>
          
          <div className="info-card">
            <Dumbbell size={20} />
            <div>
              <label>Treino</label>
              <span>{treino.treino_nome || 'N/A'}</span>
            </div>
          </div>
          
          <div className="info-card">
            <Calendar size={20} />
            <div>
              {/* 🔹 MUDAMOS O LABEL TAMBÉM */}
              <label>Data</label>
              <span>{formatarData(treino.data)}</span>
            </div>
          </div>
          
          {treino.finalizado && (
            <div className="info-card">
              <Clock size={20} />
              <div>
                <label>Tempo Total</label>
                <span>{formatarTempo(treino.tempo_total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Exercícios */}
        {treino.exercicios && treino.exercicios.length > 0 && (
          <div className="exercicios-section">
            <h3>Exercícios Realizados ({treino.exercicios.length})</h3>
            <div className="exercicios-list">
              {treino.exercicios.map((exercicio, index) => (
                <div key={exercicio.id || index} className="exercicio-card">
                  <div className="exercicio-header">
                    <h4>{exercicio.exercicio_nome || `Exercício ${index + 1}`}</h4>
                    {exercicio.rpe && (
                      <span className="rpe-badge">RPE: {exercicio.rpe}</span>
                    )}
                  </div>
                  
                  {/* Séries */}
                  {exercicio.seriess && exercicio.seriess.length > 0 && (
                    <div className="series-list">
                      <h5>Séries:</h5>
                      <div className="series-grid">
                        {exercicio.seriess.map((serie, serieIndex) => (
                          <div key={serieIndex} className="serie-item">
                            <span>Série {serie.numero}</span>
                            <span>{serie.repeticoes} reps</span>
                            <span>{serie.carga} kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estatísticas do Exercício */}
                  {exercicio.seriess && exercicio.seriess.length > 0 && (
                    <div className="exercicio-stats">
                      <span>Max reps: {Math.max(...exercicio.seriess.map(s => s.repeticoes))}</span>
                      <span>Max carga: {Math.max(...exercicio.seriess.map(s => parseFloat(s.carga)))} kg</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações do Modal */}
        <div className="modal-actions">
          <button className="btn-secundario" onClick={onClose}>
            Fechar
          </button>
          {treino.finalizado && treino.paciente_id && (
            <button className="btn-primario">
              <BarChart size={16} />
              Ver Evolução Completa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}