import {
  Edit,
  Trash2,
  User,
  UserCheck,
  Calendar,
  Repeat,
  CheckCircle,
  Clock,
} from 'lucide-react'
import UserSearch from '../../../components/UserSearch'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function EventoModal({
  aberto,
  editando,
  setEditando,
  form,
  setForm,
  onSave,
  onDelete,
  onClose,
  panelPos,
}) {
  const popoverRef = useRef(null)
  const isMobile = window.innerWidth <= 768


  /* =========================
     Utils
  ========================== */
  function adicionarMinutos(hora, minutos) {
    if (!hora) return ''
    const [h, m] = hora.split(':').map(Number)
    const d = new Date()
    d.setHours(h)
    d.setMinutes(m + minutos)
    return `${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes()
    ).padStart(2, '0')}`
  }

  /* =========================
      Trava scroll
  ========================== */

  useEffect(() => {
  // trava scroll apenas no modo visualização
  if (aberto && !editando) {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }
}, [aberto, editando])

  /* =========================
     Click fora → fechar
  ========================== */
  useEffect(() => {
    if (!aberto) return

    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        e.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside, true)
  }, [aberto, onClose])

  if (!aberto) return null

  const style = isMobile
    ? {
      display: 'fixed',
      inset: 0,
      zIndex: 1000,
      maxHeight: '100%',
    }
    : panelPos
      ? {
        position: 'absolute',
        top: panelPos.top,
        left: panelPos.left,
        zIndex: 1000,
      }
      : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      }



  /* =========================
     Render (Portal)
  ========================== */
  return createPortal(
    <div
      className={`event-popover ${isMobile ? 'mobile-fullscreen' : ''}`}
      style={style}
    >
      <div
        ref={popoverRef}
        className={`google-calendar-modal ${isMobile ? 'modal-mobile' : ''
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {!editando ? (
          <>
            {/* AÇÕES */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <Edit
                className="icon"
                onClick={() => setEditando(true)}
                style={{ cursor: 'pointer' }}
              />
              <Trash2
                className="icon"
                onClick={onDelete}
                style={{ cursor: 'pointer' }}
              />
            </div>

            {/* TÍTULO */}
            <h3 style={{ marginBottom: 16 }}>
              {form.paciente_nome || 'Paciente não definido'}
            </h3>

            {/* DATA + HORÁRIO */}
            <ViewRow icon={Calendar}>
              {new Date(form.data).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              • {form.hora_inicio} – {form.hora_fim}
            </ViewRow>

            {form.tipo && (
              <ViewRow icon={CheckCircle}>{form.tipo}</ViewRow>
            )}

            {form.responsavel && (
              <ViewRow icon={UserCheck}>{form.responsavel}</ViewRow>
            )}

            {form.repetir && (
              <ViewRow icon={Repeat}>
                {form.frequencia} • {form.repeticoes}x
              </ViewRow>
            )}

            <ViewRow icon={CheckCircle}>
              <span style={{ textTransform: 'capitalize' }}>
                {form.status}
              </span>
            </ViewRow>
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="modal-header-fixed">
              <button className="modal-close-btn" onClick={onClose}>
                ✕
              </button>
            </div>

            {/* CONTEÚDO */}
            <div className="modal-content">
              <Row icon={User}>
                <UserSearch
                  modoModal
                  valorInicial={form.paciente_nome}
                  onSelect={(u) =>
                    setForm((p) => ({
                      ...p,
                      paciente: u.id,
                      paciente_nome: u.nome,
                    }))
                  }
                />
              </Row>

              <Row icon={CheckCircle}>
                <input
                  type="text"
                  value={form.tipo || ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tipo: e.target.value }))
                  }
                  className="modal-input"
                  placeholder="Tipo do evento"
                />
              </Row>

              <Row icon={CheckCircle}>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value,
                    }))
                  }
                  className="modal-input"
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </Row>


              <Row icon={Calendar}>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, data: e.target.value }))
                  }
                  className="modal-input"
                />
              </Row>

              <Row icon={Clock}>
                <input
                  type="time"
                  value={form.hora_inicio}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      hora_inicio: e.target.value,
                      hora_fim: adicionarMinutos(e.target.value, 60),
                    }))
                  }
                  className="modal-input"
                />
                <span style={{ margin: '0 6px' }}>–</span>
                <input
                  type="time"
                  value={form.hora_fim}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, hora_fim: e.target.value }))
                  }
                  className="modal-input"
                />
              </Row>

              <Row icon={UserCheck}>
                <input
                  type="text"
                  value={form.responsavel || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      responsavel: e.target.value,
                    }))
                  }
                  className="modal-input"
                  placeholder="Responsável"
                />
              </Row>

              <Row icon={Repeat}>
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={form.repetir}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        repetir: e.target.checked,
                      }))
                    }
                  />
                  Repetir evento
                </label>
              </Row>

              {form.repetir && (
                <>
                  <Row icon={Repeat}>
                    <select
                      value={form.frequencia}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          frequencia: e.target.value,
                        }))
                      }
                      className="modal-input"
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </Row>

                  <Row icon={Repeat}>
                    <input
                      type="number"
                      min="1"
                      value={form.repeticoes}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          repeticoes: Number(e.target.value),
                        }))
                      }
                      className="modal-input"
                      placeholder="Repetições"
                    />
                  </Row>
                </>
              )}

              <div className="modal-actions">
                <button className="btn btn-save" onClick={onSave}>
                  Salvar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

/* =========================
   Auxiliares
========================== */
function ViewRow({ icon: Icon, children }) {
  return (
    <div className="view-row">
      <Icon className="view-icon" />
      <span>{children}</span>
    </div>
  )
}

function Row({ icon: Icon, children }) {
  return (
    <div className="modal-row">
      <Icon className="modal-icon" />
      {children}
    </div>
  )
}
