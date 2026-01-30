import React from 'react';
import { addDays, parseLocalDateTime, getHourMinutes } from './date';
import EventBlock from './EventBlock';

// 🔹 Posiciona eventos sobrepostos (MESMA do CalendarWeek)
function positionOverlappingEvents(events) {
  const positioned = [];
  const sorted = [...events].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  sorted.forEach((ev) => {
    let col = 0;
    while (
      positioned.some(
        (p) =>
          p.col === col &&
          new Date(p.start) < new Date(ev.end) &&
          new Date(p.end) > new Date(ev.start)
      )
    ) {
      col++;
    }
    positioned.push({ ...ev, col });
  });

  positioned.forEach((ev) => {
    const overlapping = positioned.filter(
      (p) =>
        new Date(p.start) < new Date(ev.end) &&
        new Date(p.end) > new Date(ev.start)
    );
    ev.totalColumns = Math.max(...overlapping.map((o) => o.col)) + 1;
  });

  return positioned;
}

export default function CalendarThreeDays({ events, date, onEventClick, onDateClick }) {
  const days = [0, 1, 2].map(i => addDays(date, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="calendar-week">
      {/* Cabeçalho único */}
      <div className="calendar-week-header">
        <div className="calendar-week-time-column"></div> {/* espaço do eixo de horas */}
        {days.map((d, idx) => {
          const isToday = d.toDateString() === new Date().toDateString();
          return (
            <div
              key={idx}
              className={`calendar-week-day-header ${isToday ? 'today' : ''}`}
            >
              <div className="calendar-week-day-name">
                {d.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className="calendar-week-day-number">{d.getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* Corpo */}
      <div className="calendar-week-body">
        {/* Eixo de horas */}
        <div className="calendar-week-time-column">
          {hours.map((h) => (
            <div key={h} className="calendar-week-hour">
              {`${h}:00`}
            </div>
          ))}
        </div>

        {/* Colunas dos dias */}
        {days.map((d, idx) => {
          const isToday = d.toDateString() === new Date().toDateString();
          const dayEvents = positionOverlappingEvents(
            events.filter(
              (ev) =>
                parseLocalDateTime(ev.start).toDateString() === d.toDateString()
            )
          );

          return (
            <div
              key={idx}
              className={`calendar-week-day-column ${isToday ? 'today-column' : ''}`}
            >
              {/* Células das horas */}
              {hours.map((h) => (
                <div key={h} className="calendar-week-hour-cell"></div>
              ))}

              {/* Eventos */}
              {dayEvents.map((ev) => {
                const startMinutes = getHourMinutes(ev.start);
                const endMinutes = getHourMinutes(ev.end || ev.start);

                const top = (startMinutes / 60) * 60;
                const height = ((endMinutes - startMinutes) / 60) * 60;

                const width = 100 / ev.totalColumns;
                const left = width * ev.col;

                return (
                  <EventBlock
                    key={ev.id}
                    event={ev}
                    top={top}
                    height={height}
                    width={width}
                    left={left}
                    onEventClick={onEventClick}
                  />
                );
              })}


              {/* Overlay clicável */}
              <div
                className="calendar-week-day-overlay"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  const clickedHour = Math.floor(clickY / 60); // 60px por hora
                  const startTime = `${clickedHour.toString().padStart(2, '0')}:00`;
                  const endTime = `${(clickedHour + 1).toString().padStart(2, '0')}:00`;
                  onDateClick(d.toISOString().slice(0, 10), startTime, endTime, e);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
