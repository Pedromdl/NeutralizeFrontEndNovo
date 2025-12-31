import { useState, useEffect } from 'react';
import {
  fetchEventosAgenda,
  createEventoAgenda,
  updateEventoAgenda,
  deleteEventoAgenda
} from '../services/agendaService';

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

export function useAgenda(currentDate) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  async function carregarEventos() {
    try {
      setLoading(true);

      const start = new Date(currentDate);
      start.setDate(start.getDate() - 15);

      const end = new Date(currentDate);
      end.setDate(end.getDate() + 15);

      const data = await fetchEventosAgenda({
        start: formatDate(start),
        end: formatDate(end),
      });

      const eventosFormatados = data.map(ev => ({
        id: ev.id.toString(),
        title: ev.paciente_nome || 'Horário ocupado',
        start: `${ev.data}T${ev.hora_inicio}`,
        end: ev.hora_fim ? `${ev.data}T${ev.hora_fim}` : undefined,
        extendedProps: ev,
      }));

      setEvents(eventosFormatados);
    } finally {
      setLoading(false);
    }
  }

  async function criarEvento(payload) {
    await createEventoAgenda(payload);
    await carregarEventos();
  }

  async function atualizarEvento(id, payload) {
    await updateEventoAgenda(id, payload);
    await carregarEventos();
  }

  async function excluirEvento(id) {
    await deleteEventoAgenda(id);
    await carregarEventos();
  }

  useEffect(() => {
    carregarEventos();
  }, [currentDate]);

  return {
    events,
    loading,
    criarEvento,
    atualizarEvento,
    excluirEvento,
    recarregar: carregarEventos,
  };
}
