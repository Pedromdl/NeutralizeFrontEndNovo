import EventBlock from './EventBlock';
import { parseLocalDateTime } from './date';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;

export default function CalendarDay({ events, setEvents, date, updateEvento }) {
  const dayEvents = events.filter(e => parseLocalDateTime(e.start).toDateString() === date.toDateString());

  function moveEvent(eventId, newHour, newMinutes, newDate = null) {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id.toString() === eventId) {
          const start = new Date(evt.start);
          if (newDate) start.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
          start.setHours(newHour);
          start.setMinutes(newMinutes);
          const duration = new Date(evt.end) - new Date(evt.start);
          const end = new Date(start.getTime() + duration);

          // Atualiza backend
          updateEvento(evt.id, start, end);

          return { ...evt, start, end };
        }
        return evt;
      })
    );
  }

  return (
    <div className="calendar">
      <div className="time-axis">
        {HOURS.map(h => <div key={h} className="hour">{String(h).padStart(2,'0')}:00</div>)}
      </div>

      <div className="day-column"
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{
          const eventId = e.dataTransfer.getData('text/plain');
          const boundingRect = e.currentTarget.getBoundingClientRect();
          const offsetY = e.clientY - boundingRect.top;
          const hour = Math.floor(offsetY/HOUR_HEIGHT);
          let minutes = Math.floor(((offsetY % HOUR_HEIGHT)/HOUR_HEIGHT)*60);
          const SNAP_MINUTES = 15;
          minutes = Math.round(minutes/SNAP_MINUTES)*SNAP_MINUTES;
          let dropHour = hour;
          if (minutes>=60){ minutes=0; dropHour+=1;}
          moveEvent(eventId, dropHour, minutes, date);
        }}
      >
        {dayEvents.map(evt => <EventBlock key={evt.id} event={evt} />)}
      </div>
    </div>
  );
}
