import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useFuncaoCalendario() {
  const [eventos, setEventos] = useState([]);
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

  useEffect(() => {
    async function buscarEventos() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/eventos/`);
        const eventosApi = response.data;

        const eventosFormatados = eventosApi.map(ev => ({
          id: ev.id.toString(),
          title: `${ev.tipo} (${ev.status}) - Paciente ${ev.paciente_nome || ev.paciente}`,
          start: `${ev.data}T${ev.hora_inicio}`,
          end: ev.hora_fim ? `${ev.data}T${ev.hora_fim}` : undefined,
          extendedProps: { ...ev },
          color:
            ev.status === 'Realizado' ? '#b7de42' :
              ev.status === 'Confirmado' ? '#25CED1' :
                'grey',
        }));

        setEventos(eventosFormatados);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    }
    buscarEventos();
  }, []);

  const handleClickEvento = (info) => {
    setEventoSelecionado(info.event.extendedProps);
    setForm({
      id: info.event.extendedProps.id || info.event.id,
      paciente: info.event.extendedProps.paciente || null,
      paciente_nome: info.event.extendedProps.paciente_nome || '',
      tipo: info.event.extendedProps.tipo || '',
      status: info.event.extendedProps.status || '',
      data: info.event.extendedProps.data || '',
      hora_inicio: info.event.extendedProps.hora_inicio || '',
      hora_fim: info.event.extendedProps.hora_fim || '',
      repetir: info.event.extendedProps.repetir || false,
      frequencia: info.event.extendedProps.frequencia || 'nenhuma',
      repeticoes: info.event.extendedProps.repeticoes || 0,
      responsavel: info.event.extendedProps.responsavel || '',
    });
    setEditando(false);
    setModalAberto(true);
  };

const handleDateClick = (info) => {
  const dataHora = info.date;
  const data = info.dateStr.split('T')[0];
  const hora_inicio = info.dateStr.split('T')[1]?.slice(0, 5) || '08:00';

  // Adiciona 1 hora à hora_inicio
  const fim = new Date(dataHora.getTime() + 60 * 60 * 1000);
  const hora_fim = fim.toTimeString().slice(0, 5);

  setForm({
    id: null,
    paciente: null,
    paciente_nome: '',
    tipo: '',
    status: 'Pendente',
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

  const excluirEvento = async () => {
    if (!eventoSelecionado?.id) return;

    const confirmar = window.confirm('Tem certeza que deseja excluir este evento?');
    if (!confirmar) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/eventos/${eventoSelecionado.id}/`);
      setEventos(prevEventos => prevEventos.filter(ev => ev.id !== eventoSelecionado.id.toString()));
      fecharModal();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir o evento. Tente novamente.');
    }
  };

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  // Atualiza hora_fim automaticamente se hora_inicio for alterado
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

  const salvarEdicao = async () => {
    try {
      const dadosParaEnviar = {
        ...form,
        paciente: form.paciente ? Number(form.paciente) : null,
      };

      if (form.id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/eventos/${form.id}/`, dadosParaEnviar);
        setEventos(prevEventos =>
          prevEventos.map(ev =>
            ev.id === form.id.toString()
              ? {
                ...ev,
                title: `${dadosParaEnviar.tipo} (${dadosParaEnviar.status}) - Paciente ${form.paciente_nome || dadosParaEnviar.paciente}`,
                start: `${dadosParaEnviar.data}T${dadosParaEnviar.hora_inicio}`,
                end: dadosParaEnviar.hora_fim ? `${dadosParaEnviar.data}T${dadosParaEnviar.hora_fim}` : undefined,
                color:
                  dadosParaEnviar.status === 'Realizado' ? '#b7de42' :
                    dadosParaEnviar.status === 'Confirmado' ? '#25CED1' :
                      'grey',
                extendedProps: dadosParaEnviar,
              }
              : ev
          )
        );
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/eventos/`, dadosParaEnviar);
        const novoEvento = response.data;

        setEventos(prev => [
          ...prev,
          {
            id: novoEvento.id.toString(),
            title: `${novoEvento.tipo} (${novoEvento.status}) - Paciente ${form.paciente_nome || novoEvento.paciente}`,
            start: `${novoEvento.data}T${novoEvento.hora_inicio}`,
            end: novoEvento.hora_fim ? `${novoEvento.data}T${novoEvento.hora_fim}` : undefined,
            extendedProps: {
              ...novoEvento,
              paciente_nome: form.paciente_nome,
            },
            color:
              novoEvento.status === 'Realizado' ? '#b7de42' :
                novoEvento.status === 'Confirmado' ? '#25CED1' :
                  'grey',
          },
        ]);
      }

      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar. Verifique os campos.');
    }
  };

  return {
    eventos,
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
