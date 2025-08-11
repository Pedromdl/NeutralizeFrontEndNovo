import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/css/Login.css';
import Logo from './../images/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');   // para login normal
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Inicializa o Google Identity Services
  useEffect(() => {
    /* global google */
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', text: 'continue_with', width: '250' }
      );
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google/`, {
        token: response.credential,
      });
      localStorage.setItem('token', res.data.access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      navigate('/');
    } catch (err) {
      console.error('Erro no login Google:', err);
      setErro('Erro ao autenticar com o Google.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/jwt/create/`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      navigate('/');
    } catch {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="login-conteudo">
      <div className="card-login">
        <img src={Logo} alt="Logo" className="logo" style={{ width: '250px' }} />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
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

        {/* Botão do Google Identity Services */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <div id="googleSignInDiv"></div>
      </div>
      </div>
    </div>
  );
}
