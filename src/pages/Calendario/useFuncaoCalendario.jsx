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

  // 🔹 Helper para criar objetos Date válidos
  const criarDate = (data, hora) => {
    if (!data || !hora) return null;
    return new Date(`${data}T${hora}`);
  };

  // ✅ Salvar ou editar evento
  const salvarEdicaoMutation = useMutation(
    async (dadosParaEnviar) => {
      if (dadosParaEnviar.id) {
        // Edição
        return axios.patch(
          `${import.meta.env.VITE_API_URL}/api/eventosagenda/${dadosParaEnviar.id}/`,
          dadosParaEnviar
        );
      } else {
        // Novo evento
        const payload = { ...dadosParaEnviar };
        delete payload.id; // 🚫 evita conflito de chave primária
        return axios.post(
          `${import.meta.env.VITE_API_URL}/api/eventosagenda/`,
          payload
        );
      }

    },
    {
      onSuccess: (response, dadosParaEnviar) => {
        fecharModal();

        const calendarApi = calendarRef?.current?.getApi();

        // Corrige caso o backend retorne array
        const novoEvento = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        console.log("✅ Evento criado com sucesso:", novoEvento);

        // Remove evento antigo se estiver editando
        if (dadosParaEnviar.id) {
          const eventoAntigo = calendarApi?.getEventById(dadosParaEnviar.id.toString());
          eventoAntigo?.remove();
        }

        // Adiciona evento visualmente no calendário
        calendarApi?.addEvent({
          id: novoEvento.id,
          title: novoEvento.paciente_nome || 'Horário ocupado',
          start: criarDate(novoEvento.data, novoEvento.hora_inicio),
          end: criarDate(novoEvento.data, novoEvento.hora_fim),
          allDay: false,
          extendedProps: novoEvento,
          backgroundColor:
            novoEvento.status?.toLowerCase() === 'realizado' ? '#b7de42' :
              novoEvento.status?.toLowerCase() === 'confirmado' ? '#25CED1' :
                novoEvento.status?.toLowerCase() === 'cancelado' ? '#FF5C5C' :
                  'grey',
          borderColor: 'transparent',
        });
      },
      onError: (error) => {
        console.error("❌ Erro ao criar evento:", error.response?.data || error.message);
      },
      
    }
  );
// 🔹 Excluir evento
const excluirEventoMutation = useMutation(
  async ({ id, escopo }) => {
    return axios.delete(
      `${import.meta.env.VITE_API_URL}/api/eventosagenda/${id}/`,
      { data: { escopo_exclusao: escopo } } // 🔹 enviar no corpo da requisição
    );
  },
  {
    onSuccess: (_, { id }) => {
      const calendarApi = calendarRef?.current?.getApi();
      const evento = calendarApi?.getEventById(id.toString());
      evento?.remove();
    },
    onError: (error) => {
      console.error("❌ Erro ao excluir evento:", error.response?.data || error.message);
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
  let escopo = "unico";
  if (form.repetir) {
    const escolha = window.prompt(
      "Editar apenas este evento (1), este e os futuros (2), ou todos (3)?"
    );
    if (escolha === "2") escopo = "futuros";
    else if (escolha === "3") escopo = "todos";
  }

  const dadosParaEnviar = {
    ...form,
    paciente: form.paciente ? Number(form.paciente) : null,
    escopo_edicao: escopo,
  };
  salvarEdicaoMutation.mutate(dadosParaEnviar);
};

  const excluirEvento = async (id) => {
  const eventoId = id || eventoSelecionado?.id;
  if (!eventoId) return;

  const escolha = window.prompt(
    "Excluir apenas este evento (1), este e os futuros (2), ou todos (3)?"
  );

  let escopo = "unico";
  if (escolha === "2") escopo = "futuros";
  else if (escolha === "3") escopo = "todos";

  excluirEventoMutation.mutate({ id: eventoId, escopo });
  fecharModal();
};


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'hora_inicio') {
      const [hora, minuto] = value.split(':').map(Number);
      const novaData = new Date();
      novaData.setHours(hora + 1, minuto);
      const novaHoraFim = novaData.toTimeString().slice(0, 5);

      setForm((prev) => ({
        ...prev,
        hora_inicio: value,
        hora_fim: novaHoraFim,
      }));
    } else {
      setForm((prev) => ({
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
