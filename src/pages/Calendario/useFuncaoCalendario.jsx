import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function useFuncaoCalendario() {
  const queryClient = useQueryClient();

  // 🔹 Estado do modal e formulário
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

  // 🔹 Eventos antigos (desativados)
  // const { data: eventosApi = [] } = useQuery(
  //   ['eventos'],
  //   async () => {
  //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/eventosagenda/`);
  //     return response.data;
  //   },
  //   {
  //     staleTime: 1000 * 60 * 5,
  //     cacheTime: 1000 * 60 * 10,
  //   }
  // );

  // 🔹 Formata eventos para o calendário
  // Comentei, será usado diretamente pelo FullCalendar via fetch
  // const eventos = eventosApi.map(ev => ({
  //   id: ev.id.toString(),
  //   title: `${ev.paciente_nome || ev.paciente}`,
  //   start: `${ev.data}T${ev.hora_inicio}`,
  //   end: ev.hora_fim ? `${ev.data}T${ev.hora_fim}` : undefined,
  //   extendedProps: { ...ev },
  //   color:
  //     ev.status === 'realizado' ? '#b7de42' :
  //     ev.status === 'confirmado' ? '#25CED1' :
  //     ev.status === 'cancelado' ? '#FF5C5C' :
  //     'grey',
  // }));

  // 🔹 Mutação para salvar ou editar evento
  const salvarEdicaoMutation = useMutation(
    async (dados) => {
      if (dados.id) {
        return axios.put(`${import.meta.env.VITE_API_URL}/api/eventosagenda/${dados.id}/`, dados);
      } else {
        return axios.post(`${import.meta.env.VITE_API_URL}/api/eventosagenda/`, dados);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['eventos']),
    }
  );

  // 🔹 Mutação para excluir evento
  const excluirEventoMutation = useMutation(
    async (id) => axios.delete(`${import.meta.env.VITE_API_URL}/api/eventosagenda/${id}/`),
    {
      onSuccess: () => queryClient.invalidateQueries(['eventos']),
    }
  );

  // 🔹 Ações do modal
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
    const dataHora = info.date;
    const data = info.dateStr.split('T')[0];
    const hora_inicio = info.dateStr.split('T')[1]?.slice(0, 5) || '08:00';
    const fim = new Date(dataHora.getTime() + 60 * 60 * 1000);
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

  // 🔹 Salvar ou editar evento
  const salvarEdicao = () => {
    const dadosParaEnviar = {
      ...form,
      paciente: form.paciente ? Number(form.paciente) : null,
    };
    salvarEdicaoMutation.mutate(dadosParaEnviar);
    fecharModal();
  };

  // 🔹 Excluir evento
  const excluirEvento = () => {
    if (!eventoSelecionado?.id) return;

    const confirmar = window.confirm('Tem certeza que deseja excluir este evento?');
    if (!confirmar) return;

    excluirEventoMutation.mutate(eventoSelecionado.id);
    fecharModal();
  };

  // 🔹 Input change
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
    // 🔹 Removemos eventos estáticos; FullCalendar chamará via fetch
    // eventos,
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
