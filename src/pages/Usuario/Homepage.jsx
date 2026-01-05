import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/Card";
import NotificacaoBell from "../../components/NotificacaoBell";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, ClipboardList, Dumbbell, Link, Users, History} from "lucide-react";


import "../../components/css/PaginaInicialPaciente.css";
import "../../components/css/Configuracoes.css";


export default function Homepage() {
  const { user, loading, token } = useContext(AuthContext);
  const [totalPacientes, setTotalPacientes] = useState(null);

  const navigate = useNavigate();

const configItems = [
  {
    title: "Cadastro de Avaliações Pré-Padronizadas",
    description: "Gerencie modelos de avaliações físicas",
    icon: <FileText size={22} />,
    path: "/configuracoes/pre-avaliacoes",
  },
  {
    title: "Cadastro de Testes Pré-Padronizados",
    description: "Configure testes e protocolos padrão",
    icon: <ClipboardList size={22} />,
    path: "/configuracoes/pre-testes",
  },
  {
    title: "Banco de Exercícios",
    description: "Gerencie sua biblioteca de exercícios",
    icon: <Dumbbell size={22} />,
    path: "/bancoexercicios",
  },
  {
    title: "Treinos Executados",
    description: "Visualize e analise treinos realizados",
    icon: <History size={22} />,
    path: "/treinosexecutados",
  },
  {
    title: "Integrações",
    description: "Conecte com outras plataformas",
    icon: <Link size={22} />,
    path: "/paciente/integracoes",
  },
  {
    title: "Base de Dados - Usuários",
    description: "Gerencie usuários da clínica",
    icon: <Users size={22} />,
    path: "/banco-usuarios",
  },
];


  useEffect(() => {
    const fetchTotalPacientes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/total-pacientes/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        setTotalPacientes(data.total);
      } catch (error) {
        console.error("Erro ao buscar total de pacientes:", error);
      }
    };

    if (token) {
      fetchTotalPacientes();
    }
  }, [token]);

  if (loading) return <div className="conteudo">Carregando...</div>;
  if (!user) return <div className="conteudo">Usuário não autenticado.</div>;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const roleLabel =
    user.role === "admin" ? "Administrador" : "Profissional";

  return (
    <div className="conteudo">

      {/* 🔹 HEADER */}
<div className="dashboard-header">
  <div className="header-left">
    <img
      src={user.photo_google || "/default-avatar.png"}
      alt="Foto do usuário"
      className="avatar-dashboard"
    />
    <div className="user-info">
      <h1 className="titulo-dashboard">Olá, {user.first_name}</h1>
      <p className="subtitulo-dashboard">
        {roleLabel} • {user.organizacao?.nome || "Clínica não definida"}
      </p>
    </div>
  </div>

  <div className="header-right">
    <div className="notificacao-wrapper">
      <button className="btn-notificacao" aria-label="Notificações">
        <NotificacaoBell />
      </button>
    </div>
  </div>
</div>


      {/* 🔹 VISÃO GERAL
      <div className="secao-titulo">
        <h2>Visão Geral</h2>
      </div>

      <div className="dashboard-grid">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card title="Pacientes cadastrados" subtitle="Total na clínica">
            <p style={{ fontSize: "1.25rem" }}>
              {totalPacientes !== null ? totalPacientes : "—"}
            </p>
          </Card>
        </motion.div>
      </div> */}

      {/* 🔹 ACESSOS RÁPIDOS */}
      <div className="secao-titulo">
        <h2>Acessos rápidos</h2>
      </div>
<div className="category-grid">
  {configItems.map((item, index) => (
    <motion.div
      key={item.path}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1 + index * 0.05, duration: 0.35 }}
      onClick={() => navigate(item.path)}
      style={{ cursor: "pointer" }}
    >
      <div className="config-card">
        <div className="card-content">
          <div className="card-icon">{item.icon}</div>
          <div className="card-text">
            <h3 className="card-title">{item.title}</h3>
            <p className="card-description">{item.description}</p>
          </div>
        </div>
        <div className="card-hover-effect"></div>
      </div>
    </motion.div>
  ))}
</div>

    </div>
  );
}