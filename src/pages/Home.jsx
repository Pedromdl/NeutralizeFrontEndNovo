import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/css/Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "profissional") navigate("/usuarios");
      else if (user.role === "paciente") navigate("/paciente");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="conteudo">
      <h1>Bem-vindo à Neutralize</h1>
      <p>Esta é a página inicial do hub.</p>
    </div>
  );
}

export default Home;
