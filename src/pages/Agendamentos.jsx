import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import UserSearch from '../components/UserSearch'; // ajuste o caminho conforme seu projeto
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Card from '../components/Card';
import '../components/css/Agendamentos.css';
import axios from 'axios';

function Agendamentos() {
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
    recorrencia: '',
    responsavel: '',
  });

  useEffect(() => {
    async function buscarEventos() {
      try {
        console.log("Dados enviados:", form);

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
    console.log('eventoSelecionado:', info.event.extendedProps); // <-- Aqui

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
      recorrencia: info.event.extendedProps.recorrencia || '',
      responsavel: info.event.extendedProps.responsavel || '',
    });
    setEditando(false);
    setModalAberto(true);
    setEventoSelecionado(info.event.extendedProps);

  };

  const handleDateClick = (info) => {
    const data = info.dateStr.split('T')[0];
    const hora_inicio = info.dateStr.split('T')[1]?.slice(0, 5) || '08:00';

    setForm({
      id: null, // <- Adiciona isso
      paciente: null,
      paciente_nome: '',
      tipo: '',
      status: 'Pendente',
      data,
      hora_inicio,
      hora_fim: '',
      recorrencia: '',
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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const salvarEdicao = async () => {
    console.log('salvarEdicao chamado');
    console.log('form completo:', form);
    console.log('form.id:', form.id);

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
        // CRIAR NOVO
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
              paciente_nome: form.paciente_nome, // ✅ Adiciona o nome manualmente aqui
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

  return (
    <div className="conteudo">
      <Card title="Agenda Geral" size="lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotDuration="01:00:00"        // linhas sólidas a cada 1 hora, sem subdivisões
          slotLabelInterval="01:00"      // labels a cada 1 hora
          slotMinTime="06:00:00"         // início às 6h
          slotMaxTime="24:00:00"         // fim à meia-noite
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          locale="pt-br"
          events={eventos}
          eventClick={handleClickEvento}
          dateClick={handleDateClick}
          height="auto"
        />
      </Card>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="google-calendar-modal" onClick={e => e.stopPropagation()}>
            <div className="top-bar">
              <div className="icons">
                <FaEdit
                  className="icon"
                  title="Editar"
                  onClick={() => {
                    if (eventoSelecionado) {
                      setForm({
                        id: eventoSelecionado.id, // <== essencial para edição funcionar
                        paciente: eventoSelecionado.paciente || null,
                        paciente_nome: eventoSelecionado.paciente_nome || '',
                        tipo: eventoSelecionado.tipo || '',
                        status: eventoSelecionado.status || 'Pendente',
                        data: eventoSelecionado.data || '',
                        hora_inicio: eventoSelecionado.hora_inicio || '',
                        hora_fim: eventoSelecionado.hora_fim || '',
                        recorrencia: eventoSelecionado.recorrencia || '',
                        responsavel: eventoSelecionado.responsavel || '',
                      });
                      setEditando(true);
                    }
                  }}
                />
                <FaTrash
                  className="icon"
                  title="Excluir"
                  onClick={() => {
                    if (eventoSelecionado?.id) {
                      excluirEvento(eventoSelecionado.id);
                    }
                  }}
                />
                <FaEllipsisV className="icon" title="Mais opções" />
              </div>
            </div>

            {!editando ? (
              <>
                {/* visualização do evento */}
                <h3 className="paciente-nome">  {`Paciente: ${form.paciente_nome || eventoSelecionado?.paciente_nome || 'Não definido'}`}</h3>
                <p className="data-hora">
                  {new Date(eventoSelecionado.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{', '}
                  {eventoSelecionado.hora_inicio} – {eventoSelecionado.hora_fim}
                </p>
                {eventoSelecionado.repetir && (
                  <p className="recorrencia">{`Repetir: ${eventoSelecionado.frequencia}, ${eventoSelecionado.repeticoes} vezes`}</p>
                )}
                <p className="responsavel">👤 {eventoSelecionado.responsavel}</p>
              </>
            ) : (
              <>
                {/* formulário de edição/criação */}
                <h3>{eventoSelecionado ? 'Editar Evento' : 'Criar Evento'}</h3>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Paciente</label>
                    <UserSearch
                      modoModal={true}
                      valorInicial={form.paciente_nome}
                      onSelect={(usuario) => {
                        setForm(prev => ({
                          ...prev,
                          paciente: usuario.id,
                          paciente_nome: usuario.nome,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo</label>
                    <input
                      type="text"
                      name="tipo"
                      value={form.tipo}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <input
                      type="text"
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Data</label>
                    <input
                      type="date"
                      name="data"
                      value={form.data}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Início</label>
                    <input
                      type="time"
                      name="hora_inicio"
                      value={form.hora_inicio}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fim</label>
                    <input
                      type="time"
                      name="hora_fim"
                      value={form.hora_fim}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Responsável</label>
                    <input
                      type="text"
                      name="responsavel"
                      value={form.responsavel}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <button className="btn btn-save" onClick={salvarEdicao}>Salvar</button>
                <button className="btn btn-cancel" onClick={() => setEditando(false)}>Cancelar</button>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Agendamentos;
