import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import '../components/css/Login.css';
import Logo from './../images/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Inicializa Google Identity Services
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

  // Callback do Google
  const handleGoogleCallback = async (response) => {
    setErro('');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google/`, {
        token: response.credential,
      });

      const token = res.data.access;
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;

      login(token, user);

      if (user.role === "profissional") navigate("/usuarios");
      else if (user.role === "paciente") navigate("/paciente");

    } catch (err) {
      console.error('Erro no login Google:', err.response || err);
      if (err.response?.data?.detail) setErro(err.response.data.detail);
      else setErro('Erro ao autenticar com o Google.');
    } finally {
      setLoading(false);
    }
  };

  // Login padrão
const handleLogin = async (e) => {
  e.preventDefault();
  setErro('');
  setLoading(true); // ativa spinner

  // Simulação de atraso
  setTimeout(async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/jwt/create/`, {
        email,
        password,
      });

      const token = res.data.access;
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;

      login(token, user);

      if (user.role === "profissional") {
        navigate("/usuarios");
      } else if (user.role === "paciente") {
        navigate("/paciente");
      }
    } catch (err) {
      console.error('Erro no login padrão:', err.response || err);
      setErro('Usuário ou senha inválidos');
    } finally {
      setLoading(false); // garante que spinner desapareça
    }
  }, 1500); // atraso de 1,5s para teste
};

  return (
    <div className="login-conteudo">
      <div className="card-login">
        <img src={Logo} alt="Logo" className="logo" style={{ width: '250px' }} />
        <h2>Login</h2>

        {loading ? (
          <div className="login-loading">
            <div className="spinner"></div>
            <p className="login-loading-text">Entrando na conta<span className="dots">...</span></p>
          </div>
        ) : (
          <>
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
              <button type="submit" className="btn-login">
                Entrar
              </button>
              {erro && <p className="login-erro">{erro}</p>}
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <div id="googleSignInDiv"></div>
            </div>
          </>
        )}
      </div>
    </div>

  );
}
