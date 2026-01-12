import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import Logo from '../../images/logo.png';

export default function RegisterPacienteApp() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    re_password: '',
  });
  const [erros, setErros] = useState([]);
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Inicializa o Google Identity Services (mantido para quem quiser usar Google)
  useEffect(() => {
    /* global google */
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback
        });
        google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large', text: 'continue_with', width: '250' }
        );
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      // response.credential é o JWT do Google
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/accounts/google/`, {
        token: response.credential
      });
      // Supondo que sua API retorne o token de autenticação da sua aplicação
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/dashboard'); // ou página inicial
    } catch (err) {
      console.error('Erro no login Google:', err);
      setErros(['Erro ao autenticar com o Google.']);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErros([]);
    setSucesso('');
    setLoading(true);

    // Validação básica
    if (!form.email || !form.password) {
      setErros(['Email e senha são obrigatórios.']);
      setLoading(false);
      return;
    }

    if (form.password !== form.re_password) {
      setErros(['As senhas não coincidem.']);
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setErros(['A senha deve ter pelo menos 6 caracteres.']);
      setLoading(false);
      return;
    }

    try {
      // USANDO O NOVO ENDPOINT: /api/accounts/registro-paciente-app/
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/registro/`,
        {
          email: form.email.trim(),
          password: form.password
        }
      );

      // Se chegou aqui, o registro foi bem-sucedido
      setSucesso('Conta criada com sucesso! Redirecionando...');
      
      // Salva os tokens no localStorage
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('user_email', response.data.user.email);
      localStorage.setItem('user_name', `${response.data.user.first_name} ${response.data.user.last_name}`);

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/dashboard'); // ou página inicial do paciente
      }, 2000);

    } catch (error) {
      console.error('Erro no registro:', error);
      
      let mensagemErro = 'Erro ao registrar. Tente novamente.';
      
      if (error.response) {
        // Erro da API
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            if (data.error) {
              mensagemErro = data.error;
            } else if (data.email) {
              mensagemErro = 'Email já possui uma conta cadastrada.';
            }
            break;
            
          case 404:
            mensagemErro = 'Email não encontrado no cadastro da clínica. Entre em contato com sua clínica para verificar seu cadastro.';
            break;
            
          case 500:
            mensagemErro = 'Erro interno no servidor. Tente novamente mais tarde.';
            break;
            
          default:
            mensagemErro = data.error || 'Erro desconhecido.';
        }
      } else if (error.request) {
        // Erro de rede
        mensagemErro = 'Erro de conexão. Verifique sua internet.';
      }
      
      setErros([mensagemErro]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-conteudo">
      <div className="card-login">
        <img src={Logo} alt="Logo" className="logo" style={{ width: '250px' }} />
        
        <h2>Criar Conta</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
          Somente pacientes já cadastrados na clínica podem criar conta.
        </p>
        
        <form onSubmit={handleRegister} noValidate>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Digite o email cadastrado na clínica"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Crie uma senha (mínimo 6 caracteres)"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <input
              type="password"
              name="re_password"
              placeholder="Confirme a senha"
              value={form.re_password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Botão do Google Identity Services (opcional) */}
        <div id="googleSignInDiv" style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}></div>

        {/* Link para login */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: '#666' }}>
            Já tem uma conta?{' '}
            <a 
              href="/login" 
              style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Faça login
            </a>
          </p>
        </div>

        {/* Mensagens de erro */}
        {erros.length > 0 && (
          <div style={{ 
            color: '#721c24', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            padding: '0.75rem',
            borderRadius: '4px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {erros.map((e, i) => (
              <p key={i} style={{ margin: 0 }}>{e}</p>
            ))}
          </div>
        )}

        {/* Mensagem de sucesso */}
        {sucesso && (
          <div style={{ 
            color: '#155724', 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb',
            padding: '0.75rem',
            borderRadius: '4px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>{sucesso}</p>
          </div>
        )}
      </div>
    </div>
  );
}