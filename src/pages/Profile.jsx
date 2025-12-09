import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import '../components/css/DadosUsuario.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErro('Usuário não autenticado');
      navigate('/login');
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setUser(res.data))
      .catch(() => setErro('Não foi possível carregar os dados do usuário.'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  if (!user) return <p>Carregando...</p>;

  return (
    <div className="conteudo">
      <Card title="Perfil do Usuário" size="al">
        <div className="usuario-secoes">

          {/* ==============================
              SEÇÃO: FOTO DO PERFIL
          =============================== */}
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

          {/* ==============================
              SEÇÃO: DADOS PESSOAIS
          =============================== */}
          <div className="secao-card">
            <h3>Informações Pessoais</h3>

            {/* Nome */}
            <div className="linha-dado">
              <label>Nome</label>
              <span>{user.first_name || "Não informado"}</span>
            </div>

            {/* Sobrenome */}
            <div className="linha-dado">
              <label>Sobrenome</label>
              <span>{user.last_name || "Não informado"}</span>
            </div>

            {/* Email */}
            <div className="linha-dado">
              <label>Email</label>
              <span>{user.email || "Não informado"}</span>
            </div>

            {/* CPF */}
            <div className="linha-dado">
              <label>CPF</label>
              <span>{user.cpf || "Não informado"}</span>
            </div>

            {/* Telefone */}
            <div className="linha-dado">
              <label>Telefone</label>
              <span>{user.phone || "Não informado"}</span>
            </div>
          </div>

          {/* ==============================
              SEÇÃO: ENDEREÇO
          =============================== */}
          <div className="secao-card">
            <h3>Endereço</h3>

            {/* Endereço Completo */}
            <div className="linha-dado">
              <label>Endereço</label>
              <span>{user.address || "Não informado"}</span>
            </div>
          </div>

          {/* ==============================
              SEÇÃO: OUTRAS INFORMAÇÕES
          =============================== */}
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

              {/* Data de Criação da Conta (se disponível) */}
              {user.date_joined && (
                <div className="linha-dado">
                  <label>Membro desde</label>
                  <span>{new Date(user.date_joined).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          )}

          {/* ==============================
              BOTÕES DE AÇÃO
          =============================== */}
          <div className="botoes-edicao">
            <button className="black" onClick={handleLogout}>Sair</button>
            <button className="grey" onClick={() => navigate(-1)}>Voltar</button>
          </div>

        </div>
      </Card>
    </div>
  );
}