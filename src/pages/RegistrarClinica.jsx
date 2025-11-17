import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/css/Login.css";
import Logo from "./../images/logo.png";

export default function RegistrarClinica() {
  const [form, setForm] = useState({
    nome_clinica: "",
    email: "",
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

    if (!form.nome_clinica || !form.email) {
      setErros(["Preencha todos os campos obrigatórios."]);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/registrar-clinica/`,
        {
          nome: form.nome_clinica,
          email: form.email,
        }
      );

      setSucesso("Clínica registrada com sucesso!");
      // Salva tokens para login automático
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setTimeout(() => navigate("/login"), 1500);
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
            type="email"
            name="email"
            placeholder="Email do Administrador"
            value={form.email}
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
