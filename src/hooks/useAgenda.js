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

  // Criar evento com Optimistic Update
  async function criarEvento(payload) {
    // 1️⃣ cria evento temporário localmente
    const tempId = 'temp-' + Date.now();
    const tempEvent = {
      id: tempId,
      title: payload.paciente_nome || 'Horário ocupado',
      start: `${payload.data}T${payload.hora_inicio}`,
      end: payload.hora_fim ? `${payload.data}T${payload.hora_fim}` : undefined,
      extendedProps: payload,
    };
    setEvents(prev => [...prev, tempEvent]);

    try {
      // 2️⃣ envia pro backend
      const savedEvent = await createEventoAgenda(payload);

      // 3️⃣ substitui o tempEvent pelo evento real
      const formattedEvent = {
        id: savedEvent.id.toString(),
        title: savedEvent.paciente_nome || 'Horário ocupado',
        start: `${savedEvent.data}T${savedEvent.hora_inicio}`,
        end: savedEvent.hora_fim ? `${savedEvent.data}T${savedEvent.hora_fim}` : undefined,
        extendedProps: savedEvent,
      };

      setEvents(prev => prev.map(ev => ev.id === tempId ? formattedEvent : ev));
    } catch (error) {
      // Se falhar, remove tempEvent
      setEvents(prev => prev.filter(ev => ev.id !== tempId));
      console.error('Erro ao criar evento:', error);
    }
  }

  // Atualizar evento com Optimistic Update
  async function atualizarEvento(id, payload) {
    // 1️⃣ atualiza localmente
    setEvents(prev =>
      prev.map(ev =>
        ev.id === id
          ? {
              ...ev,
              title: payload.paciente_nome || 'Horário ocupado',
              start: `${payload.data}T${payload.hora_inicio}`,
              end: payload.hora_fim ? `${payload.data}T${payload.hora_fim}` : undefined,
              extendedProps: payload,
            }
          : ev
      )
    );

    try {
      // 2️⃣ envia atualização pro backend
      const savedEvent = await updateEventoAgenda(id, payload);

      // 3️⃣ garante que dados do backend estejam sincronizados
      const formattedEvent = {
        id: savedEvent.id.toString(),
        title: savedEvent.paciente_nome || 'Horário ocupado',
        start: `${savedEvent.data}T${savedEvent.hora_inicio}`,
        end: savedEvent.hora_fim ? `${savedEvent.data}T${savedEvent.hora_fim}` : undefined,
        extendedProps: savedEvent,
      };

      setEvents(prev => prev.map(ev => ev.id === id ? formattedEvent : ev));
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      // opcional: você pode recarregar só o evento do backend ou mostrar alerta
    }
  }

  // Deletar evento
  async function excluirEvento(id) {
    // 1️⃣ remove localmente imediatamente
    setEvents(prev => prev.filter(ev => ev.id !== id));

    try {
      await deleteEventoAgenda(id);
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      // opcional: recarregar evento ou mostrar alerta
      await carregarEventos();
    }
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
