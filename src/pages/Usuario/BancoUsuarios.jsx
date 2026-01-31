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

    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);


    // 🔹 Debounce do campo de busca
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);
    // 🔹 Buscar usuários da API (SEM paginação do DRF)
    const fetchUsers = async () => {
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

    // 🔹 Rodar sempre que filtros mudarem
    useEffect(() => {
        fetchUsers();
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

    const handleSaveUser = async () => {
        try {
            const payload = {
                ...formData,
                birth_date: formData.birth_date || null
            };

            if (editingUser) {
                // 👉 EDITAR
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/customuser/${editingUser.id}/`, payload);
            } else {
                // 👉 CRIAR
                await axios.post(`${import.meta.env.VITE_API_URL}/api/customuser/`, payload);
            }

            fetchUsers();
            setShowModal(false);
            setEditingUser(null);

        } catch (error) {
            console.log("Erro:", error.response?.data || error);
        }
    };

    const handleEditUser = (u) => {
        setEditingUser(u);

        setFormData({
            first_name: u.first_name || "",
            last_name: u.last_name || "",
            email: u.email || "",
            cpf: u.cpf || "",
            address: u.address || "",
            phone: u.phone || "",
            birth_date: u.birth_date || "",
            role: u.role || ""
        });

        setShowModal(true);
    };

    const handleDeleteConfirm = (u) => {
        setUserToDelete(u);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/customuser/${userToDelete.id}/`);
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            console.log("Erro ao excluir:", error.response?.data || error);
        }
    };

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        cpf: "",
        address: "",
        phone: "",
        birth_date: "",
        role: "paciente",
    });

    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState("");

    return (
        <div className="conteudo">
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">

                        <h2>Criar Usuário</h2>

                        {modalError && (
                            <p style={{ color: "red", marginBottom: "10px" }}>
                                {modalError}
                            </p>
                        )}

                        <form className="modal-form">

                            <div className="modal-grid">

                                <div className="field">
                                    <label>Nome *</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o primeiro nome"
                                        value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Sobrenome</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o sobrenome"
                                        value={formData.last_name}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>

                                <div className="field">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        placeholder="usuario@exemplo.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>CPF</label>
                                    <input
                                        type="text"
                                        placeholder="Somente números"
                                        value={formData.cpf}
                                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                        maxLength="11"
                                    />
                                </div>

                                <div className="field">
                                    <label>Endereço</label>
                                    <input
                                        type="text"
                                        placeholder="Rua, número, bairro..."
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="field">
                                    <label>Telefone</label>
                                    <input
                                        type="text"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="field">
                                    <label>Data de nascimento *</label>
                                    <input
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                </div>

                                <div className="field">
                                    <label>Tipo de usuário</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="admin">Administrador</option>
                                        <option value="profissional">Profissional</option>
                                        <option value="paciente">Paciente</option>
                                    </select>
                                </div>

                            </div>


                            <div className="modal-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="modal-cancel"
                                >
                                    Cancelar
                                </button>

                                <button type="button" onClick={handleSaveUser} className="btn-salvar">
                                    {editingUser ? "Salvar alterações" : "Criar usuário"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Excluir usuário</h3>
                        <p>Tem certeza que deseja excluir <strong>{userToDelete.first_name}</strong>?</p>

                        <div className="modal-buttons">
                            <button className="btn-cancelar" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </button>

                            <button className="btn-excluir" onClick={confirmDeleteUser}>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Card title="Usuários da Clínica" size="al">

                {loading && (
                    <p style={{ padding: "1rem" }}>Carregando usuários...</p>
                )}

                {erro && (
                    <p style={{ padding: "1rem", color: "red" }}>{erro}</p>
                )}

                {/* 🔹 Pesquisar */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                    <input
                        className="search-input-wrapper"
                        type="text"
                        placeholder="Pesquisar usuário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, }}
                    />

                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-criar-usuario"
                    >
                        Criar usuário
                    </button>
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
                                        <td className="acoes">
                                            <button className="btn-editar" onClick={() => handleEditUser(u)}>
                                                Editar
                                            </button>

                                            <button className="btn-excluir" onClick={() => handleDeleteConfirm(u)}>
                                                Excluir
                                            </button>
                                        </td>
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
