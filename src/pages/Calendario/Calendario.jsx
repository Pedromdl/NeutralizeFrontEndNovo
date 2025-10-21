import { useCallback, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBr from '@fullcalendar/core/locales/pt-br';
import Card from '../../components/Card';

export default function Calendario({ onEventClick, onDateClick }) {
  const [loading, setLoading] = useState(false);

  // 🔹 Guardar intervalo de eventos já carregado
  const cacheIntervalo = useRef({ start: null, end: null });
  const cacheEventos = useRef([]);

  const fetchEventos = useCallback(async (fetchInfo, successCallback, failureCallback) => {
    try {
      setLoading(true);

      // 🔹 Checa se a data visível está fora do intervalo cacheado
      const visivelStart = new Date(fetchInfo.start);
      const visivelEnd = new Date(fetchInfo.end);

      if (
        cacheIntervalo.current.start &&
        cacheIntervalo.current.end &&
        visivelStart >= cacheIntervalo.current.start &&
        visivelEnd <= cacheIntervalo.current.end
      ) {
        // ✅ Usar cache local
        successCallback(cacheEventos.current);
        return;
      }

      // 🔹 Atualiza intervalo para 15 dias antes e depois da data visível
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
        id: ev.id.toString(),
        title: `${ev.paciente_nome || ev.paciente || 'Horário ocupado'}`,
        start: `${ev.data}T${ev.hora_inicio}`,
        end: ev.hora_fim ? `${ev.data}T${ev.hora_fim}` : undefined,
        extendedProps: ev,
        backgroundColor:
          ev.status?.toLowerCase() === 'realizado' ? '#b7de42' :
          ev.status?.toLowerCase() === 'confirmado' ? '#25CED1' :
          ev.status?.toLowerCase() === 'cancelado' ? '#FF5C5C' :
          'grey',
        borderColor: 'transparent',
      }));

      // 🔹 Atualiza cache
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
    <Card title="Agenda Geral" size="lg">
      {loading && <p style={{ padding: '8px', color: '#666' }}>Carregando eventos...</p>}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotDuration="01:00:00"
        slotLabelInterval="01:00"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
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
    </Card>
  );
}
