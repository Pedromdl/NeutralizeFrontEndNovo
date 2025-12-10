import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import { Loader2 } from 'lucide-react'; // Importar spinner
import '../components/css/DadosUsuario.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [organizacao, setOrganizacao] = useState(null);
  const [erro, setErro] = useState('');
  const [isLoadingOrga, setIsLoadingOrga] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Novo estado
  const [viewMode, setViewMode] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErro('Usuário não autenticado');
      navigate('/login');
      return;
    }

    setIsLoadingUser(true); // Iniciar loading
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setUser(res.data);
        if (res.data.role === 'admin') {
          fetchOrganizacao(token);
        }
      })
      .catch(() => setErro('Não foi possível carregar os dados do usuário.'))
      .finally(() => {
        setIsLoadingUser(false); // Finalizar loading
      });
  }, [navigate]);

  const fetchOrganizacao = (token) => {
    setIsLoadingOrga(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/minha-organizacao/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setOrganizacao(res.data);
        setFormData({
          nome: res.data.nome || '',
          telefone: res.data.telefone || '',
          endereco: res.data.endereco || '',
          numero: res.data.numero || '',
          complemento: res.data.complemento || '',
        });
      })
      .catch(error => {
        if (error.response?.status === 404) {
          console.log('Usuário não tem organização cadastrada');
          setOrganizacao(null);
        } else {
          console.error('Erro ao carregar organização:', error);
        }
      })
      .finally(() => {
        setIsLoadingOrga(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveOrganizacao = () => {
    const token = localStorage.getItem('token');
    setSaving(true);
    setErro('');
    setSuccess('');

    const dadosParaEnviar = {
      nome: formData.nome,
      telefone: formData.telefone,
      endereco: formData.endereco,
      numero: formData.numero,
      complemento: formData.complemento,
    };

    axios.patch(`${import.meta.env.VITE_API_URL}/api/auth/minha-organizacao/`, dadosParaEnviar, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setOrganizacao(res.data);
        setSuccess('Organização atualizada com sucesso!');
        setEditMode(false);
        fetchOrganizacao(token);
      })
      .catch(error => {
        console.error('Erro ao atualizar organização:', error);
        if (error.response?.data) {
          const errors = Object.values(error.response.data).flat();
          setErro(errors.join(', '));
        } else {
          setErro('Erro ao atualizar organização. Tente novamente.');
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (organizacao) {
      setFormData({
        nome: organizacao.nome || '',
        telefone: organizacao.telefone || '',
        endereco: organizacao.endereco || '',
        numero: organizacao.numero || '',
        complemento: organizacao.complemento || '',
      });
    }
    setErro('');
    setSuccess('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // 1. REMOVER loading global:
  // ❌ if (!user) return <p>Carregando...</p>;

  // 2. Adicionar função para renderizar loading elegante
  const renderLoadingState = (isLoading, customText = null) => {
    if (!isLoading) return null;
    
    return (
      <div className="profile-loading-overlay">
        <div className="profile-spinner">
          <Loader2 size={32} className="spinner-animation" />
          <p>{customText || 'Carregando...'}</p>
        </div>
      </div>
    );
  };

  // 3. Loading inicial do perfil
  if (isLoadingUser) {
    return (
      <div className="conteudo">
        <Card title="Perfil do Usuário" size="al">
          <div className="usuario-secoes">
            {renderLoadingState(true, 'Carregando seus dados...')}
          </div>
        </Card>
      </div>
    );
  }

  // 4. Erro global (mantém layout)
  if (erro && !user) {
    return (
      <div className="conteudo">
        <Card title="Perfil do Usuário" size="al">
          <div className="profile-error">
            <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{erro}</p>
            <div className="botoes-edicao">
              <button className="primary" onClick={() => navigate('/login')}>
                Ir para Login
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const renderProfileView = () => (
    <>
      {renderLoadingState(isLoadingUser, 'Carregando perfil...')}
      
      {user.profile_picture_url && (
        <div>
          <div className="container-foto">
            <img
              src={user.profile_picture_url}
              className="foto-perfil"
              alt={`Foto de ${user.first_name || user.email}`}
            />
          </div>
        </div>
      )}

      <div className="secao-card">
        <h3>Informações Pessoais</h3>

        <div className="linha-dado">
          <label>Nome</label>
          <span>{user.first_name || "Não informado"}</span>
        </div>

        <div className="linha-dado">
          <label>Sobrenome</label>
          <span>{user.last_name || "Não informado"}</span>
        </div>

        <div className="linha-dado">
          <label>Email</label>
          <span>{user.email || "Não informado"}</span>
        </div>

        <div className="linha-dado">
          <label>CPF</label>
          <span>{user.cpf || "Não informado"}</span>
        </div>

        <div className="linha-dado">
          <label>Telefone</label>
          <span>{user.phone || "Não informado"}</span>
        </div>
      </div>

      <div className="secao-card">
        <h3>Endereço</h3>
        <div className="linha-dado">
          <label>Endereço</label>
          <span>{user.address || "Não informado"}</span>
        </div>
      </div>

      {user.role && (
        <div className="secao-card">
          <h3>Informações da Conta</h3>
          <div className="linha-dado">
            <label>Tipo de Usuário</label>
            <span>
              {user.role === 'admin' && 'Administrador'}
              {user.role === 'paciente' && 'Paciente'}
              {user.role === 'profissional' && 'Profissional'}
              {!['admin', 'paciente', 'profissional'].includes(user.role) && user.role}
            </span>
          </div>

          {user.date_joined && (
            <div className="linha-dado">
              <label>Membro desde</label>
              <span>{new Date(user.date_joined).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderOrganizacaoView = () => {
    // 5. Melhorar loading da organização
    if (isLoadingOrga) {
      return (
        <div className="organizacao-loading">
          {renderLoadingState(true, 'Carregando organização...')}
          {/* Mantém layout básico enquanto carrega */}
          <div className="secao-card" style={{ opacity: 0.5 }}>
            <h3>Organização</h3>
            <div className="linha-dado">
              <label>Nome</label>
              <span className="skeleton-text"></span>
            </div>
            <div className="linha-dado">
              <label>Tipo</label>
              <span className="skeleton-text"></span>
            </div>
          </div>
        </div>
      );
    }

    if (!organizacao) {
      return (
        <div className="secao-card">
          <h3>Organização</h3>
          <p>Você não possui uma organização cadastrada.</p>
          <button 
            className="primary" 
            onClick={() => navigate('/cadastrar-organizacao')}
            style={{ marginTop: '1rem' }}
          >
            Cadastrar Organização
          </button>
        </div>
      );
    }

    if (editMode) {
      return (
        <>
          <div className="secao-card">
            <h3>Editar Organização</h3>
            
            {success && <div className="success-message" style={{color: 'green', marginBottom: '1rem'}}>{success}</div>}
            {erro && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{erro}</div>}

            {/* Overlay de saving */}
            {saving && (
              <div className="saving-overlay">
                <div className="saving-spinner">
                  <Loader2 size={24} className="spinner-animation" />
                  <span>Salvando alterações...</span>
                </div>
              </div>
            )}

            {/* NOME (EDITÁVEL) */}
            <div className="linha-dado">
              <label>Nome*</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={saving}
              />
            </div>

            {/* TIPO DE PESSOA (NÃO EDITÁVEL) */}
            <div className="linha-dado">
              <label>Tipo de Pessoa</label>
              <div className="read-only-field">
                {organizacao.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </div>
            </div>

            {/* TIPO DE ORGANIZAÇÃO (NÃO EDITÁVEL) */}
            <div className="linha-dado">
              <label>Tipo</label>
              <div className="read-only-field">
                {organizacao.tipo === 'clinica' && 'Clínica'}
                {organizacao.tipo === 'consultorio' && 'Consultório'}
                {organizacao.tipo === 'estudio' && 'Estúdio'}
                {organizacao.tipo === 'autonomo' && 'Profissional Autônomo'}
                {organizacao.tipo === 'online' && 'Serviço Online'}
                {organizacao.tipo === 'instituto' && 'Empresa/Instituto'}
                {organizacao.tipo === 'outro' && 'Outro'}
              </div>
            </div>

            {/* CNPJ/CPF (NÃO EDITÁVEL) */}
            <div className="linha-dado">
              <label>{organizacao.tipo_pessoa === 'pj' ? 'CNPJ' : 'CPF'}</label>
              <div className="read-only-field">
                {organizacao.tipo_pessoa === 'pj' ? organizacao.cnpj : organizacao.cpf || "Não informado"}
              </div>
            </div>

            {/* TELEFONE (EDITÁVEL) */}
            <div className="linha-dado">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="(11) 99999-9999"
                disabled={saving}
              />
            </div>

            {/* ENDEREÇO (EDITÁVEL) */}
            <div className="linha-dado">
              <label>Endereço</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Rua, Avenida, etc."
                disabled={saving}
              />
            </div>

            {/* NÚMERO (EDITÁVEL) */}
            <div className="linha-dado">
              <label>Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                className="form-input"
                disabled={saving}
              />
            </div>

            {/* COMPLEMENTO (EDITÁVEL) */}
            <div className="linha-dado">
              <label>Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                className="form-input"
                disabled={saving}
              />
            </div>
          </div>

          <div className="botoes-edicao">
            <button 
              className="primary" 
              onClick={handleSaveOrganizacao}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="spinner-animation" />
                  Salvando...
                </>
              ) : 'Salvar Alterações'}
            </button>
            <button 
              className="grey"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </>
      );
    }

    // MODO VISUALIZAÇÃO
    return (
      <>
        {organizacao.logo_url && (
          <div>
            <div className="container-foto">
              <img
                src={organizacao.logo_url}
                className="foto-perfil"
                alt={`Logo de ${organizacao.nome}`}
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        <div className="secao-card">
          <h3>Informações da Organização</h3>

          <div className="linha-dado">
            <label>Nome</label>
            <span>{organizacao.nome || "Não informado"}</span>
          </div>

          <div className="linha-dado">
            <label>Tipo de Pessoa</label>
            <span>
              {organizacao.tipo_pessoa === 'pf' && 'Pessoa Física'}
              {organizacao.tipo_pessoa === 'pj' && 'Pessoa Jurídica'}
            </span>
          </div>

          <div className="linha-dado">
            <label>Tipo</label>
            <span>
              {organizacao.tipo === 'clinica' && 'Clínica'}
              {organizacao.tipo === 'consultorio' && 'Consultório'}
              {organizacao.tipo === 'estudio' && 'Estúdio'}
              {organizacao.tipo === 'autonomo' && 'Profissional Autônomo'}
              {organizacao.tipo === 'online' && 'Serviço Online'}
              {organizacao.tipo === 'instituto' && 'Empresa/Instituto'}
              {organizacao.tipo === 'outro' && 'Outro'}
            </span>
          </div>

          <div className="linha-dado">
            <label>{organizacao.tipo_pessoa === 'pj' ? 'CNPJ' : 'CPF'}</label>
            <span>{organizacao.tipo_pessoa === 'pj' ? organizacao.cnpj : organizacao.cpf || "Não informado"}</span>
          </div>

          <div className="linha-dado">
            <label>Total de Usuários</label>
            <span>{organizacao.total_usuarios || 0}</span>
          </div>
        </div>

        <div className="secao-card">
          <h3>Contato</h3>
          <div className="linha-dado">
            <label>Telefone</label>
            <span>{organizacao.telefone || "Não informado"}</span>
          </div>
        </div>

        {(organizacao.endereco || organizacao.numero) && (
          <div className="secao-card">
            <h3>Endereço</h3>

            <div className="linha-dado">
              <label>Endereço</label>
              <span>{organizacao.endereco || "Não informado"}</span>
            </div>

            {organizacao.numero && (
              <div className="linha-dado">
                <label>Número</label>
                <span>{organizacao.numero}</span>
              </div>
            )}

            {organizacao.complemento && (
              <div className="linha-dado">
                <label>Complemento</label>
                <span>{organizacao.complemento}</span>
              </div>
            )}
          </div>
        )}

        <div className="secao-card">
          <h3>Informações Adicionais</h3>

          {organizacao.data_criacao && (
            <div className="linha-dado">
              <label>Cadastrada em</label>
              <span>{new Date(organizacao.data_criacao).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>

        <div className="botoes-edicao">
          <button 
            className="primary" 
            onClick={() => setEditMode(true)}
          >
            Editar Organização
          </button>
          <button 
            className="grey"
            onClick={() => {
              setViewMode('profile');
              setEditMode(false);
            }}
          >
            Voltar para Perfil
          </button>
        </div>
      </>
    );
  };

  const renderToggleButtons = () => {
    if (user?.role !== 'admin') return null;

    return (
      <div className="toggle-view-buttons">
        <button
          className={viewMode === 'profile' ? 'primary' : 'grey'}
          onClick={() => setViewMode('profile')}
          disabled={isLoadingUser}
        >
          Meu Perfil
        </button>
        <button
          className={viewMode === 'organizacao' ? 'primary' : 'grey'}
          onClick={() => setViewMode('organizacao')}
          disabled={isLoadingUser}
        >
          Minha Organização
        </button>
      </div>
    );
  };

  return (
    <div className="conteudo">
      {renderToggleButtons()}
      
      <Card 
        title={viewMode === 'profile' ? "Perfil do Usuário" : "Minha Organização"} 
        size="al"
      >
        <div className="usuario-secoes">
          {viewMode === 'profile' ? renderProfileView() : renderOrganizacaoView()}
          
          {viewMode === 'profile' && (
            <div className="botoes-edicao">
              <button className="black" onClick={handleLogout}>Sair</button>
              <button className="grey" onClick={() => navigate(-1)}>Voltar</button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}