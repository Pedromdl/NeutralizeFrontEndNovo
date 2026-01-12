import { parseLocalDateTime } from './date'

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function sameDay(d1, d2) {
  return startOfDay(d1).getTime() === startOfDay(d2).getTime()
}

function startOfMonthGrid(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setHours(0, 0, 0, 0)

  const day = d.getDay() // 0 = domingo
  d.setDate(d.getDate() - day)

  return d
}

export default function CalendarMonth({ events, date }) {
  const startDate = startOfMonthGrid(date)

  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    return d
  })

  return (
    <div className="month-grid">
      {days.map(dayDate => {
        const dayEvents = events.filter(e =>
          sameDay(parseLocalDateTime(e.start), dayDate)
        )

        return (
          <div key={dayDate.toISOString()} className="month-cell">
            <div className="month-day">
              {dayDate.getDate()}
            </div>

            {dayEvents.map(e => (
              <div key={e.id} className="month-event">
                {e.title}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
