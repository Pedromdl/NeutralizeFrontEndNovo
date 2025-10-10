import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "../components/css/Financeiro.css";

function Financeiro() {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionados, setSelecionados] = useState([]);
  const [filtros, setFiltros] = useState({
    paciente: "",
    data: "",
    tipo_servico: "",
    valor: "",
    status_pagamento: "",
    status_nf: "",
  });

  useEffect(() => {
    buscarLancamentos();
  }, []);

  const buscarLancamentos = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/financeiro/`
      );
      setLancamentos(data.results || data);
    } catch (error) {
      console.error("Erro ao buscar lançamentos financeiros", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarLancamento = async (id, campo, valor) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/financeiro/${id}/`, {
        [campo]: valor,
      });

      setLancamentos((prev) =>
        prev.map((lan) =>
          lan.id === id ? { ...lan, [campo]: valor } : lan
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar lançamento", error);
    }
  };

  const toggleSelecionado = (id) => {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  const toggleSelecionarTodos = () => {
    if (selecionados.length === lancamentos.length) {
      setSelecionados([]);
    } else {
      setSelecionados(lancamentos.map((lan) => lan.id));
    }
  };

  const statusPagamentoOptions = [
    { value: "pendente", label: "Pendente", color: "#0a53a8" },
    { value: "recebido", label: "Recebido", color: "#11734b" },
  ];

  const statusNfOptions = [
    { value: "nao_emitida", label: "Não emitida", color: "#b10202" },
    { value: "emitida", label: "Emitida", color: "#11734b" },
  ];

  const customStyles = (campo, valorSelecionado) => ({
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#ddd",
      minHeight: "36px",
      backgroundColor:
        campo === "status_pagamento"
          ? valorSelecionado === "recebido"
            ? "#11734b"
            : "#0a53a8"
          : campo === "status_nf"
          ? valorSelecionado === "emitida"
            ? "#11734b"
            : "#b10202"
          : "#fff",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#edecea",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? state.value === "recebido"
          ? "#28a74540"
          : state.value === "pendente"
          ? "#FF5C5C40"
          : state.value === "emitida"
          ? "#25CED140"
          : "#D3D3D340"
        : state.isFocused
        ? "#f0f0f0"
        : "#fff",
      color: "#000",
    }),
  });

  const aplicarEmLote = (campo, valor) => {
    selecionados.forEach((id) => atualizarLancamento(id, campo, valor));
  };

  const filtrarLancamentos = () => {
    return lancamentos.filter((lan) => {
      return (
        lan.paciente_nome.toLowerCase().includes(filtros.paciente.toLowerCase()) &&
        lan.tipo_servico.toLowerCase().includes(filtros.tipo_servico.toLowerCase()) &&
        (filtros.data === "" || new Date(lan.data_evento).toLocaleDateString("pt-BR").includes(filtros.data)) &&
        (filtros.valor === "" || lan.valor.toString().includes(filtros.valor)) &&
        (filtros.status_pagamento === "" || lan.status_pagamento === filtros.status_pagamento) &&
        (filtros.status_nf === "" || lan.status_nf === filtros.status_nf)
      );
    });
  };

  return (
    <div className="conteudo">
      <h2>Lançamentos Financeiros</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {selecionados.length > 0 && (
            <div className="acoes-lote">
              <strong>Altere todos os dados de uma vez ({selecionados.length}):</strong>
              <div className="botoes-lote">
                {statusPagamentoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => aplicarEmLote("status_pagamento", opt.value)}
                    style={{ backgroundColor: opt.color, color: "#fff", marginRight: "5px" }}
                  >
                    {opt.label}
                  </button>
                ))}
                {statusNfOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => aplicarEmLote("status_nf", opt.value)}
                    style={{ backgroundColor: opt.color, color: "#fff", marginRight: "5px" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <table className="financeiro-tabela">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selecionados.length === lancamentos.length}
                    onChange={toggleSelecionarTodos}
                  />
                </th>
                <th>
                  Paciente
                  <input
                    type="text"
                    value={filtros.paciente}
                    onChange={(e) => setFiltros({ ...filtros, paciente: e.target.value })}
                    placeholder="Filtrar paciente"
                    className="filtro-texto"
                  />
                </th>
                <th>
                  Data
                  <input
                    type="text"
                    value={filtros.data}
                    onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
                    placeholder="dd/mm/aaaa"
                    className="filtro-texto"
                  />
                </th>
                <th>
                  Serviço
                  <input
                    type="text"
                    value={filtros.tipo_servico}
                    onChange={(e) => setFiltros({ ...filtros, tipo_servico: e.target.value })}
                    placeholder="Filtrar serviço"
                    className="filtro-texto"
                  />
                </th>
                <th>
                  Valor
                  <input
                    type="text"
                    value={filtros.valor}
                    onChange={(e) => setFiltros({ ...filtros, valor: e.target.value })}
                    placeholder="R$"
                    className="filtro-texto"
                  />
                </th>
                <th>
                  Status Pagamento
                  <select
                    value={filtros.status_pagamento}
                    onChange={(e) => setFiltros({ ...filtros, status_pagamento: e.target.value })}
                    className="filtro-select"
                    style={{ backgroundColor: filtros.status_pagamento ? statusPagamentoOptions.find(o => o.value === filtros.status_pagamento)?.color : "#fff", color: filtros.status_pagamento ? "#fff" : "#000" }}
                  >
                    <option value="">Todos</option>
                    {statusPagamentoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </th>
                <th>
                  Nota Fiscal
                  <select
                    value={filtros.status_nf}
                    onChange={(e) => setFiltros({ ...filtros, status_nf: e.target.value })}
                    className="filtro-select"
                    style={{ backgroundColor: filtros.status_nf ? statusNfOptions.find(o => o.value === filtros.status_nf)?.color : "#fff", color: filtros.status_nf ? "#fff" : "#000" }}
                  >
                    <option value="">Todos</option>
                    {statusNfOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrarLancamentos().map((lan) => (
                <tr key={lan.id} className={selecionados.includes(lan.id) ? "selecionado" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selecionados.includes(lan.id)}
                      onChange={() => toggleSelecionado(lan.id)}
                    />
                  </td>
                  <td>{lan.paciente_nome}</td>
                  <td>{new Date(lan.data_evento).toLocaleDateString("pt-BR")}</td>
                  <td>{lan.tipo_servico}</td>
                  <td>R$ {parseFloat(lan.valor).toFixed(2)}</td>
                  <td>
                    <Select
                      options={statusPagamentoOptions}
                      value={statusPagamentoOptions.find(
                        (o) => o.value === lan.status_pagamento
                      )}
                      onChange={(selected) =>
                        atualizarLancamento(lan.id, "status_pagamento", selected.value)
                      }
                      styles={customStyles("status_pagamento", lan.status_pagamento)}
                      menuPortalTarget={document.body}
                      menuPosition="absolute"
                      menuPlacement="auto"
                    />
                  </td>
                  <td>
                    <Select
                      value={statusNfOptions.find((o) => o.value === lan.status_nf)}
                      onChange={(option) =>
                        atualizarLancamento(lan.id, "status_nf", option.value)
                      }
                      options={statusNfOptions}
                      styles={customStyles("status_nf", lan.status_nf)}
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      menuPosition="absolute"
                      menuPlacement="auto"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Financeiro;
