// src/utils/eventStatus.js
export const EVENT_STATUS = {
  pendente: {
    label: 'Pendente',
    color: '#9CA3AF',
  },
  confirmado: {
    label: 'Confirmado',
    color: '#25CED1',
  },
  realizado: {
    label: 'Realizado',
    color: '#B7DE42',
  },
  cancelado: {
    label: 'Cancelado',
    color: '#FF5C5C',
  },
};

export function getStatusStyle(status) {
  return EVENT_STATUS[status?.toLowerCase()] || EVENT_STATUS.pendente;
}
