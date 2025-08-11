import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/css/Login.css';
import Logo from './../images/logo.png';

const converterDataParaBR = (dataISO) => {
  if (!dataISO) return '';
  const partes = dataISO.split('-');
  if (partes.length !== 3) return '';
  const [ano, mes, dia] = partes;
  return `${dia}-${mes}-${ano}`;
};

const traduzirErro = (msg) => {
  const m = msg.toLowerCase();

  if (m.includes('password')) {
    if (m.includes('too short')) return 'A senha é muito curta.';
    if (m.includes('too common')) return 'A senha é muito comum.';
    if (m.includes('too similar')) return 'A senha é muito parecida com outras informações.';
    if (m.includes('entirely numeric')) return 'A senha não pode ser somente números.';
  }

  if (m.includes('email')) {
    if (m.includes('already exists')) return 'Já existe um usuário com este e-mail.';
    if (m.includes('invalid')) return 'E-mail inválido.';
    if (m.includes('this field may not be blank')) return 'O campo e-mail não pode ficar vazio.';
  }

  if (m.includes('cpf')) {
    return 'CPF inválido.';
  }

  if (m.includes('this field may not be blank')) {
    return 'Este campo não pode ficar vazio.';
  }

  if (m.includes('this field is required')) {
    return 'Este campo é obrigatório.';
  }

  if (m.includes('invalid')) {
    return 'Valor inválido.';
  }

  if (m.includes('user with this email already exists')) {
    return 'Já existe um usuário com este e-mail.';
  }

  if (msg.toLowerCase().includes('date has wrong format')) {
    return 'Preencha a data no formato AAAA-MM-DD.';
  }

  return msg;
};

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    cpf: '',
    address: '',
    phone: '',
    birth_date: '',
    password: '',
    re_password: '',
  });
  const [erros, setErros] = useState([]);
  const [sucesso, setSucesso] = useState('');
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
        callback: handleGoogleCallback
      });
      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', text: 'continue_with', width: '250' } // width em pixels como string ou número
      );
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      // response.credential é o JWT do Google
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google/`, {
        token: response.credential
      });
      // Supondo que sua API retorne o token de autenticação da sua aplicação
      localStorage.setItem('access_token', res.data.access);
      navigate('/');
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

    if (form.password !== form.re_password) {
      setErros(['Confirmação de senha: As senhas não coincidem']);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/users/`, {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        cpf: form.cpf,
        address: form.address,
        phone: form.phone,
        birth_date: converterDataParaBR(form.birth_date),
        password: form.password,
        re_password: form.re_password,
      });
      setSucesso('Usuário registrado! Faça login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        let msgs = [];
        const data = error.response.data;

        if (typeof data === 'string') {
          msgs.push(traduzirErro(data));
        } else if (typeof data === 'object') {
          const labels = {
            email: 'E-mail',
            password: 'Senha',
            re_password: 'Confirmação de senha',
            first_name: 'Nome',
            last_name: 'Sobrenome',
            cpf: 'CPF',
            address: 'Endereço',
            phone: 'Telefone',
            birth_date: 'Data de nascimento',
            non_field_errors: '',
          };

          for (const key in data) {
            if (Array.isArray(data[key])) {
              data[key].forEach(msg => {
                const traduzida = traduzirErro(msg);
                const campo = labels[key] ? `${labels[key]}: ` : '';
                msgs.push(campo + traduzida);
              });
            } else if (typeof data[key] === 'string') {
              const traduzida = traduzirErro(data[key]);
              const campo = labels[key] ? `${labels[key]}: ` : '';
              msgs.push(campo + traduzida);
            }
          }
        } else {
          msgs.push('Erro ao registrar. Verifique os dados.');
        }
        setErros(msgs);
      } else {
        setErros(['Erro ao registrar. Verifique os dados.']);
      }
    }
  };

  return (
    <div className="register-conteudo">
      <div className="card-register">
        <img src={Logo} alt="Logo" className="logo" style={{ width: '250px' }} />
        <h2>Registre-se</h2>
        <form onSubmit={handleRegister} noValidate>
          <input
            type="text"
            name="first_name"
            placeholder="Nome"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Sobrenome"
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Endereço"
            value={form.address}
            onChange={handleChange}
          />
          <input
            type="date"
            name="birth_date"
            placeholder="Data de Nascimento (DD-MM-AAAA)"
            value={form.birth_date}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="re_password"
            placeholder="Confirme a senha"
            value={form.re_password}
            onChange={handleChange}
            required
          />
          <button type="submit">Registrar</button>
        </form>

        {/* Botão do Google Identity Services */}
        <div id="googleSignInDiv" style={{ marginTop: '1rem' }}></div>

        {erros.length > 0 && (
          <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
            {erros.map((e, i) => (
              <p key={i} style={{ margin: 0 }}>{e}</p>
            ))}
          </div>
        )}

        {sucesso && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{sucesso}</p>}
      </div>
    </div>
  );
}
