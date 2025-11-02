import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import "../../components/css/TreinoDetalhe.css";

export default function BancoExercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [fullList, setFullList] = useState([]); // usado se API não retornar paginação
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [serverPagination, setServerPagination] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setErro(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/bancoexercicios/`, {
          params: { page, page_size: pageSize }
        });

        // Se backend usa DRF pagination ele retorna { results: [...], count, next, previous }
        if (res.data && Array.isArray(res.data.results)) {
          setServerPagination(true);
          setExercicios(res.data.results);
          setTotalCount(res.data.count || 0);
          setTotalPages(Math.max(1, Math.ceil((res.data.count || 0) / pageSize)));
        } else if (Array.isArray(res.data)) {
          // fallback: API retornou lista completa -> paginar no cliente
          setServerPagination(false);
          setFullList(res.data);
          setTotalCount(res.data.length);
          const pages = Math.max(1, Math.ceil(res.data.length / pageSize));
          setTotalPages(pages);
          const start = (page - 1) * pageSize;
          setExercicios(res.data.slice(start, start + pageSize));
        } else {
          // resposta inesperada
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
  }, [page, pageSize]);

  // se mudar pageSize reinicia para a página 1
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const goFirst = () => setPage(1);
  const goPrev = () => setPage(p => Math.max(1, p - 1));
  const goNext = () => setPage(p => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  if (loading) return <p>Carregando exercícios...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="conteudo">
      <Card title="Banco de Exercícios" size="al">
        {exercicios.length === 0 ? (
          <p>Nenhum exercício encontrado.</p>
        ) : (
          <>
            <div className="tabela-exercicios-wrapper">
              <table className="tabela-exercicios">
                <thead>
                  <tr>
                    <th>Exercício</th>
                    <th>Descrição</th>
                    <th>Vídeo</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {exercicios.map(ex => (
                    <tr key={ex.id}>
                      <td>{ex.titulo || '-'}</td>
                      <td>{ex.descricao ? ex.descricao : '-'}</td>
                      <td>
                        {ex.video_url ? (
                          <a href={ex.video_url} target="_blank" rel="noreferrer">Abrir</a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{ex.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                <button onClick={goFirst} disabled={page === 1}>« Primeiro</button>
                <button onClick={goPrev} disabled={page === 1}>‹ Anterior</button>
                <span style={{ margin: '0 0.5rem' }}>Página {page} de {totalPages}</span>
                <button onClick={goNext} disabled={page === totalPages}>Próximo ›</button>
                <button onClick={goLast} disabled={page === totalPages}>Último »</button>
              </div>

              <div>
                <label style={{ marginRight: '0.5rem' }}>
                  Linhas:
                  <select value={pageSize} onChange={handlePageSizeChange} style={{ marginLeft: '0.5rem' }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
                <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#666'' }}>
                  {totalCount} registro(s){serverPagination ? '' : ' (paginação client-side)'}
                </span>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}