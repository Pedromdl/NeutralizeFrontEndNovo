import { useEffect, useMemo, useState } from "react";
import { Archive, ArchiveRestore, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";



const API_URL = import.meta.env.VITE_API_URL;

export default function CRM() {
  const [googleContacts, setGoogleContacts] = useState([]);
  const [dbContacts, setDbContacts] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mostrarArquivados, setMostrarArquivados] = useState(false);
  const [menuContexto, setMenuContexto] = useState(null);

  // 👇 NOVO: controle de qual card aparece
  const [visaoAtiva, setVisaoAtiva] = useState("sistema"); // "sistema" | "google"

  const navigate = useNavigate();


  /* ==============================
     📞 NORMALIZAR TELEFONE
  ============================== */
  const normalizePhone = (phone) => {
    if (!phone) return null;
    return phone.replace(/\D/g, "");
  };

  /* ==============================
     🔄 CONTATOS GOOGLE
  ============================== */
  const fetchGoogleContacts = async (pageToken = null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url = new URL(`${API_URL}/api/google/contacts/list/`);
      if (pageToken) url.searchParams.append("page_token", pageToken);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar contatos do Google");

      const data = await response.json();

      setGoogleContacts((prev) => {
        const map = new Map();

        [...prev, ...(data.connections || [])].forEach((contact) => {
          const rawPhone = contact.phoneNumbers?.[0]?.value;
          const phone = normalizePhone(rawPhone);
          if (!phone) return;
          if (!map.has(phone)) map.set(phone, contact);
        });

        return Array.from(map.values());
      });

      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     🔄 CONTATOS DO BANCO
  ============================== */
  const fetchDbContacts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar contatos");

      const data = await response.json();
      setDbContacts(data.results ?? data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ==============================
     🔁 SINCRONIZAR GOOGLE → BANCO
  ============================== */
  const syncGoogleContacts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/contacts/import/google/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchDbContacts();

    const data = await res.json();
    alert(`Novos: ${data.imported}\nAtualizados: ${data.updated}`);
  };

  /* ==============================
     🧠 SET DE TELEFONES DO BANCO
  ============================== */
  const dbPhonesSet = useMemo(() => {
    return new Set(
      dbContacts.map((c) => normalizePhone(c.phone)).filter(Boolean)
    );
  }, [dbContacts]);

  /* ==============================
     🔍 FILTRO ARQUIVADOS
  ============================== */
  const contatosFiltrados = useMemo(() => {
    return dbContacts.filter((c) =>
      mostrarArquivados ? c.arquivado : !c.arquivado
    );
  }, [dbContacts, mostrarArquivados]);

  /* ==============================
     ⛔ FECHAR MENU AO CLICAR FORA
  ============================== */
  useEffect(() => {
    const close = () => setMenuContexto(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    fetchGoogleContacts();
    fetchDbContacts();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div style={container}>
      <h1>CRM</h1>

      {/* ==============================
         🔀 TOGGLE DE VISÃO
      ============================== */}
<div className="contacts-header">
  {/* TOGGLE */}
  <div className="contacts-toggle">
    <button
      onClick={() => setVisaoAtiva("sistema")}
      className={visaoAtiva === "sistema" ? "active" : ""}
      title="Ver contatos do sistema"
    >
      📁 Sistema
    </button>

    <button
      onClick={() => setVisaoAtiva("google")}
      className={visaoAtiva === "google" ? "active" : ""}
      title="Ver contatos do Google"
    >
      ☁️ Google
    </button>

          {/* BOTÃO KANBAN */}
  <button
    className="kanban-button"
    onClick={() => navigate("/kanban")}
    title="Abrir Painel de Gerenciamento de Pacientes"
  >
    <LayoutGrid size={18} />
    Painel
  </button>

  </div>
  


</div>

      {/* ==============================
          📁 CONTATOS DO SISTEMA
      ============================== */}
      {visaoAtiva === "sistema" && (
        <>

          <div style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h3 style={cardTitle}>Contatos do Sistema</h3>

              <button
                onClick={() => setMostrarArquivados(prev => !prev)}
                title={
                  mostrarArquivados
                    ? "Mostrar contatos ativos"
                    : "Mostrar contatos arquivados"
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: mostrarArquivados ? "#991b1b" : "#374151",
                }}
              >
                {mostrarArquivados ? (
                  <ArchiveRestore size={18} />
                ) : (
                  <Archive size={18} />
                )}
                <span style={{ fontSize: 13 }}>
                  {mostrarArquivados ? "Arquivados" : "Ativos"}
                </span>
              </button>
            </div>

            <div style={list}>
              {contatosFiltrados.length === 0 && (
                <p style={empty}>Nenhum contato</p>
              )}

              {contatosFiltrados.map((contact) => (
                <div
                  key={contact.id}
                  style={itemInline}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenuContexto({
                      x: e.clientX,
                      y: e.clientY,
                      contact,
                    });
                  }}
                >
                  <span style={phoneStyle}>{contact.phone}</span>
                  <span style={nameStyle}>{contact.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ==============================
          ☁️ CONTATOS GOOGLE
      ============================== */}
      {visaoAtiva === "google" && (
        <div style={card}>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h3 style={cardTitle}>Contatos do Google</h3>

            <button
              onClick={syncGoogleContacts}
              title="Sincronizar contatos do Google com o Banco de Dados"
              disabled={loading}
              style={{
                border: "none",
                background: "transparent",
                cursor: loading ? "not-allowed" : "pointer",
                padding: 6,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <RefreshCw
                size={18}
                style={{
                  animation: loading ? "spin 1s linear infinite" : "none",
                }}
              />
            </button>
          </div>


          <div style={list}>
            {googleContacts.map((contact, index) => {
              const rawPhone =
                contact.phoneNumbers?.[0]?.value || "Sem telefone";
              const phone = normalizePhone(rawPhone);
              const imported = phone && dbPhonesSet.has(phone);

              return (
                <div key={index} style={itemInline}>
                  <div
                    style={{
                      ...statusDot,
                      background: imported ? "#22c55e" : "#e5e7eb",
                    }}
                  />
                  <span style={phoneStyle}>{rawPhone}</span>
                  <span style={nameStyle}>
                    {contact.names?.[0]?.displayName || "Sem nome"}
                  </span>
                </div>
              );
            })}
          </div>

          {nextPageToken && (
            <button
              onClick={() => fetchGoogleContacts(nextPageToken)}
              disabled={loading}
              style={button}
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          )}
        </div>
      )}

      {/* ==============================
          📌 MENU CONTEXTUAL
      ============================== */}
      {menuContexto && (
        <div
          style={{
            position: "fixed",
            top: menuContexto.y,
            left: menuContexto.x,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: 6,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              cursor: "pointer",
            }}
            onClick={async () => {
              const token = localStorage.getItem("token");
              const novoEstado = !menuContexto.contact.arquivado;

              await fetch(`${API_URL}/api/contacts/${menuContexto.contact.id}/`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ arquivado: novoEstado }),
              });

              setDbContacts((prev) =>
                prev.map((c) =>
                  c.id === menuContexto.contact.id
                    ? { ...c, arquivado: novoEstado }
                    : c
                )
              );

              setMenuContexto(null);
            }}
          >
            {menuContexto.contact.arquivado ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}
            <span>
              {menuContexto.contact.arquivado
                ? "Desarquivar contato"
                : "Arquivar contato"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==============================
   🎨 STYLES
============================== */

const container = { padding: 24 };

const toggleBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
  border: "none",
};

const card = {
  background: "#fff",
  borderRadius: 12,
  padding: 16,
  marginBottom: 24,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const cardTitle = { marginBottom: 12 };

const list = {
  maxHeight: 650,
  overflowY: "auto",
  borderTop: "1px solid #eee",
  paddingTop: 8,
};

const itemInline = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 8px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: 14,
};

const statusDot = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  flexShrink: 0,
};

const phoneStyle = {
  fontWeight: 600,
  color: "#111",
  whiteSpace: "nowrap",
};

const nameStyle = {
  color: "#555",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const empty = {
  textAlign: "center",
  color: "#999",
  marginTop: 24,
};

const button = {
  marginTop: 12,
  padding: "10px",
  cursor: "pointer",
};
