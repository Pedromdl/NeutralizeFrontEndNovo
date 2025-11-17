import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../context/AuthContext"; // contexto de autenticação
import "./TermosUso.css"; // mesmo CSS usado para os cards e markdown

const API_URL = import.meta.env.VITE_API_URL;

export default function PoliticaPrivacidade() {
  const [documento, setDocumento] = useState(null);
  const [aceito, setAceito] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    axios.get(`${API_URL}/api/accounts/documentos/?tipo=politica_privacidade`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const docs = Array.isArray(res.data) ? res.data : res.data.results || [];
      if (docs.length > 0) setDocumento(docs[0]); // pega o mais recente
    })
    .catch((err) => console.error("Erro ao buscar política:", err));
  }, [token]);

  const handleAceite = () => {
    if (!documento || !token) return;

    axios.post(`${API_URL}/api/accounts/documentos/aceitar/`, 
      { documento: documento.id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      setAceito(true);
      alert("Política de privacidade aceita!");
    })
    .catch((err) => {
      console.error("Erro ao aceitar política:", err);
      alert("Não foi possível registrar o aceite.");
    });
  };

  if (!documento) return <p>Carregando política de privacidade...</p>;

  return (
    <div className="card-termos">
      <h2>{documento.titulo} v{documento.versao}</h2>
      <div className="markdown-container">
        <ReactMarkdown>{documento.conteudo}</ReactMarkdown>
      </div>
      <label className="aceite-label">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
        />
        Li e aceito a Política de Privacidade
      </label>
      <button className="aceitar-btn" onClick={handleAceite} disabled={!aceito}>
        Aceitar
      </button>
    </div>
  );
}
