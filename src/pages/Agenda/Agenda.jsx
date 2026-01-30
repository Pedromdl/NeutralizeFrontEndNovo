import { useState, useRef } from 'react';
import { useAgenda } from '../../hooks/useAgenda';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import CalendarDay from './Calendario/CalendarDay';
import CalendarThreeDays from './Calendario/CalendarThreeDays';
import CalendarWeek from './Calendario/CalendarWeek';
import CalendarMonth from './Calendario/CalendarMonth';
import ModalCalendario from './Calendario/ModalCalendario';
import './Calendario/calendar.css';

/* Utils */

function getPanelPosFromClick(e, options = {}) {
  const {
    width = 360,
    height = 420,
    gap = 8,
  } = options

  let left = e.clientX + gap
  let top = e.clientY + window.scrollY

  // se estourar à direita
  if (left + width > window.innerWidth) {
    left = e.clientX - width - gap
  }

  // se estourar embaixo
  if (top + height > window.scrollY + window.innerHeight) {
    top = window.scrollY + window.innerHeight - height - gap
  }

  left = Math.max(gap, left)
  top = Math.max(gap, top)

  return { top, left }
}

function isMobile() {
  return window.innerWidth <= 768
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function formatHeaderDate(date, view) {
  return view === 'day'
    ? date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
}

export default function Agenda() {
  /* View */
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  /* Backend (hook) */
  const {
    events,
    loading,
    criarEvento,
    atualizarEvento,
    excluirEvento,
  } = useAgenda(currentDate);

  /* Modal / UI */
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const ignoreNextClickRef = useRef(false)


  const [form, setForm] = useState({
    paciente: null,
    paciente_nome: '',
    tipo: '',
    status: 'pendente',
    data: '',
    hora_inicio: '',
    hora_fim: '',
    responsavel: '',
    repetir: false,
    frequencia: 'nenhuma',
    repeticoes: 0,
  });

  const [draftEvent, setDraftEvent] = useState(null)
  const [panelPos, setPanelPos] = useState(null)

  /* Handlers */
  const handleEventClick = (ev, position) => {

    if (modalAberto) return;

    setEventoSelecionado(ev)
    setPanelPos(position)

    setForm({
      paciente: ev.extendedProps.paciente || null,
      paciente_nome: ev.extendedProps.paciente_nome || '',
      tipo: ev.extendedProps.tipo || '',
      status: ev.extendedProps.status?.toLowerCase() || 'pendente',
      data: ev.start?.slice(0, 10) || '',
      hora_inicio: ev.start?.slice(11, 16) || '',
      hora_fim: ev.end?.slice(11, 16) || '',
      responsavel: ev.extendedProps.responsavel || '',
      repetir: ev.extendedProps.repetir || false,
      frequencia: ev.extendedProps.frequencia || 'nenhuma',
      repeticoes: ev.extendedProps.repeticoes || 0,
    })

    setEditando(false)
    setModalAberto(true)
  }

  const handleDateClick = (date, start, end, e) => {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false // libera para o próximo
      return
    }
    // ⛔ se já tem modal aberto, ignora
    if (modalAberto) return

    setEventoSelecionado(null)

    setForm({
      paciente: null,
      paciente_nome: '',
      tipo: '',
      status: 'pendente',
      data: date,
      hora_inicio: start,
      hora_fim: end,
      responsavel: '',
      repetir: false,
      frequencia: 'nenhuma',
      repeticoes: 0,
    })

    if (isMobile()) {
      setPanelPos(null)
    } else {
      setPanelPos(
        getPanelPosFromClick(e, {
          width: 360,
          height: 420,
        })
      )
    }

    setEditando(true)
    setModalAberto(true)
  }



  const handleSave = async () => {
    // Fecha modal instantaneamente
    setModalAberto(false);
    setEditando(false);

    if (eventoSelecionado) {
      atualizarEvento(eventoSelecionado.id, form); // não precisa await
    } else {
      criarEvento(form); // não precisa await
    }
  };

  const handleDelete = () => {
    if (!eventoSelecionado) return;

    // fecha modal imediatamente
    setModalAberto(false);
    setEditando(false);

    // chama exclusão em background
    excluirEvento(eventoSelecionado.id); // não precisa await
  };


  /* Navegação */
  function handlePrev() {
    if (view === 'day') setCurrentDate(addDays(currentDate, -1));
    if (view === 'three') setCurrentDate(addDays(currentDate, -3));
    if (view === 'week') setCurrentDate(addDays(currentDate, -7));
    if (view === 'month') setCurrentDate(addDays(currentDate, -30));
  }

  function handleNext() {
    if (view === 'day') setCurrentDate(addDays(currentDate, 1));
    if (view === 'three') setCurrentDate(addDays(currentDate, 3));
    if (view === 'week') setCurrentDate(addDays(currentDate, 7));
    if (view === 'month') setCurrentDate(addDays(currentDate, 30));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  return (
    <div className="conteudo-calendario">
      {/* HEADER */}
      <div className="agenda-header">
        <div className="agenda-nav">
          <button onClick={handlePrev}><ChevronLeft size={14} /></button>
          <button onClick={handleToday}>Hoje</button>
          <button onClick={handleNext}><ChevronRight size={14} /></button>
        </div>

        <div className="agenda-date">
          {formatHeaderDate(currentDate, view)}
        </div>

        <div className="agenda-view">
          <div className="agenda-view-desktop">
            <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>
              Dia
            </button>
            <button className={view === 'three' ? 'active' : ''} onClick={() => setView('three')}>
              3 Dias
            </button>
            <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>
              Semana
            </button>
            <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>
              Mês
            </button>
          </div>

          <select
            className="agenda-view-mobile"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="day">Dia</option>
            <option value="three">3 Dias</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
          </select>
        </div>
      </div>

      {loading && (
        <p style={{ padding: '8px', color: '#666' }}>
          Carregando eventos...
        </p>
      )}

      {/* CALENDÁRIOS */}
      {view === 'day' && (
        <CalendarDay
          events={events}
          date={currentDate}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      )}

      {view === 'three' && (
        <CalendarThreeDays
          events={events}
          date={currentDate}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      )}

      {view === 'week' && (
        <CalendarWeek
          events={events}
          date={currentDate}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      )}

      {view === 'month' && (
        <CalendarMonth events={events} date={currentDate} />
      )}

      {/* MODAL EXTRAÍDO */}
      <ModalCalendario
        aberto={modalAberto}
        editando={editando}
        setEditando={setEditando}
        eventoSelecionado={eventoSelecionado}
        form={form}
        setForm={setForm}
        panelPos={panelPos}   // 👈 AQUI

        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => {
          ignoreNextClickRef.current = true   // 👈 trava
          setModalAberto(false);
          setEditando(false);
        }}
      />
    </div>
  );
}
