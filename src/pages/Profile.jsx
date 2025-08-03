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
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users/me/`)
      .then(res => setUser(res.data))
      .catch(() => setErro('Não foi possível carregar os dados do usuário.'));
  }, []);

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
      <div className="dados-usuario">
        <p><strong>Usuário:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Adicione outros campos se desejar */}
        <div className="botoes-edicao">
          <button onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </Card>
  </div>
    );
}