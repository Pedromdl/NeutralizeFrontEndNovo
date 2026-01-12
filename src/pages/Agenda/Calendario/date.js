// Converte string ISO ou Date para Date local
export function parseLocalDateTime(dateStr) {
  if (dateStr instanceof Date) return dateStr;

  const [datePart, timePart] = dateStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

// Retorna índice do dia da semana (0 = domingo, 6 = sábado)
export function getDayIndex(dateStr) {
  return parseLocalDateTime(dateStr).getDay();
}

// Retorna hora e minutos convertidos em minutos totais
export function getHourMinutes(dateStr) {
  const d = parseLocalDateTime(dateStr);
  return d.getHours() * 60 + d.getMinutes();
}

// Adiciona dias a uma data (Date)
export function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}
