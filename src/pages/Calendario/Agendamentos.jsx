import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import UserSearch from '../../components/UserSearch';
import Calendario from './Calendario';
import useFuncaoCalendario from './useFuncaoCalendario';
import '../../components/css/Agendamentos.css';

function Agendamentos() {
  const {
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
  } = useFuncaoCalendario();

  return (
    <div className="conteudo">
      <Calendario
        eventos={eventos}
        onEventClick={handleClickEvento}
        onDateClick={handleDateClick}
      />

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
                        id: eventoSelecionado.id,
                        paciente: eventoSelecionado.paciente || null,
                        paciente_nome: eventoSelecionado.paciente_nome || '',
                        tipo: eventoSelecionado.tipo || '',
                        status: eventoSelecionado.status || 'Pendente',
                        data: eventoSelecionado.data || '',
                        hora_inicio: eventoSelecionado.hora_inicio || '',
                        hora_fim: eventoSelecionado.hora_fim || '',
                        repetir: eventoSelecionado.repetir || false,
                        frequencia: eventoSelecionado.frequencia || 'nenhuma',
                        repeticoes: eventoSelecionado.repeticoes || 0,
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
                <h3 className="paciente-nome">{`Paciente: ${form.paciente_nome || eventoSelecionado?.paciente_nome || 'Não definido'}`}</h3>
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

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>
                      <input
                        type="checkbox"
                        name="repetir"
                        checked={form.repetir}
                        onChange={e => setForm(prev => ({ ...prev, repetir: e.target.checked }))}
                      />
                      Repetir evento
                    </label>
                  </div>

                  {form.repetir && (
                    <>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Frequência</label>
                        <select
                          name="frequencia"
                          value={form.frequencia}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="nenhuma">Nenhuma</option>
                          <option value="diario">Diário</option>
                          <option value="semanal">Semanal</option>
                          <option value="mensal">Mensal</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Repetições</label>
                        <input
                          type="number"
                          min="1"
                          name="repeticoes"
                          value={form.repeticoes}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button className="btn btn-save" onClick={salvarEdicao}>Salvar</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Agendamentos;
