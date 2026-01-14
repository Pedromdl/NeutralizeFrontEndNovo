import { parseLocalDateTime } from './date'
import { getStatusStyle } from '../../../utils/eventStatus'

const HOUR_HEIGHT = 60 // TEM que bater com o CSS

export default function EventBlock({ event, onEventClick, width = 100, left = 0 }) {
  const start = parseLocalDateTime(event.start)
  const end = parseLocalDateTime(event.end)

  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()

  const top = (startMinutes / 60) * HOUR_HEIGHT
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT - 2

  const status = event.extendedProps?.status?.toLowerCase()
  const { color } = getStatusStyle(status)

  return (
    <div
      className={`event status-${status}`}
      style={{
        position: 'absolute',
        top: `${top}px`,
        height: `${height}px`,
        width: `${width}%`,
        left: `${left}%`,
        cursor: 'grab',
        backgroundColor: color,
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(event.id))
      }}
      onClick={(e) => {
        e.stopPropagation()

        const rect = e.currentTarget.getBoundingClientRect()

        const MODAL_WIDTH = 320
        const GAP = 8
        const MARGIN = 8

        let modalLeft = rect.right + GAP
        const modalTop = rect.top + window.scrollY

        // 👉 TESTE CORRETO
        if (modalLeft + MODAL_WIDTH > window.innerWidth - MARGIN) {
          modalLeft = rect.left - MODAL_WIDTH - GAP
        }

        // 👉 segurança extra
        if (modalLeft < MARGIN) {
          modalLeft = MARGIN
        }

        onEventClick(event, {
          top: modalTop,
          left: modalLeft,
        })
      }}
    >
      <strong>{event.title}</strong>
    </div>
  )
}
