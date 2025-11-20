import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from 'lucide-react';
import "../../components/css/BancoExercicios.css";

export default function BancoUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [ordering, setOrdering] = useState("first_name"); // padrão

    // 🔹 Debounce do campo de busca
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // 🔹 Buscar usuários da API (SEM paginação do DRF)
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setErro(null);
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/?ordering=${ordering}`
                );

                if (Array.isArray(res.data)) {
                    const lista = res.data;

                    // Filtrar pelo search
                    const filtrados = lista.filter(u =>
                        u.first_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
                    );

                    setTotalCount(filtrados.length);
                    setTotalPages(Math.max(1, Math.ceil(filtrados.length / pageSize)));

                    const start = (page - 1) * pageSize;
                    setUsuarios(filtrados.slice(start, start + pageSize));
                } else {
                    setUsuarios([]);
                }
            } catch (err) {
                console.error(err);
                setErro("Erro ao carregar usuários");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, pageSize, debouncedSearch, ordering]);

    // 🔹 Controles de paginação
    const goFirst = () => setPage(1);
    const goPrev = () => setPage(p => Math.max(1, p - 1));
    const goNext = () => setPage(p => Math.min(totalPages, p + 1));
    const goLast = () => setPage(totalPages);
    const handlePageSizeChange = e => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const formatRole = (role) => {
        if (!role) return '-';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    function toggleSort(field) {
        setOrdering(prev =>
            prev === field ? `-${field}` : field
        );
        setPage(1); // resetar paginação
    }

    function getSortIndicator(field) {
        if (ordering === field) return "▲";        // crescente
        if (ordering === `-${field}`) return "▼";  // decrescente
        return "⇅";                                // neutro
    }

    return (
        <div className="conteudo">

            <Card title="Usuários da Clínica" size="al">

                {loading && (
                    <p style={{ padding: "1rem" }}>Carregando usuários...</p>
                )}

                {erro && (
                    <p style={{ padding: "1rem", color: "red" }}>{erro}</p>
                )}

                {/* 🔹 Pesquisar */}
                <div className="banco-exercicios-search" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Pesquisar usuário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1 }}
                    />
                </div>

                {/* 🔹 Tabela */}
                {usuarios.length === 0 ? (
                    <p>Nenhum usuário encontrado.</p>
                ) : (
                    <div className="banco-exercicios-wrapper">
                        <table className="banco-exercicios-table">
                            <thead>
                                <tr>
                                    <th onClick={() => toggleSort("first_name")} className="th-sortable">
                                        Nome {getSortIndicator("first_name")}
                                    </th>

                                    <th>
                                        Sobrenome
                                    </th>

                                    <th onClick={() => toggleSort("email")} className="th-sortable">
                                        Email {getSortIndicator("email")}
                                    </th>

                                    <th onClick={() => toggleSort("role")} className="th-sortable">
                                        Função {getSortIndicator("role")}
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.first_name || '-'}</td>
                                        <td>{u.last_name || '-'}</td>
                                        <td>{u.email || '-'}</td>
                                        <td>{formatRole(u.role)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 🔹 Paginação */}
                <div className="banco-exercicios-paginacao-container">
                    <div className="banco-exercicios-paginacao-botoes">
                        <button onClick={goFirst} disabled={page === 1}><ChevronsLeft size={18} /></button>
                        <button onClick={goPrev} disabled={page === 1}><ChevronLeft size={18} /></button>
                        <span className="banco-exercicios-paginacao-text">
                            Página {page} de {totalPages}
                        </span>
                        <button onClick={goNext} disabled={page === totalPages}><ChevronRight size={18} /></button>
                        <button onClick={goLast} disabled={page === totalPages}><ChevronsRight size={18} /></button>
                    </div>

                    <div className="banco-exercicios-paginacao-info">
                        <select value={pageSize} onChange={handlePageSizeChange} style={{ padding: '0.25rem', margin: '0.25rem' }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>

                        </select>
                        <span>{totalCount} usuários encontrados</span>
                    </div>
                </div>

            </Card>
        </div>
    );
}
