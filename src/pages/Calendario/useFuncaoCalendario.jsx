import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function useFuncaoCalendario(calendarRef) {
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    id: null,
    paciente: null,
    paciente_nome: '',
    tipo: '',
    status: 'Pendente',
    data: '',
    hora_inicio: '',
    hora_fim: '',
    repetir: false,
    frequencia: 'nenhuma',
    repeticoes: 0,
    responsavel: '',
  });

  // 🔹 Salvar ou editar evento
  const salvarEdicaoMutation = useMutation(
    async (dados) => {
      if (dados.id) {
        return axios.put(`${import.meta.env.VITE_API_URL}/api/eventosagenda/${dados.id}/`, dados);
      } else {
        return axios.post(`${import.meta.env.VITE_API_URL}/api/eventosagenda/`, dados);
      }
    },
    {
      onSuccess: (res, dados) => {
        const novoEvento = {
          id: res.data.id.toString(),
          title: dados.paciente_nome || 'Horário ocupado',
          start: `${dados.data}T${dados.hora_inicio}`,
          end: dados.hora_fim ? `${dados.data}T${dados.hora_fim}` : undefined,
          extendedProps: dados,
          backgroundColor:
            dados.status?.toLowerCase() === 'realizado' ? '#b7de42' :
            dados.status?.toLowerCase() === 'confirmado' ? '#25CED1' :
            dados.status?.toLowerCase() === 'cancelado' ? '#FF5C5C' :
            'grey',
          borderColor: 'transparent',
        };

        if (calendarRef?.current) {
          const eventoExistente = calendarRef.current.getApi().getEventById(novoEvento.id);
          if (eventoExistente) eventoExistente.remove();
          calendarRef.current.getApi().addEvent(novoEvento);
        }
      },
    }
  );

  // 🔹 Excluir evento
  const excluirEventoMutation = useMutation(
    async (id) => axios.delete(`${import.meta.env.VITE_API_URL}/api/eventosagenda/${id}/`),
    {
      onSuccess: (_, id) => {
        if (calendarRef?.current) {
          const evento = calendarRef.current.getApi().getEventById(id.toString());
          if (evento) evento.remove();
        }
      },
    }
  );

  const handleClickEvento = (info) => {
    const ev = info.event.extendedProps;
    setEventoSelecionado(ev);
    setForm({
      id: ev.id || info.event.id,
      paciente: ev.paciente || null,
      paciente_nome: ev.paciente_nome || '',
      tipo: ev.tipo || '',
      status: ev.status || '',
      data: ev.data || '',
      hora_inicio: ev.hora_inicio || '',
      hora_fim: ev.hora_fim || '',
      repetir: ev.repetir || false,
      frequencia: ev.frequencia || 'nenhuma',
      repeticoes: ev.repeticoes || 0,
      responsavel: ev.responsavel || '',
    });
    setEditando(false);
    setModalAberto(true);
  };

  const handleDateClick = (info) => {
    const data = info.dateStr.split('T')[0];
    const hora_inicio = info.dateStr.split('T')[1]?.slice(0, 5) || '08:00';
    const fim = new Date(info.date.getTime() + 60 * 60 * 1000);
    const hora_fim = fim.toTimeString().slice(0, 5);

    setForm({
      id: null,
      paciente: null,
      paciente_nome: '',
      tipo: '',
      status: 'pendente',
      data,
      hora_inicio,
      hora_fim,
      repetir: false,
      frequencia: 'nenhuma',
      repeticoes: 0,
      responsavel: '',
    });

    setEditando(true);
    setEventoSelecionado(null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoSelecionado(null);
    setEditando(false);
  };

  const salvarEdicao = () => {
    const dadosParaEnviar = {
      ...form,
      paciente: form.paciente ? Number(form.paciente) : null,
    };
    salvarEdicaoMutation.mutate(dadosParaEnviar);
    fecharModal();
  };

  const excluirEvento = (id) => {
    excluirEventoMutation.mutate(id || eventoSelecionado.id);
    fecharModal();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'hora_inicio') {
      const [hora, minuto] = value.split(':').map(Number);
      const novaData = new Date();
      novaData.setHours(hora + 1, minuto);
      const novaHoraFim = novaData.toTimeString().slice(0, 5);

      setForm(prev => ({
        ...prev,
        hora_inicio: value,
        hora_fim: novaHoraFim,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  return {
    modalAberto,
    eventoSelecionado,
    editando,
    form,
    setForm,
    handleClickEvento,
    handleDateClick,
    fecharModal,
    excluirEvento,
    handleInputChange,
    salvarEdicao,
    setEditando,
    setEventoSelecionado,
  };
}
