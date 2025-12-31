export function parseLocalDateTime(dateStr) {
  if (dateStr instanceof Date) return dateStr

  const [datePart, timePart] = dateStr.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}


export function getDayIndex(dateStr) {
  return parseLocalDateTime(dateStr).getDay()
}

export function getHourMinutes(dateStr) {
  const d = parseLocalDateTime(dateStr)
  return d.getHours() * 60 + d.getMinutes()
}
