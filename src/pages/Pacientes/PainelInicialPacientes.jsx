import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { motion } from "framer-motion";
import NotificacaoBell from "../../components/NotificacaoBell";
import "../../components/css/PaginaInicialPaciente.css";

export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [treinosDias, setTreinosDias] = useState([]);
  const [ultimaSecaoId, setUltimaSecaoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/resumo_treinos/`)
        .then((res) => {
          const data = res.data;
          setStats({
            totalTreinosExecutados: data.totalTreinosExecutados,
            ultimoTreino: data.ultimoTreino,
          });

          const dias =
            data.treinosExecutados?.map((d) => {
              const [dia, mes, ano] = d.split("/");
              return new Date(Number(ano), Number(mes) - 1, Number(dia));
            }) || [];
          setTreinosDias(dias);
        })
        .catch((err) => console.error("Erro ao buscar treinos:", err));
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/pastas/`)
        .then((res) => {
          const pastas = res.data;
          if (pastas.length > 0) {
            const pasta = pastas[0];
            if (pasta.secoes && pasta.secoes.length > 0) {
              const ultimaSecao = pasta.secoes[pasta.secoes.length - 1];
              setUltimaSecaoId(ultimaSecao.id);
            }
          }
        })
        .catch((err) => console.error("Erro ao buscar última seção:", err));
    }
  }, [user, loading]);

  if (loading) return <div className="conteudo">Carregando...</div>;
  if (!user) return <div className="conteudo">Usuário não autenticado.</div>;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="conteudo">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="titulo-dashboard">
            Olá, {user?.first_name || "Paciente"}
          </h1>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <img
              src={user?.photo_google || "/default-avatar.png"}
              alt="Foto do usuário"
              className="avatar-dashboard"
            />
            <NotificacaoBell />
          </div>
        </div>
      </div>

      {/* 🔹 SEÇÃO: STATUS GERAL */}
      <div className="secao-titulo">
        <h2>Status Geral</h2>
      </div>
      
      <div className="dashboard-grid">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card-status"
        >
          <Card title="Treinos Realizados" size="al">
            <p className="valor-principal">
              {stats?.totalTreinosExecutados}
            </p>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card-status"
        >
          <Card title="Último Treino Realizado" size="al">
            <p className="valor-secundario">
              {stats?.ultimoTreino?.data || "-"}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* 🔹 SEÇÃO: ATALHOS */}
      <div className="secao-titulo">
        <h2>Atalhos</h2>
      </div>
      
      <div className="dashboard-grid">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.4 }}
          className="card-atalho"
        >
          <Card size="md" className="atalho">
            <button
              onClick={() =>
                ultimaSecaoId && navigate(`/paciente/secao/${ultimaSecaoId}`)
              }
              disabled={!ultimaSecaoId}
              className="btn-atalho-treino"
            >
              <Dumbbell size={24} />
              <span>Atalho para último treino</span>
            </button>
          </Card>
        </motion.div>
      </div>

      {/* 🔹 SEÇÃO: CALENDÁRIO */}
      <div className="secao-titulo">
        <h2>Calendário de Treino</h2>
      </div>
      
      <div className="dashboard-grid">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.4 }}
          className="card-calendario"
        >
          <Card size="md">
            <div className="calendario-wrapper">
              <DayPicker
                fromDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                toDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                showOutsideDays={false}
                modifiers={{ treinos: treinosDias }}
                modifiersClassNames={{ treinos: "treino-dia" }}
                components={{ Caption: () => null }}
                locale={ptBR}
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}