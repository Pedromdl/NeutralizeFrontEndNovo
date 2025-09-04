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
        <div className="dados-usuario">
          <p><strong>Nome:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Sobrenome:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>CPF:</strong> {user.cpf}</p>
          <p><strong>Endereço:</strong> {user.address}</p>
          <p><strong>Telefone:</strong> {user.phone}</p>

          {/* Adicione outros campos se desejar */}
          <div className="botoes-edicao">
            <button className="black" onClick={handleLogout}>Sair</button>
            <button className="grey" onClick={() => navigate(-1)}>Voltar</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
