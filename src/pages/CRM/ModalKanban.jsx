import { useEffect, useState } from "react";
import axios from "axios";
import { formatarData } from "../../utils/dateUtils";
import { diasDesde } from "../../utils/dateUtils";
import { Plus, Check, Edit2, Trash2, X } from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
    ativo: { label: "Ativo", color: "#16a34a", bg: "#dcfce7" },
    followup: { label: "Acompanhamento", color: "#ca8a04", bg: "#fef9c3" },
    ausente: { label: "Ausente", color: "#ea580c", bg: "#ffedd5" },
    inativo: { label: "Inativo", color: "#dc2626", bg: "#fee2e2" },
};

const STATUS_OPTIONS = ["ativo", "followup", "inativo"];

export default function ModalKanban({ contact, onClose, onStatusUpdated }) {
    const [abaAtiva, setAbaAtiva] = useState("historico");
    const [interacoes, setInteracoes] = useState([]);
    const [acoesPlanejadas, setAcoesPlanejadas] = useState([]);
    const [loading, setLoading] = useState(false);

    /* =============================
       PLANEJAR AÇÃO
    ============================== */
    const [acaoPlanejando, setAcaoPlanejando] = useState(false);
    const [acaoForm, setAcaoForm] = useState({
        tipo: "mensagem",
        descricao: "",
        data_planejada: "",
    });

    /* =============================
       EDITAR AÇÃO
    ============================== */
    const [acaoEditando, setAcaoEditando] = useState(null);
    const [acaoEditForm, setAcaoEditForm] = useState({
        tipo: "",
        descricao: "",
        data_planejada: "",
    });

    /* =============================
       CONCLUIR AÇÃO
    ============================== */
    const [acaoConcluindo, setAcaoConcluindo] = useState(null);
    const [descricaoConclusao, setDescricaoConclusao] = useState("");
    const [loadingConclusao, setLoadingConclusao] = useState(false);

    /* =============================
       FETCH
    ============================== */
    useEffect(() => {
        if (abaAtiva === "historico") fetchInteracoes();
        if (abaAtiva === "acoes") fetchAcoesPlanejadas();
    }, [abaAtiva]);

    const fetchInteracoes = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}/api/contacts/${contact.id}/interacoes/`
            );
            setInteracoes(res.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchAcoesPlanejadas = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}/api/acoes-planejadas/?pessoa=${contact.id}`
            );
            setAcoesPlanejadas(res.data);
        } finally {
            setLoading(false);
        }
    };

    /* =============================
       ACTIONS
    ============================== */
    const criarAcaoPlanejada = async () => {
        if (!acaoForm.descricao || !acaoForm.data_planejada) {
            alert("Preencha todos os campos.");
            return;
        }

        await axios.post(`${API_URL}/api/acoes-planejadas/`, {
            ...acaoForm,
            pessoa: contact.id,
        });

        setAcaoPlanejando(false);
        setAcaoForm({ tipo: "mensagem", descricao: "", data_planejada: "" });
        fetchAcoesPlanejadas();
    };

    const concluirAcao = async () => {
        if (!descricaoConclusao.trim()) return;

        try {
            setLoadingConclusao(true);
            await axios.patch(
                `${API_URL}/api/acoes-planejadas/${acaoConcluindo}/concluir/`,
                { descricao: descricaoConclusao }
            );
            setAcaoConcluindo(null);
            setDescricaoConclusao("");
            fetchAcoesPlanejadas();
            fetchInteracoes();
        } finally {
            setLoadingConclusao(false);
        }
    };

    const excluirAcao = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta ação?")) return;
        await axios.delete(`${API_URL}/api/acoes-planejadas/${id}/`);
        fetchAcoesPlanejadas();
    };

    const iniciarEdicao = (acao) => {
        setAcaoEditando(acao.id);
        setAcaoEditForm({
            tipo: acao.tipo,
            descricao: acao.descricao,
            data_planejada: acao.data_planejada.slice(0, 16),
        });
    };

    const salvarEdicao = async (id) => {
        await axios.patch(`${API_URL}/api/acoes-planejadas/${id}/`, acaoEditForm);
        setAcaoEditando(null);
        fetchAcoesPlanejadas();
    };

    const updateStatus = async (status) => {
        await axios.patch(
            `${API_URL}/api/contacts/${contact.id}/status/`,
            { status_relacional: status }
        );
        onStatusUpdated(contact.id, status);
    };

    const getLabelUltimoContato = (data) => {
        const dias = diasDesde(data);

        if (dias === 0) return "Contato hoje";
        if (dias === 1) return "Contato ontem";
        if (dias > 1) return `${dias} dias sem contato`;

        return "Sem contato";
    };

    /* =============================
       RENDER
    ============================== */
    return (
        <div className="modal-overlay" onClick={onClose}>
<div
  className={`modal ${acaoPlanejando || acaoConcluindo ? "push" : ""}`}
  onClick={(e) => e.stopPropagation()}
>                <h2>{contact.name}</h2>
                                                    <div className="modal-close" onClick={onClose}>
                    <X size={24} />
                </div>

                <span
                    className="modal-status"
                    style={{
                        backgroundColor: STATUS_STYLES[contact.status_relacional]?.bg,
                        color: STATUS_STYLES[contact.status_relacional]?.color,
                    }}
                >
                    {STATUS_STYLES[contact.status_relacional]?.label}
                </span>

                <div className="modal-section">
                    {contact.phone && <p><strong>Telefone:</strong> {contact.phone}</p>}
                    {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
                    {contact.data_ultimo_contato && (
                        <p><strong>Último contato:</strong>{" "}
                            {formatarData(contact.data_ultimo_contato)}</p>
                    )}
                    <span className="ultimo-contato">
                        {getLabelUltimoContato(contact.data_ultimo_contato)}
                    </span>
                </div>

                <div className="modal-section">
                    <h4>Mudar status</h4>
                    <div className="modal-actions">
                        {STATUS_OPTIONS.filter(s => s !== contact.status_relacional)
                            .map(status => (
                                <button
                                    key={status}
                                    className="status-button"
                                    style={{
                                        backgroundColor: STATUS_STYLES[status].bg,
                                        color: STATUS_STYLES[status].color,
                                    }}
                                    onClick={() => updateStatus(status)}
                                >
                                    {STATUS_STYLES[status].label}
                                </button>
                            ))}
                    </div>
                </div>

                {/* ABAS E CONTEÚDO */}
                <div className="modal-tabs-container">
                    <div className="modal-tabs">
                        <button
                            onClick={() => setAbaAtiva("historico")}
                            className={abaAtiva === "historico" ? "active" : ""}
                        >
                            Histórico
                        </button>
                        <button
                            onClick={() => setAbaAtiva("acoes")}
                            className={abaAtiva === "acoes" ? "active" : ""}
                        >
                            Ações Planejadas
                        </button>
                    </div>

                    <div className="modal-tab-content">
                        {abaAtiva === "historico" && (
                            interacoes.length ? (
                                <ul className="historico-lista">
                                    {interacoes.map(i => (
                                        <li key={i.id} className="historico-item">
                                            <div className="historico-data">{i.data_formatada}</div>
                                            <div className="historico-conteudo">
                                                <strong>{i.tipo_label}</strong>
                                                <p>{i.descricao}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Nenhuma interação registrada.</p>
                            )
                        )}

                        {abaAtiva === "acoes" && (
                            <>
                                <button
                                    className="acao-planejada-btn"
                                    onClick={() => setAcaoPlanejando(true)}
                                >
                                    <Plus size={16} />  Planejar ação
                                </button>

                                {acoesPlanejadas.map(a => (
                                    <div key={a.id} className="acao-item">
                                        <div className="acao-header">
                                            <strong>{a.tipo_label || a.tipo}</strong>
                                            <div className="acao-form-actions">
                                                <div onClick={() => setAcaoConcluindo(a.id)}>
                                                    <Check size={23} />
                                                </div>
                                                <div onClick={() => iniciarEdicao(a)}>
                                                    <Edit2 size={23} />
                                                </div>
                                                <div onClick={() => excluirAcao(a.id)}>
                                                    <Trash2 size={23} />
                                                </div>
                                            </div>
                                        </div>
                                        <p>{a.descricao}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* MODAL LATERAL – CRIAR / EDITAR AÇÃO */}
            {(acaoPlanejando || acaoEditando) && (
                <div className="modal-lateral" onClick={(e) => e.stopPropagation()}>
                    <h3>{acaoEditando ? "Editar ação" : "Planejar ação"}</h3>
                    <select
                        value={acaoEditando ? acaoEditForm.tipo : acaoForm.tipo}
                        onChange={(e) => {
                            if (acaoEditando) {
                                setAcaoEditForm({ ...acaoEditForm, tipo: e.target.value });
                            } else {
                                setAcaoForm({ ...acaoForm, tipo: e.target.value });
                            }
                        }}
                    >
                        <option value="mensagem">Mensagem</option>
                        <option value="ligacao">Ligação</option>
                        <option value="retorno">Retorno</option>
                        <option value="avaliacao">Avaliação</option>
                    </select>

                    <textarea
                        placeholder="Informe qual foi a conclusão da sua ação: Qual foi a resposta do cliente, próximos passos ou ações"
                        value={acaoEditando ? acaoEditForm.descricao : acaoForm.descricao}
                        onChange={(e) => {
                            if (acaoEditando) {
                                setAcaoEditForm({ ...acaoEditForm, descricao: e.target.value });
                            } else {
                                setAcaoForm({ ...acaoForm, descricao: e.target.value });
                            }
                        }}
                    />

                    <input
                        type="date"
                        value={
                            acaoEditando
                                ? acaoEditForm.data_planejada.slice(0, 10)
                                : acaoForm.data_planejada
                        }
                        onChange={(e) => {
                            if (acaoEditando) {
                                setAcaoEditForm({ ...acaoEditForm, data_planejada: e.target.value });
                            } else {
                                setAcaoForm({ ...acaoForm, data_planejada: e.target.value });
                            }
                        }}
                    />

                    <button
                        onClick={() => {
                            if (acaoEditando) salvarEdicao(acaoEditando);
                            else criarAcaoPlanejada();
                        }}
                    >
                        {acaoEditando ? "Salvar edição" : "Salvar ação"}
                    </button>
                    <button
                        onClick={() => {
                            if (acaoEditando) setAcaoEditando(null);
                            else setAcaoPlanejando(false);
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {/* MODAL LATERAL – CONCLUIR */}
            {acaoConcluindo && (
                <div className="modal-lateral" onClick={(e) => e.stopPropagation()}>
                    <h3>Concluir ação</h3>
                    <textarea
                        placeholder="Descrição da conclusão"
                        value={descricaoConclusao}
                        onChange={(e) => setDescricaoConclusao(e.target.value)}
                    />
                    <button onClick={concluirAcao} disabled={loadingConclusao}>
                        {loadingConclusao ? "Salvando..." : "Confirmar"}
                    </button>
                    <button onClick={() => setAcaoConcluindo(null)}>Cancelar</button>
                </div>
            )}
        </div>
    );
}
