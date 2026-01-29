import EventBlock from './EventBlock';
import { parseLocalDateTime } from './date';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function startOfDay(date) { const d = new Date(date); d.setHours(0,0,0,0); return d; }
function sameDay(d1,d2){ return startOfDay(d1).getTime() === startOfDay(d2).getTime(); }
function startOfWeek(date){ const d=startOfDay(date); d.setDate(d.getDate()-d.getDay()); return d; }

function calculateTop(start){ const d=new Date(start); return d.getHours()*HOUR_HEIGHT + (d.getMinutes()/60)*HOUR_HEIGHT; }
function calculateHeight(start,end){ return ((new Date(end)-new Date(start))/1000/60/60)*HOUR_HEIGHT; }

// 🔹 Posiciona eventos sobrepostos
function positionOverlappingEvents(events){
  const positioned = [];
  const sorted = [...events].sort((a,b)=>new Date(a.start)-new Date(b.start));

  sorted.forEach(ev=>{
    let col = 0;
    while(positioned.some(p=>p.col===col && new Date(p.start)<new Date(ev.end) && new Date(p.end)>new Date(ev.start))){
      col++;
    }
    positioned.push({...ev, col});
  });

  positioned.forEach(ev=>{
    const overlapping = positioned.filter(p=>new Date(p.start)<new Date(ev.end) && new Date(p.end)>new Date(ev.start));
    ev.totalColumns = Math.max(...overlapping.map(o=>o.col))+1;
  });

  return positioned;
}

export default function CalendarWeek({ events, setEvents, date, updateEvento, onEventClick, onDateClick }) {
  const weekStart = startOfWeek(date);
  const today = startOfDay(new Date());
  const daysOfWeek = Array.from({length:7},(_,i)=>{
    const d = new Date(weekStart); 
    d.setDate(d.getDate()+i); 
    return d;
  });

  function moveEvent(eventId,newHour,newMinutes,newDate){
    setEvents(prev=>prev.map(evt=>{
      if(evt.id.toString()===eventId){
        const start = new Date(evt.start);
        if(newDate) start.setFullYear(newDate.getFullYear(),newDate.getMonth(),newDate.getDate());
        start.setHours(newHour);
        start.setMinutes(newMinutes);
        const duration = new Date(evt.end)-new Date(evt.start);
        const end = new Date(start.getTime()+duration);
        updateEvento(evt.id,start,end);
        return {...evt,start,end};
      }
      return evt;
    }));
  }

  return (
    <div className="calendar">
      <div className="time-axis">{HOURS.map(h=><div key={h} className="hour">{String(h).padStart(2,'0')}:00</div>)}</div>
      <div className="week-grid">
        {daysOfWeek.map((dayDate,index)=>{
          const isToday = sameDay(dayDate,today);
          const dayEvents = events.filter(e=>sameDay(parseLocalDateTime(e.start),dayDate));
          const processedEvents = positionOverlappingEvents(dayEvents);

          return (
            <div
              key={index}
              className={`day-column ${isToday ? 'today-column' : ''}`}
              onDragOver={e=>e.preventDefault()}
onClick={(e) => {
  if (e.target === e.currentTarget) {
    const bounding = e.currentTarget.getBoundingClientRect()
    const offsetY = e.clientY - bounding.top

    const hour = Math.floor(offsetY / HOUR_HEIGHT)
    const minutes = Math.floor(((offsetY % HOUR_HEIGHT) / HOUR_HEIGHT) * 60)

    const SNAP = 30
    const snapped = Math.round(minutes / SNAP) * SNAP

    const startH = hour
    const startM = snapped
    const endH = startH + 1

    onDateClick(
      dayDate.toISOString().slice(0, 10),
      `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      `${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      e // 🔥 ISSO
    )
  }
}}

              onDrop={e=>{
                const eventId = e.dataTransfer.getData('text/plain');
                const bounding = e.currentTarget.getBoundingClientRect();
                const offsetY = e.clientY - bounding.top;
                const hour = Math.floor(offsetY/HOUR_HEIGHT);
                const minutes = Math.floor(((offsetY%HOUR_HEIGHT)/HOUR_HEIGHT)*60);
                const SNAP=15;
                const snapped = Math.round(minutes/SNAP)*SNAP;
                let startH = hour, startM = snapped;
                if(startM>=60){ startM=0; startH+=1; }
                moveEvent(eventId,startH,startM,dayDate);
              }}
            >
              <div className={`day-header ${isToday?'today':''}`}>
                <div className="day-name">{DAYS[dayDate.getDay()]}</div>
                <div className="day-number">{dayDate.getDate()}</div>
              </div>

              {processedEvents.map(e=>{
                const widthPercent = 100 / e.totalColumns;
                const leftPercent = widthPercent * e.col;
                return <EventBlock key={e.id} event={e} onEventClick={onEventClick} width={widthPercent} left={leftPercent} />
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
