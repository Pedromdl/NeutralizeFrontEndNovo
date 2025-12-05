import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./TermosUso.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AceiteDocumentos() {
  const [termoUso, setTermoUso] = useState(null);
  const [politica, setPolitica] = useState(null);

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Buscar Termos de Uso
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/documentos/?tipo=termo_uso`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const docs = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        if (docs.length > 0) setTermoUso(docs[0]);
      })
      .catch((err) => console.error("Erro ao buscar termos:", err));
  }, [token]);

  // Buscar Política de Privacidade
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/documentos/?tipo=politica_privacidade`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const docs = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        if (docs.length > 0) setPolitica(docs[0]);
      })
      .catch((err) => console.error("Erro ao buscar política:", err));
  }, [token]);

  const handleAceite = async () => {
    if (!termoUso || !politica) return;

    try {
      // Aceitar termos
      await axios.post(
        `${API_URL}/api/documentos/aceitar/`,
        { documento: termoUso.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Aceitar política
      await axios.post(
        `${API_URL}/api/documentos/aceitar/`,
        { documento: politica.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/login"); // redireciona após aceitar
    } catch (err) {
      console.error("Erro ao registrar aceite:", err);
      alert("Não foi possível registrar o aceite dos documentos.");
    }
  };

  if (!termoUso || !politica) return <p>Carregando documentos...</p>;

  return (
    <div className="card-termos">

      <h2>Documentos Obrigatórios</h2>

      {/* Termos de Uso */}
      <h3>{termoUso.titulo} v{termoUso.versao}</h3>
      <div className="markdown-container">
        <ReactMarkdown>{termoUso.conteudo}</ReactMarkdown>
      </div>

      {/* Política de Privacidade */}
      <h3>{politica.titulo} v{politica.versao}</h3>
      <div className="markdown-container">
        <ReactMarkdown>{politica.conteudo}</ReactMarkdown>
      </div>

      {/* CHECKBOXES NO FINAL */}
      <div className="checkbox-container">

        <label className="aceite-label">
          <input
            type="checkbox"
            checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
          />
          Li e aceito os Termos de Uso
        </label>

        <label className="aceite-label">
          <input
            type="checkbox"
            checked={aceitouPrivacidade}
            onChange={(e) => setAceitouPrivacidade(e.target.checked)}
          />
          Li e aceito a Política de Privacidade
        </label>

      </div>

      <button
        className="aceitar-btn"
        onClick={handleAceite}
        disabled={!aceitouTermos || !aceitouPrivacidade}
      >
        Aceitar e Continuar
      </button>

    </div>
  );
}
