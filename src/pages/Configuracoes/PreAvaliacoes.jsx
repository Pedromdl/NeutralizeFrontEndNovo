import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import Select from "react-select";
import Card from "../../components/Card";
import { ArrowLeft, Save, Trash2, Plus, Search } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import "./PreAvaliacoes.css";

export default function PreAvaliacoes() {
  const navigate = useNavigate();

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Buscar pré-avaliações
  const buscarAvaliacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/preavaliacao/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setAvaliacoes(res.data);
    } catch (err) {
      console.error("Erro ao buscar pré-avaliações:", err);
      setErro("Não foi possível carregar as pré-avaliações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarAvaliacoes();
  }, []);

  // Selecionar avaliação
  const selecionarAvaliacao = (avaliacao) => {
    setAvaliacaoSelecionada(avaliacao);
    setTitulo(avaliacao?.titulo || "");
    setConteudo(avaliacao?.texto || "");
    setModoEdicao(!!avaliacao);
  };

  // Nova avaliação
  const novaAvaliacao = () => {
    setAvaliacaoSelecionada(null);
    setTitulo("");
    setConteudo("");
    setModoEdicao(true);
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setAvaliacaoSelecionada(null);
    setTitulo("");
    setConteudo("");
    setModoEdicao(false);
  };

  // Criar ou atualizar
  const salvarAvaliacao = async () => {
    if (!titulo.trim()) {
      alert("O título é obrigatório.");
      return;
    }

    try {
      const url = avaliacaoSelecionada
        ? `${API_URL}/api/preavaliacao/${avaliacaoSelecionada.id}/`
        : `${API_URL}/api/preavaliacao/`;

      const method = avaliacaoSelecionada ? "patch" : "post";

      await axios({
        method,
        url,
        data: { titulo, texto: conteudo },
      });

      alert("Pré-avaliação salva com sucesso!");
      cancelarEdicao();
      await buscarAvaliacoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar: " + (err.response?.data?.detail || err.message));
    }
  };

  // Excluir avaliação
  const excluirAvaliacao = async () => {
    if (!avaliacaoSelecionada) return;
    if (!window.confirm("Deseja realmente excluir esta pré-avaliação?")) return;

    try {
      await axios.delete(
        `${API_URL}/api/preavaliacao/${avaliacaoSelecionada.id}/`,
      );
      cancelarEdicao();
      await buscarAvaliacoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir: " + (err.response?.data?.detail || err.message));
    }
  };

  // Opções do Select
  const opcoesSelect = avaliacoes.map((a) => ({
    value: a.id,
    label: a.titulo,
  }));

  return (
    <div className="pre-avaliacoes-container">
      <Card title="Pré-Avaliações" size="al">
        {/* Header */}
        <div className="pre-avaliacoes-header">

          <div className="header-actions">
            <button className="btn-nova" onClick={novaAvaliacao}>
              <Plus size={20} />
              Nova Pré-Avaliação
            </button>
          </div>
        </div>

        {erro && <div className="erro-mensagem">{erro}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando pré-avaliações...</p>
          </div>
        ) : (
          <div className="pre-avaliacoes-content">
            {/* Busca rápida */}
            <div className="busca-section">
              <div className="busca-header">
                <Search size={20} />
                <span>Buscar pré-avaliação existente</span>
              </div>
              <Select
                options={opcoesSelect}
                placeholder="Digite para buscar..."
                onChange={(opt) => {
                  const selecionada = avaliacoes.find((a) => a.id === opt?.value);
                  selecionarAvaliacao(selecionada || null);
                }}
                isClearable
                value={opcoesSelect.find(opt => opt.value === avaliacaoSelecionada?.id)}
                styles={{
                  container: (base) => ({ ...base, marginBottom: "0" }),
                  control: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    padding: "4px 8px"
                  }),
                }}
              />
            </div>

            {/* Editor */}
            {(modoEdicao || avaliacaoSelecionada) && (
              <div className="editor-section">


                {/* Título */}
                <div className="input-group">
                  <label htmlFor="titulo">Título</label>
                  <input
                    id="titulo"
                    type="text"
                    placeholder="Digite o título da avaliação..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="titulo-input"
                  />
                </div>

                {/* Conteúdo */}
                <div className="input-group">
                  <ReactQuill
                    id="conteudo"
                    theme="snow"
                    value={conteudo}
                    onChange={setConteudo}
                    className="editor-quill"
                  />
                </div>

                {/* Botões de ação */}
                <div className="acoes-botoes">
                  {avaliacaoSelecionada && (
                    <button className="btn-excluir" onClick={excluirAvaliacao}>
                      <Trash2 size={18} />
                      Excluir
                    </button>
                  )}

                  <button className="btn-salvar" onClick={salvarAvaliacao}>
                    <Save size={18} />
                    {avaliacaoSelecionada ? "Salvar" : "Criar Pré-Avaliação"}
                  </button>
                </div>
              </div>

            )}

            {/* Estado vazio */}
            {!modoEdicao && !avaliacaoSelecionada && avaliacoes.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Nenhuma pré-avaliação encontrada</h3>
                <p>Crie sua primeira pré-avaliação para começar</p>
                <button className="btn-nova-empty" onClick={novaAvaliacao}>
                  <Plus size={20} />
                  Criar Primeira Pré-Avaliação
                </button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}