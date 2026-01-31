import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, Save, X, Filter, Loader2 } from 'lucide-react';
import Card from '../../components/Card';
import './PreTestes.css';

export default function TestesPrePadronizados() {
  const [categorias, setCategorias] = useState([]);
  const [testes, setTestes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Estados para formulários
  const [novoTeste, setNovoTeste] = useState({ nome: '', categoria: '' });
  const [editandoTeste, setEditandoTeste] = useState(null);

  const [mostrarCriacao, setMostrarCriacao] = useState(false);


  const API_URL = import.meta.env.VITE_API_URL;

  // Categorias que NÃO são editáveis
  const CATEGORIAS_FIXAS = ['Testes de Movimento'];

  // Buscar dados
  const buscarDados = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token não encontrado no localStorage');
        setErro('Usuário não autenticado. Faça login novamente.');
        return;
      }

      // 🔹 BUSCAR CATEGORIAS
      const categoriasResponse = await axios.get(`${API_URL}/api/categoria-teste/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // 🔹 BUSCAR TESTES (com filtro se existir)
      let testesUrl = `${API_URL}/api/testes/`;
      if (filtroCategoria) {
        testesUrl += `?categoria=${encodeURIComponent(filtroCategoria)}`;
      }

      const testesResponse = await axios.get(testesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCategorias(categoriasResponse.data);
      setTestes(testesResponse.data);

    } catch (err) {
      console.error('Erro detalhado:', err);

      if (err.response?.status === 401) {
        setErro('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setErro('Erro ao carregar dados');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, [filtroCategoria]); // 🔹 Agora busca dados quando o filtro muda

  // Filtrar categorias editáveis
  const categoriasEditaveis = categorias.filter(
    cat => !CATEGORIAS_FIXAS.includes(cat.nome)
  );

  // CRUD Testes (apenas para categorias editáveis)
  const criarTeste = async () => {
    if (!novoTeste.nome.trim() || !novoTeste.categoria) {
      alert('Preencha todos os campos');
      return;
    }

    // Verificar se a categoria selecionada é editável
    const categoriaSelecionada = categorias.find(c => c.id == novoTeste.categoria);
    if (CATEGORIAS_FIXAS.includes(categoriaSelecionada?.nome)) {
      alert('Não é possível adicionar testes nesta categoria');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/testes/`,
        {
          nome: novoTeste.nome,
          categoria: novoTeste.categoria
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNovoTeste({ nome: '', categoria: '' });
      await buscarDados(); // 🔹 Recarrega os dados após criar
    } catch (err) {
      setErro('Erro ao criar teste');
      console.error(err);
    }
  };

  const atualizarTeste = async (id, dados) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/testes/${id}/`,
        dados,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditandoTeste(null);
      await buscarDados(); // 🔹 Recarrega os dados após atualizar
    } catch (err) {
      setErro('Erro ao atualizar teste');
    }
  };

  const excluirTeste = async (teste) => {
    // Verificar se a categoria é editável
    if (CATEGORIAS_FIXAS.includes(teste.categoria_nome)) {
      alert('Não é possível excluir testes desta categoria');
      return;
    }

    if (!window.confirm(`Deseja excluir o teste "${teste.nome}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/testes/${teste.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await buscarDados(); // 🔹 Recarrega os dados após excluir
    } catch (err) {
      setErro('Erro ao excluir teste');
    }
  };

  // Verificar se pode editar um teste
  const podeEditarTeste = (teste) => {
    return !CATEGORIAS_FIXAS.includes(teste.categoria_nome);
  };


  return (


    <div className="testes-pre-padronizados">
      <Card title="Testes Pré-Padronizados" size="al">

        {erro && <div className="erro">{erro}</div>}

        <div className={`pre-testes-wrapper ${loading ? 'loading' : ''}`}>

          {loading && (
            <div className="pre-testes-overlay">
              <div className="pre-testes-spinner">
                <Loader2 size={32} className="spinner-icon" />
                <span>Carregando...</span>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="filtros">
            <div className="filtro-header">
              <Filter size={16} />
              <span>Filtrar por categoria:</span>
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {filtroCategoria && (
              <button
                className="btn-limpar-filtro"
                onClick={() => setFiltroCategoria('')}
              >
                Limpar filtro
              </button>
            )}

            <button
              onClick={() => setMostrarCriacao(prev => !prev)}
            >
              <Plus size={16} />
              Adicionar Teste
            </button>
          </div>

          {/* Seção de Criação de Testes (apenas para categorias editáveis) */}
          {mostrarCriacao && (
            <div className="secao-criacao">
              <h3>Adicionar Novo Teste</h3>
              <div className="form-teste">
                <input
                  type="text"
                  placeholder="Nome do teste (ex: Escala Visual Analógica...)"
                  value={novoTeste.nome}
                  onChange={(e) => setNovoTeste({ ...novoTeste, nome: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && criarTeste()}
                />
                <select
                  value={novoTeste.categoria}
                  onChange={(e) => setNovoTeste({ ...novoTeste, categoria: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriasEditaveis.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                <button
                  onClick={criarTeste}
                  disabled={!novoTeste.nome.trim() || !novoTeste.categoria}
                >
                  <Plus size={16} />
                  Adicionar Teste
                </button>
              </div>
            </div>
          )}

          {/* Lista de Testes */}
          <div className="secao-lista">
            <h3>
              Testes {filtroCategoria ? `- ${filtroCategoria}` : 'Disponíveis'}
              <span className="total">({testes.length} testes)</span>
            </h3>

            <div className="lista-testes">
              {testes.length === 0 ? (
                <div className="vazio">
                  {filtroCategoria
                    ? `Nenhum teste encontrado na categoria "${filtroCategoria}"`
                    : 'Nenhum teste cadastrado'
                  }
                </div>
              ) : (
                testes.map(teste => {
                  const editavel = podeEditarTeste(teste);

                  return (
                    <div key={teste.id} className={`item-teste ${!editavel ? 'categoria-fixa' : ''}`}>
                      {editandoTeste === teste.id ? (
                        <div className="editando">
                          <input
                            type="text"
                            defaultValue={teste.nome}
                            onBlur={(e) => atualizarTeste(teste.id, { nome: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && atualizarTeste(teste.id, { nome: e.target.value })}
                            autoFocus
                          />
                          <select
                            defaultValue={teste.categoria}
                            onChange={(e) => atualizarTeste(teste.id, { categoria: e.target.value })}
                          >
                            {categoriasEditaveis.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.nome}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => setEditandoTeste(null)}>
                            <Save size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="exibindo">
                          <div className="info-teste">
                            <strong>{teste.nome}</strong>
                            <div className="meta-info">
                              <span className="categoria">{teste.categoria_nome}</span>
                              {!editavel && (
                                <span className="badge-fixo">Categoria Fixa</span>
                              )}
                            </div>
                          </div>
                          <div className="acoes">
                            {editavel ? (
                              <>
                                <button
                                  onClick={() => setEditandoTeste(teste.id)}
                                  title="Editar teste"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => excluirTeste(teste)}
                                  title="Excluir teste"
                                  className="btn-excluir"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            ) : (
                              <span className="nao-editavel">
                                Apenas leitura
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legenda */}
          <div className="legenda">
            <div className="item-legenda">
              <div className="cor categoria-fixa"></div>
              <span>Categorias fixas (não editáveis)</span>
            </div>
            <div className="item-legenda">
              <div className="cor categoria-editavel"></div>
              <span>Categorias editáveis</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}