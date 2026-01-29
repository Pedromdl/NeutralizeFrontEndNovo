import { useEffect, useState } from "react";
import { formatarData } from "../../utils/dateUtils";
import { diasDesde } from "../../utils/dateUtils";
import axios from "axios";
import ModalKanban from "./ModalKanban";
import "./Kanban.css";
import { Archive } from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL;

const COLUMNS = [
  { key: "ativo", label: "Ativos" },
  { key: "followup", label: "Acompanhamento" },
  { key: "inativo", label: "Inativos" },
];

const STATUS_STYLES = {
  ativo: { label: "Ativo", color: "#16a34a", bg: "#dcfce7" },
  followup: { label: "Acompanhamento", color: "#ca8a04", bg: "#fef9c3" },
  ausente: { label: "Ausente", color: "#ea580c", bg: "#ffedd5" },
  inativo: { label: "Inativo", color: "#dc2626", bg: "#fee2e2" },
};

export default function Kanban() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [acoesPendentes, setAcoesPendentes] = useState([]);
  const [loadingAcoes, setLoadingAcoes] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/contacts/?arquivado=false`)
      .then(res => setContacts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/api/acoes-planejadas/`)
      .then(res => setAcoesPendentes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingAcoes(false));
  }, []);

  const updateStatusLocal = (id, newStatus) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status_relacional: newStatus } : c
      )
    );
    setSelectedContact(null);
  };
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // 👉 NOVA FUNÇÃO: abre o modal a partir do ID do contato
  const handleContextMenu = (e, contact) => {
    e.preventDefault();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      contact,
    });
  };

  const arquivarContato = async () => {
    const contact = contextMenu.contact;

    try {
      await axios.patch(
        `${API_URL}/api/contacts/${contact.id}/`,
        { arquivado: true }
      );

      setContacts(prev =>
        prev.filter(c => c.id !== contact.id)
      );

      setContextMenu(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao arquivar contato");
    }
  };
  const openContactById = (id) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) setSelectedContact(contact);
  };

  const getLabelUltimoContato = (data) => {
    const dias = diasDesde(data);
    if (dias === 0) return "Contato hoje";
    if (dias === 1) return "Contato ontem";
    if (dias > 1) return `${dias} dias sem contato`;
    return "Sem contato";
  };

  const diasAteAcao = (data) => {
    if (!data) return null;
    const hoje = new Date();
    const alvo = new Date(data);
    hoje.setHours(0, 0, 0, 0);
    alvo.setHours(0, 0, 0, 0);
    const diffMs = alvo - hoje;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  const getLabelDiasAteAcao = (data) => {
    const dias = diasAteAcao(data);
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    if (dias > 1) return `Em ${dias} dias`;
    if (dias < 0) return `Atrasada há ${Math.abs(dias)} dias`;
    return "";
  };

  const groupedContacts = COLUMNS.reduce((acc, col) => {
    acc[col.key] = contacts.filter(
      c => c.status_relacional === col.key
    );
    return acc;
  }, {});

  if (loading) return <p>Carregando Kanban...</p>;

  return (
    <>
      <div className="kanban-container">
        {COLUMNS.map(column => (
          <div key={column.key} className="kanban-column">
            <h3>{column.label}</h3>

            <div className="kanban-cards">
              {groupedContacts[column.key]?.map(contact => (
                <div
                  key={contact.id}
                  className="kanban-card"
                  onClick={() => setSelectedContact(contact)}
                  onContextMenu={(e) => handleContextMenu(e, contact)}
                >
                  <div className="kanban-card-header">
                    <div className="kanban-card-name">
                      {contact.name}
                    </div>

                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: STATUS_STYLES[contact.status_relacional]?.bg,
                        color: STATUS_STYLES[contact.status_relacional]?.color,
                      }}
                    >
                      {STATUS_STYLES[contact.status_relacional]?.label}
                    </span>
                  </div>

                  <span className="ultimo-contato">
                    {getLabelUltimoContato(contact.data_ultimo_contato)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AÇÕES PLANEJADAS */}
      <div className="acoes-pendentes-card">
        <h3>Ações planejadas</h3>

        {loadingAcoes ? (
          <p>Carregando ações...</p>
        ) : acoesPendentes.length === 0 ? (
          <p>Nenhuma ação pendente 🎉</p>
        ) : (
          <div className="acoes-tabela">

            <div className="acoes-header">
              <div className="col-contato">Contato</div>
              <div className="col-data">Data planejada</div>
              <div className="col-prazo">Prazo</div>
            </div>

            {acoesPendentes.map(acao => (
              <div key={acao.id} className="acoes-row">

                <div className="col-contato">
                  <strong
                    className="link-contato"
                    onClick={() => openContactById(acao.pessoa)}
                  >
                    {acao.pessoa_name}
                  </strong>
                </div>

                <div className="col-data">
                  {formatarData(acao.data_planejada)}
                </div>

                <div
                  className={`col-prazo ${diasAteAcao(acao.data_planejada) < 0 ? "atrasada" : ""
                    }`}
                >
                  {getLabelDiasAteAcao(acao.data_planejada)}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {selectedContact && (
        <ModalKanban
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusUpdated={updateStatusLocal}
        />
      )}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            onClick={arquivarContato}
          >
            <Archive size={16} />
            <span>Arquivar contato</span>
          </div>
        </div>
      )}
    </>
  );
}
