import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Card from '../../components/Card';

export default function Calendario({
  eventos,
  onEventClick,
  onDateClick,
}) {
  return (
    <Card title="Agenda Geral" size="lg">
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
        events={eventos}
        eventClick={onEventClick}
        dateClick={onDateClick}
        height="auto"
      />
    </Card>

  );
}
