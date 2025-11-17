import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./DocumentosModal.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AceiteDocumentos() {
  const [termoUso, setTermoUso] = useState(null);
  const [politica, setPolitica] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [tab, setTab] = useState("termos");
  
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [aceitouPolitica, setAceitouPolitica] = useState(false);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Buscar documentos
  useEffect(() => {
    if (!token) return;

    axios.get(`${API_URL}/api/accounts/documentos/?tipo=termo_uso`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const docs = Array.isArray(res.data) ? res.data : res.data.results || [];
      if (docs.length > 0) setTermoUso(docs[0]);
    });

    axios.get(`${API_URL}/api/accounts/documentos/?tipo=politica_privacidade`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const docs = Array.isArray(res.data) ? res.data : res.data.results || [];
      if (docs.length > 0) setPolitica(docs[0]);
    });

  }, [token]);

  const handleAceite = async () => {
    try {
      await axios.post(
        `${API_URL}/api/accounts/documentos/aceitar/`,
        { documento: termoUso.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${API_URL}/api/accounts/documentos/aceitar/`,
        { documento: politica.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalAberto(false);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Erro ao registrar aceite.");
    }
  };

  if (!termoUso || !politica) return <p>Carregando...</p>;

  return (
    <div className="aceite-page">

      <h2>Para continuar, aceite os documentos obrigatórios</h2>
      <button className="abrir-modal-btn" onClick={() => setModalAberto(true)}>
        Ler e Aceitar
      </button>

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-overlay">

          <div className="modal-box">
            
            {/* Header */}
            <div className="modal-termos-header">
              <h3>Documentos Obrigatórios</h3>
              <button className="fechar" onClick={() => setModalAberto(false)}>✖</button>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button 
                className={tab === "termos" ? "active" : ""}
                onClick={() => setTab("termos")}
              >
                Termos de Uso
              </button>

              <button 
                className={tab === "politica" ? "active" : ""}
                onClick={() => setTab("politica")}
              >
                Política de Privacidade
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="conteudo-scroll">
              {tab === "termos" ? (
                <ReactMarkdown>{termoUso.conteudo}</ReactMarkdown>
              ) : (
                <ReactMarkdown>{politica.conteudo}</ReactMarkdown>
              )}
            </div>

            {/* Checkboxes */}
            <div className="checkbox-area">
              <label>
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                />
                Aceito os Termos de Uso
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={aceitouPolitica}
                  onChange={(e) => setAceitouPolitica(e.target.checked)}
                />
                Aceito a Política de Privacidade
              </label>
            </div>

            {/* Botão final */}
            <button 
              className="aceitar-termos-btn"
              disabled={!aceitouTermos || !aceitouPolitica}
              onClick={handleAceite}
            >
              Aceitar e Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
