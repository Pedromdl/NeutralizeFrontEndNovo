import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/css/Login.css'; // Certifique-se de ter um CSS para estilizar o formulário
import Logo from './../images/logo.png'; // Ajuste o caminho conforme necessário


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/jwt/create/`, {
        username,
        password,
      });
      localStorage.setItem('token', res.data.access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      navigate('/'); // Redireciona para home ou dashboard
    } catch {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="login-conteudo">
      <div className="card-login">
          <img src={Logo} alt="Logo" className="logo" style={{ width: '250px' }}/>
        <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
    </div>
    </div>
  );
}