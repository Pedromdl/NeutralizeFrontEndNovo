import { Edit, Trash2, MoreHorizontal, User, Calendar, Repeat, CheckCircle } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

import UserSearch from '../../components/UserSearch';
import Calendario from './Calendario';
import useFuncaoCalendario from './useFuncaoCalendario';
import '../../components/css/Agendamentos.css';

function Agendamentos() {

  const calendarRef = useRef(null); // 🔹 Referência para o calendário

  const {
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

  } = useFuncaoCalendario(calendarRef);

  return (
    <div className="conteudo">
      <Calendario
        onEventClick={handleClickEvento}
        onDateClick={handleDateClick}
        calendarRef={calendarRef}
      />

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="google-calendar-modal" onClick={e => e.stopPropagation()}>
            {/* Top Bar com ícones */}
            <div className="top-bar">
              <div className="icons">
                <Edit
                  className="icon"
                  title="Editar"
                  onClick={() => {
                    if (eventoSelecionado) {
                      setForm({
                        id: eventoSelecionado.id,
                        paciente: eventoSelecionado.paciente || null,
                        paciente_nome: eventoSelecionado.paciente_nome || '',
                        tipo: eventoSelecionado.tipo || '',
                        status: eventoSelecionado.status?.toLowerCase() || 'pendente',
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
                <Trash2
                  className="icon"
                  title="Excluir"
                  onClick={() => {
                    if (eventoSelecionado?.id) {
                      excluirEvento(eventoSelecionado.id);
                    }
                  }}
                />
                <MoreHorizontal className="icon" title="Mais opções" />
              </div>
            </div>

            {!editando ? (
              <>
                <h3 className="paciente-nome">
                  <User size={16} style={{ marginRight: 6 }} />
                  {form.paciente_nome || eventoSelecionado?.paciente_nome || 'Paciente não definido'}
                </h3>

                <p className="data-hora">
                  <Calendar size={16} style={{ marginRight: 6 }} />
                  {new Date(eventoSelecionado.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{', '}
                  {eventoSelecionado.hora_inicio?.slice(0, 5)} – {eventoSelecionado.hora_fim?.slice(0, 5)}
                </p>

                {eventoSelecionado.repetir && (
                  <p className="recorrencia">
                    <Repeat size={16} style={{ marginRight: 6 }} />
                    {`Repetir: ${eventoSelecionado.frequencia}, ${eventoSelecionado.repeticoes} vezes`}
                  </p>
                )}

                <p className="responsavel">
                  <User size={16} style={{ marginRight: 6 }} />
                  {eventoSelecionado.responsavel}
                </p>

                <p>
                  <CheckCircle size={16} style={{ marginRight: 6 }} />
                  Status: {eventoSelecionado.status}
                </p>
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
                    <select
                      name="status"
                      value={form.status.toLowerCase()}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="realizado">Realizado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
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
