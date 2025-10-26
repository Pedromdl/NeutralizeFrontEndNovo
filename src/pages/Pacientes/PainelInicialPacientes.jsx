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
import "../../components/css/PaginaInicialPaciente.css";

export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [treinosDias, setTreinosDias] = useState([]);
  const [ultimaSecaoId, setUltimaSecaoId] = useState(null);
  const navigate = useNavigate();

  // 🔹 Busca estatísticas de treinos
  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/resumo_treinos/`)
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

  // 🔹 Busca última seção
  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`)
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

  // 🔹 Estados de carregamento
  if (loading)
    return (
      <div className="conteudo">
        <Card title="Bem-vindo" size="al">
          Carregando...
        </Card>
      </div>
    );

  if (!user)
    return (
      <div className="conteudo">
        <Card title="Bem-vindo" size="al">
          Usuário não autenticado.
        </Card>
      </div>
    );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="conteudo">
      <h1 className="titulo-dashboard">
        Olá, {user?.first_name || "Paciente"} 👋
      </h1>

      <div className="dashboard-grid">
        {/* 🔹 Card 1 - Treinos realizados */}
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

        {/* 🔹 Card 2 - Último treino */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card-status"
        >
          <Card title="Data do Último Treino" size="al">
            <p className="valor-secundario">
              {stats?.ultimoTreino?.data || "-"}
            </p>
          </Card>
        </motion.div>

        {/* 🔹 Card 3 - Atalho treino */}
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
              <span>Atalho rápido para treino</span>
            </button>
          </Card>
        </motion.div>

        {/* 🔹 Card 4 - Calendário */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.4 }}
          className="card-calendario"
        >
          <Card title="Calendário de Treinos" size="md">
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
