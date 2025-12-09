import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/css/Login.css";
import Logo from "./../images/logo.png";

export default function Login() {
  const location = useLocation();
  const [mostrarDestaqueGoogle, setMostrarDestaqueGoogle] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // -------------------------------------------------
  // FUNÇÃO CENTRALIZADA DE REDIRECIONAMENTO POR ROLE
  // -------------------------------------------------
  const redirectByRole = (role) => {
    const routes = {
      admin: "/usuarios",
      profissional: "/usuarios",
      paciente: "/paciente",
    };
    return routes[role] || "/";
  };

  // -------------------------------------------------
  // LOGIN FINAL (após receber token e pegar perfil)
  // -------------------------------------------------
  const finalizarLogin = async (token) => {
    try {
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = userRes.data;

      // Sobrescreve token antigo
      localStorage.setItem("access", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      login(token, user); // atualiza contexto

      navigate(redirectByRole(user.role));
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setErro("Erro ao carregar dados do usuário.");
    }
  };

  // -------------------------------------------------
  // LOGIN COM GOOGLE
  // -------------------------------------------------
  const handleGoogleCallback = async (response) => {
    setErro("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google/`,
        { token: response.credential }
      );

      await finalizarLogin(res.data.access);
    } catch (err) {
      console.error("Erro no login Google:", err.response || err);
      setErro("Erro ao autenticar com o Google.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // CARREGA SCRIPT DO GOOGLE
  // -------------------------------------------------
  useEffect(() => {
    /* global google */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false, // ⬅ força a escolha de conta
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", text: "continue_with", width: "250" }
      );
    };

    document.body.appendChild(script);
  }, []);

  // -------------------------------------------------
  // LOGIN PADRÃO (EMAIL/SENHA)
  // -------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    setTimeout(async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login/`,
          { email, password }
        );

        await finalizarLogin(res.data.access);
      } catch (err) {
        console.error("Erro no login padrão:", err.response || err);
        setErro("Usuário ou senha inválidos.");
      } finally {
        setLoading(false);
      }
    }, 1200); // atraso para UX
  };

  // -------------------------------------------------
  // FUNÇÃO DESTAQUE PÓS CRIAR CLÍNICA
  // -------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clinicaCriada = params.get("clinica_criada");

    // Exibe somente se veio do registro E nunca mostrou antes
    if (clinicaCriada === "true" && !localStorage.getItem("googleHighlightShown")) {
      setMostrarDestaqueGoogle(true);

      // Marca como exibido
      localStorage.setItem("googleHighlightShown", "true");
    }
  }, [location]);

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------
  return (
    <div className="login-conteudo">
      <div className="card-login">
        <img src={Logo} alt="Logo" className="logo" style={{ width: "250px" }} />
        <h2>Login</h2>

        {loading ? (
          <div className="login-loading">
            <div className="spinner"></div>
            <p className="login-loading-text">
              Entrando na conta<span className="dots"></span>
            </p>
          </div>
        ) : (
          <>
            {/* LOGIN TRADICIONAL */}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn-login">
                Entrar
              </button>

              {erro && <p className="login-erro">{erro}</p>}
            </form>

            {/* LOGIN GOOGLE */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <div
                id="googleSignInDiv"
                className={mostrarDestaqueGoogle ? "google-highlight" : ""}
              ></div>
            </div>

            {/* LINK PARA REGISTRO - AGORA COMO LINK EM VEZ DE BOTÃO */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Não tem uma conta?{' '}
                <a 
                  href="/register" 
                  style={{ 
                    color: '#4CAF50', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Criar nova conta
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}