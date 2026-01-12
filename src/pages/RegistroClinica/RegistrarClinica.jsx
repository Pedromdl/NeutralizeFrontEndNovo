import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegistroClinica.css";
import Logo from "../../images/logo.png";

export default function RegistrarClinica() {
  const [form, setForm] = useState({
    nome_clinica: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    documento: "",

  });

  const [erros, setErros] = useState([]);
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros([]);
    setSucesso("");

    // Valida campos obrigatórios
    if (!form.nome_clinica || !form.email || !form.password || !form.first_name || !form.last_name) {
      setErros(["Preencha todos os campos obrigatórios."]);
      return;
    }

    if (form.password.length < 6) {
      setErros(["A senha deve ter pelo menos 6 caracteres."]);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/registrar-clinica/`,
        {
          nome: form.nome_clinica,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          documento: form.documento,

        }
      );

      setSucesso("Clínica registrada com sucesso!");

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setTimeout(() => navigate("/login?clinica_criada=true"), 1500);
    } catch (error) {
      let msgs = [];
      if (error.response?.data) {
        const data = error.response.data;
        if (data.error) msgs.push(data.error);
      } else {
        msgs.push("Erro ao registrar clínica.");
      }
      setErros(msgs);
    }
  };

  return (
    <div className="register-conteudo">
      <div className="card-register">
        <img src={Logo} alt="Logo" className="logo" style={{ width: "250px" }} />
        <h2>Registrar Clínica</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="nome_clinica"
            placeholder="Nome da Clínica"
            value={form.nome_clinica}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="documento"
            placeholder="CPF ou CNPJ"
            value={form.documento}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="first_name"
            placeholder="Nome"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="last_name"
            placeholder="Sobrenome"
            value={form.last_name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email do Administrador"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Crie uma senha"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" style={{ marginTop: "1.5rem" }}>
            Criar Clínica
          </button>
        </form>

        {erros.length > 0 && (
          <div style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
            {erros.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}

        {sucesso && (
          <p style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>
            {sucesso}
          </p>
        )}
      </div>
    </div>
  );
}
