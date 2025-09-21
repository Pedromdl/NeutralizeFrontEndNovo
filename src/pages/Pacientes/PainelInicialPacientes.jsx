import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import "../../components/css/PaginaInicialPaciente.css"; // importe o CSS


export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [treinosDias, setTreinosDias] = useState([]);
  const [ultimaSecaoId, setUltimaSecaoId] = useState(null);
  const navigate = useNavigate();

  // 🔹 Busca stats e treinos
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

  // 🔹 Busca última seção dentro da pasta do paciente
  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`)
        .then((res) => {
          const pastas = res.data;
          if (pastas.length > 0) {
            // pega a primeira pasta do paciente (ou escolha outra lógica se houver múltiplas)
            const pasta = pastas[0];
            if (pasta.secoes && pasta.secoes.length > 0) {
              const ultimaSecao = pasta.secoes[pasta.secoes.length - 1]; // última criada
              setUltimaSecaoId(ultimaSecao.id);
            }
          }
        })
        .catch((err) => console.error("Erro ao buscar última seção:", err));
    }
  }, [user, loading]);

  if (loading) return <Card title="Bem-vindo">Carregando...</Card>;
  if (!user) return <Card title="Bem-vindo">Usuário não autenticado.</Card>;

  return (
    <div className="conteudo">
      <h1 className="text-2xl font-bold">Olá, {user?.first_name || "Paciente"} 👋</h1>

      <div className="cards-row">
        <Card title="Treinos Realizados" style={{ fontSize: "12px" }} size="al">
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#282829" }}>
            {stats?.totalTreinosExecutados}
          </p>
        </Card>

        <Card title="Data do Último Treino" style={{ fontSize: "12px" }} size="al">
          <p style={{ fontSize: "20px", color: "#282829" }}>
            {stats?.ultimoTreino?.data || "-"}
          </p>
        </Card>
      </div>

      <Card size="md">
        <DayPicker
          fromDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          toDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
          showOutsideDays={false}
          modifiers={{ treinos: treinosDias }}
          modifiersClassNames={{ treinos: "treino-dia" }}
          components={{ Caption: () => null }}
          locale={ptBR}
        />
      </Card>

      {/* 🔹 Botão de Atalho Rápido para Treino */}
      <div style={{ marginTop: "16px", textAlign: "center", width: "100%" }}>
        <button
          onClick={() => ultimaSecaoId && navigate(`/paciente/secao/${ultimaSecaoId}`)}
          disabled={!ultimaSecaoId}
          className="btn-atalho-treino"
        >
          <Dumbbell size={24} />
          <span>Atalho rápido para treino</span>
        </button>
      </div>

    </div>
  );
}
