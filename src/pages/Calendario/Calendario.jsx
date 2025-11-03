import { useCallback, useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBr from '@fullcalendar/core/locales/pt-br';

export default function Calendario({ onEventClick, onDateClick, calendarRef }) {
  const [loading, setLoading] = useState(false);
  const [initialView, setInitialView] = useState('timeGridWeek');

  const cacheIntervalo = useRef({ start: null, end: null });
  const cacheEventos = useRef([]);
  window.__cacheEventos = cacheEventos; // 🔹 Torna o cache acessível ao hook

  // 🔹 Detecta se é mobile para usar 3 dias
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setInitialView('timeGridThreeDay');
      } else {
        setInitialView('timeGridWeek');
      }
    };

    handleResize(); // executa uma vez na montagem
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchEventos = useCallback(async (fetchInfo, successCallback, failureCallback) => {
    try {
      setLoading(true);
      const visivelStart = new Date(fetchInfo.start);
      const visivelEnd = new Date(fetchInfo.end);

      if (
        cacheIntervalo.current.start &&
        cacheIntervalo.current.end &&
        visivelStart >= cacheIntervalo.current.start &&
        visivelEnd <= cacheIntervalo.current.end
      ) {
        successCallback(cacheEventos.current);
        return;
      }

      const startDate = new Date(visivelStart);
      startDate.setDate(startDate.getDate() - 15);
      const endDate = new Date(visivelEnd);
      endDate.setDate(endDate.getDate() + 15);

      const formatarData = (d) => d.toISOString().split('T')[0];
      const startStr = formatarData(startDate);
      const endStr = formatarData(endDate);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eventosagenda/?start=${startStr}&end=${endStr}`
      );

      if (!response.ok) throw new Error('Erro ao carregar eventos');

      const data = await response.json();

      const eventosFormatados = data.map(ev => ({
        id: ev.id?.toString() || `${ev.data}-${ev.hora_inicio}`, // garante string
        title: `${ev.paciente_nome || 'Horário ocupado'}`,       // usa apenas o nome do paciente
        start: `${ev.data}T${ev.hora_inicio}`,                   // data + hora início
        end: ev.hora_fim ? `${ev.data}T${ev.hora_fim}` : undefined, // opcional
        extendedProps: ev,                                       // mantém todos os dados para tooltip ou clique
        backgroundColor:
          ev.status?.toLowerCase() === 'realizado' ? '#b7de42' :
            ev.status?.toLowerCase() === 'confirmado' ? '#25CED1' :
              ev.status?.toLowerCase() === 'cancelado' ? '#FF5C5C' :
                'grey',
        borderColor: 'transparent',
      }));

      cacheIntervalo.current = { start: startDate, end: endDate };
      cacheEventos.current = eventosFormatados;

      successCallback(eventosFormatados);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      failureCallback(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h2>Agenda Geral</h2>
      {loading && <p style={{ padding: '8px', color: '#666' }}>Carregando eventos...</p>}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        slotDuration="01:00:00"
        slotLabelInterval="01:00"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridThreeDay,timeGridDay',
        }}
        views={{
          timeGridThreeDay: {
            type: 'timeGrid',
            duration: { days: 3 },
            buttonText: '3 dias',
          },
        }}
        locale="pt-br"
        locales={[ptBr]}
        events={fetchEventos}
        eventClick={onEventClick}
        dateClick={onDateClick}
        eventDidMount={(info) => {
          info.el.style.color = '#fff';
          info.el.style.fontWeight = 'bold';
        }}
        height="auto"
      />
    </div>
  );
}
