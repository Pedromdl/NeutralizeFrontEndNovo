import { Edit, Trash2, User, Calendar, Repeat, CheckCircle } from 'lucide-react';
import UserSearch from '../UserSearch';

export default function EventoModal({
  aberto,
  editando,
  setEditando,
  eventoSelecionado,
  form,
  setForm,
  onSave,
  onDelete,
  onClose,
}) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" style={{boxSizing: 'border-box'}} onClick={onClose}>
      <div className="google-calendar-modal" onClick={(e) => e.stopPropagation()}>

        {/* 🔹 VISUALIZAÇÃO */}
        {!editando ? (
          <>
            {/* Ações */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Edit
                className="icon"
                title="Editar"
                onClick={() => setEditando(true)}
                style={{ cursor: 'pointer', marginRight: 8 }}
              />
              <Trash2
                className="icon"
                title="Excluir"
                onClick={onDelete}
                style={{ cursor: 'pointer' }}
              />
            </div>

            {/* Conteúdo */}
            <h3>{form.paciente_nome || 'Paciente não definido'}</h3>

            <p>
              <strong>Data:</strong>{' '}
              {new Date(form.data).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>

            <p>
              <strong>Horário:</strong> {form.hora_inicio} – {form.hora_fim}
            </p>

            {form.tipo && (
              <p>
                <strong>Tipo:</strong> {form.tipo}
              </p>
            )}

            {form.repetir && (
              <p>
                <strong>Repetição:</strong> {form.frequencia}, {form.repeticoes}x
              </p>
            )}

            {form.responsavel && (
              <p>
                <strong>Responsável:</strong> {form.responsavel}
              </p>
            )}


            <p>
              <strong>Status:</strong> {form.status}
            </p>
          </>
        ) : (

          <>
            {/* 🔹 HEADER DO MODAL */}
            <div className="modal-header">
              <button className="modal-close-btn" onClick={onClose}>
                ✕
              </button>
            </div>
            
            <div className="form-row">
              <label>Paciente</label>
              <UserSearch
                modoModal
                valorInicial={form.paciente_nome}
                onSelect={(u) =>
                  setForm((prev) => ({
                    ...prev,
                    paciente: u.id,
                    paciente_nome: u.nome,
                  }))
                }
              />
            </div>

            <div className="form-row">
              <label>Tipo</label>
              <input
                type="text"
                value={form.tipo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tipo: e.target.value }))
                }
                className="form-input"
              />
            </div>

            <div className="form-row">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="form-input"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="realizado">Realizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-row">
              <label>Data</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, data: e.target.value }))
                }
                className="form-input"
              />
            </div>

            <div className="form-row">
              <label>Início</label>
              <input
                type="time"
                value={form.hora_inicio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hora_inicio: e.target.value }))
                }
                className="form-input"
              />
            </div>

            <div className="form-row">
              <label>Fim</label>
              <input
                type="time"
                value={form.hora_fim}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hora_fim: e.target.value }))
                }
                className="form-input"
              />
            </div>


            <div className="form-row" style={{ marginBottom: '0px' }}>
              <label>Responsável</label>
              <input
                type="text"
                value={form.responsavel}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, responsavel: e.target.value }))
                }
                className="form-input"
              />
            </div>

            <div className="form-row" style={{ marginBottom: '0px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={form.repetir}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, repetir: e.target.checked }))
                  }
                />{' '}
                Repetir evento
              </label>
            </div>

            {form.repetir && (
              <>
                <div className="form-row">
                  <label>Frequência</label>
                  <select
                    value={form.frequencia}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, frequencia: e.target.value }))
                    }
                    className="form-input"
                  >
                    <option value="nenhuma">Nenhuma</option>
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Repetições</label>
                  <input
                    type="number"
                    min="1"
                    value={form.repeticoes}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        repeticoes: Number(e.target.value),
                      }))
                    }
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <button className="btn btn-save" onClick={onSave}>
                Salvar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
