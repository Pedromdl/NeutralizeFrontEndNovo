import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ExternalLink,
  Plus,
  X,
  Loader2,
  Edit2,
  Trash2, // ← Adicionando um ícone de spinner
} from 'lucide-react';
import "../../components/css/BancoExercicios.css";

export default function BancoExercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(13);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [serverPagination, setServerPagination] = useState(true);

  // 🔹 Modal e criação de exercício
  const [showModal, setShowModal] = useState(false);
  const [newExercicio, setNewExercicio] = useState({
    titulo: '',
    descricao: '',
    video_url: ''
  });
  const [adding, setAdding] = useState(false);

  const [editingExercicio, setEditingExercicio] = useState(null);


  // 🔹 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔹 Fetch com debounce
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setErro(null);
      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bancoexercicios/`,
          { params: { page, page_size: pageSize, search: debouncedSearch } }
        );

        if (res.data && Array.isArray(res.data.results)) {
          setServerPagination(true);
          setExercicios(res.data.results);
          const count = Number(res.data.count || res.data.results.length || 0);
          setTotalCount(count);
          setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
        } else if (Array.isArray(res.data)) {
          setServerPagination(false);
          const list = res.data;
          setTotalCount(list.length);
          const pages = Math.max(1, Math.ceil(list.length / pageSize));
          setTotalPages(pages);
          const start = (page - 1) * pageSize;
          setExercicios(list.slice(start, start + pageSize));
        } else {
          setExercicios([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar exercícios');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, pageSize, debouncedSearch]);

  const handleEditExercicio = (ex) => {
    setEditingExercicio(ex);
    setNewExercicio({
      titulo: ex.titulo,
      descricao: ex.descricao,
      video_url: ex.video_url
    });
    setShowModal(true);
  };

  const handleUpdateExercicio = async () => {
    if (!newExercicio.titulo.trim()) {
      alert("Título é obrigatório!");
      return;
    }

    setAdding(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bancoexercicios/${editingExercicio.id}/`,
        newExercicio
      );

      setExercicios(prev =>
        prev.map(ex => (ex.id === editingExercicio.id ? res.data : ex))
      );

      setShowModal(false);
      setEditingExercicio(null);
      setNewExercicio({ titulo: '', descricao: '', video_url: '' });
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar exercício');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteExercicio = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este exercício?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/bancoexercicios/${id}/`);
      setExercicios(prev => prev.filter(ex => ex.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir exercício');
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const goFirst = () => setPage(1);
  const goPrev = () => setPage(p => Math.max(1, p - 1));
  const goNext = () => setPage(p => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  // 🔹 Função para criar novo exercício
  const handleAddExercicio = async () => {
    if (!newExercicio.titulo.trim()) {
      alert("Título é obrigatório!");
      return;
    }
    setAdding(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bancoexercicios/`,
        newExercicio
      );
      setExercicios(prev => [res.data, ...prev]);
      setShowModal(false);
      setNewExercicio({ titulo: '', descricao: '', video_url: '' });
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar exercício');
    } finally {
      setAdding(false);
    }
  };

  // REMOVER ESTAS LINHAS:
  // if (loading) return <p>Carregando exercícios...</p>;
  // if (erro) return <p>{erro}</p>;

  // Em vez disso, vamos renderizar tudo e controlar o loading condicionalmente

  return (
    <div className="conteudo">
      <Card title="Banco de Exercícios" size="al">

        {/* 🔹 Pesquisador com botão de abrir modal */}
        <div className="banco-exercicios-search" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Pesquisar exercício pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={() => {
            setEditingExercicio(null);           // Limpa edição
            setNewExercicio({ titulo: '', descricao: '', video_url: '' }); // Limpa campos
            setShowModal(true);                  // Abre modal
          }}>
            <Plus size={16} /> Adicionar
          </button>
        </div>

        {/* 🔹 Mensagem de erro (se houver) */}
        {erro && (
          <div className="banco-exercicios-erro">
            <p>{erro}</p>
          </div>
        )}

        {/* 🔹 Container da tabela com overlay condicional */}
        <div className={`banco-exercicios-wrapper ${loading ? 'loading' : ''}`}>
          {loading && (
            <div className="banco-exercicios-overlay">
              <div className="banco-exercicios-spinner">
                <Loader2 size={32} className="spinner-icon" />
                <span>Carregando...</span>
              </div>
            </div>
          )}

          {/* 🔹 Conteúdo da tabela - sempre renderizado */}
          {!erro && (
            <>
              {exercicios.length === 0 && !loading ? (
                <p>Nenhum exercício encontrado.</p>
              ) : (
                <table className="banco-exercicios-table">
                  <thead>
                    <tr>
                      <th>Exercício</th>
                      <th>Funções</th> {/* ← Aqui o título da coluna de ícones */}

                    </tr>
                  </thead>
                  <tbody>
                    {exercicios.map(ex => (
                      <tr key={ex.id}>
                        <td data-label="Exercício">
                          {ex.video_url && (
                            <a
                              href={ex.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="banco-exercicios-preview-icon"
                              title="Abrir vídeo"
                            >
                              <ExternalLink size={16} strokeWidth={2} />
                            </a>
                          )}
                          <span className="banco-exercicios-titulo">{ex.titulo || '-'}</span>
                        </td>
                        <td data-label="Ações" className="banco-exercicios-acoes">
                          <div
                            title="Editar"
                            onClick={() => handleEditExercicio(ex)}
                          >
                            <Edit2 size={20} />
                          </div>
                          <div
                            title="Excluir"
                            onClick={() => handleDeleteExercicio(ex.id)}
                          >
                            <Trash2 size={20} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {/* 🔹 Paginação - sempre visível mas pode ser desabilitada durante loading */}
        <div className="banco-exercicios-paginacao-container">
          <div className="banco-exercicios-paginacao-botoes">
            <button
              onClick={goFirst}
              disabled={page === 1 || loading}
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={goPrev}
              disabled={page === 1 || loading}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="banco-exercicios-paginacao-text">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={page === totalPages || loading}
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={goLast}
              disabled={page === totalPages || loading}
            >
              <ChevronsRight size={18} />
            </button>
          </div>

          <div className="banco-exercicios-paginacao-info">
            <label>
              Linhas:
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <span>
              {totalCount} registro(s){serverPagination ? '' : ' (paginação client-side)'}
            </span>
          </div>
        </div>
      </Card>

      {/* 🔹 Modal para adicionar exercício */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-banco-exercicios">
            <div className="modal-header">
              <h3>{editingExercicio ? "Editar Exercício" : "Adicionar Exercício"}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Título"
                value={newExercicio.titulo}
                onChange={(e) => setNewExercicio(prev => ({ ...prev, titulo: e.target.value }))}
              />
              <textarea
                placeholder="Descrição"
                value={newExercicio.descricao}
                onChange={(e) => setNewExercicio(prev => ({ ...prev, descricao: e.target.value }))}
              />
              <input
                type="text"
                placeholder="URL do vídeo"
                value={newExercicio.video_url}
                onChange={(e) => setNewExercicio(prev => ({ ...prev, video_url: e.target.value }))}
              />
            </div>
            <div className="modal-footer">
              <button onClick={editingExercicio ? handleUpdateExercicio : handleAddExercicio} disabled={adding}>
                {adding ? (editingExercicio ? "Atualizando..." : "Adicionando...") : (editingExercicio ? "Atualizar" : "Adicionar")}
              </button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}