// components/ModalDetalhesTreino.jsx
import { X, User, Dumbbell, Calendar, Clock } from 'lucide-react';
import styles from './ModalDetalhesTreino.module.css';

export default function ModalDetalhesTreino({ treino, onClose }) {
  if (!treino) return null;

  const formatarTempo = (segundos) => {
    if (!segundos) return '-';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return horas > 0 ? `${horas}h ${minutos}m` : `${minutos}m`;
  };

  const formatarData = (dataString) =>
    new Date(dataString).toLocaleDateString('pt-BR');

  const formatarCarga = (carga) => Number(carga) || 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Detalhes do Treino</h2>
          <button className={styles.btnFechar} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Info principal */}
        <div className={styles.modalInfoGrid}>
          <div className={styles.infoCard}>
            <User size={18} />
            <div>
              <label>Paciente</label>
              <span>{treino.paciente_nome || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <Dumbbell size={18} />
            <div>
              <label>Treino</label>
              <span>{treino.treino_nome || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <Calendar size={18} />
            <div>
              <label>Data</label>
              <span>{formatarData(treino.data)}</span>
            </div>
          </div>

          {treino.finalizado && (
            <div className={styles.infoCard}>
              <Clock size={18} />
              <div>
                <label>Tempo</label>
                <span>{formatarTempo(treino.tempo_total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Exercícios */}
        {treino.exercicios?.length > 0 && (
          <div className={styles.exerciciosSection}>
            <h3>Exercícios Executados</h3>

            <div className={styles.exerciciosList}>
              {treino.exercicios.map((exercicio, index) => (
                <div
                  key={exercicio.id || index}
                  className={styles.exercicioCard}
                >
                  {/* Header do exercício */}
                  <div className={styles.exercicioHeader}>
                    <h4>{exercicio.exercicio_nome}</h4>

                    {exercicio.rpe && (
                      <span className={styles.rpeBadge}>
                        RPE {exercicio.rpe}
                      </span>
                    )}
                  </div>

                  {/* Card de Séries */}
                  {exercicio.seriess?.length > 0 && (
                    <div className={styles.seriesCard}>
                      <div className={styles.seriesHeader}>
                        Séries Realizadas
                      </div>

                      <div className={styles.seriesGrid}>
                        {exercicio.seriess.map((serie, i) => (
                          <div
                            key={i}
                            className={styles.serieItem}
                          >
                            <span className={styles.serieNumero}>
                              Série {serie.numero}
                            </span>
                            <span>{serie.repeticoes} reps</span>
                            <span>
                              {formatarCarga(serie.carga)} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
