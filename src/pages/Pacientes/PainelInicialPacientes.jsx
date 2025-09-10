import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/?paciente=${user.id}`)
        .then((res) => {
          const data = res.data;

          // 🔹 Ordena por data (caso backend não traga ordenado)
          const ordenados = [...data].sort(
            (a, b) => new Date(a.data) - new Date(b.data)
          );

          const totalTreinos = ordenados.length;
          const ultimoTreino = totalTreinos > 0 ? ordenados[ordenados.length - 1] : null;

          const statsBackend = {
            totalTreinosExecutados: totalTreinos,
            ultimoTreino: ultimoTreino
              ? { nome: ultimoTreino.treino.nome, data: new Date(ultimoTreino.data).toLocaleDateString("pt-BR") }
              : { nome: "Nenhum treino", data: "-" },
            evolucaoExercicios: [
              // Mantém mock por enquanto, até puxar cargas/reps de outro modelo
              { data: "01/08", agachamento: 40, prancha: 30, flexao: 20 },
              { data: "08/08", agachamento: 45, prancha: 35, flexao: 25 },
              { data: "15/08", agachamento: 50, prancha: 38, flexao: 30 },
              { data: "22/08", agachamento: 55, prancha: 42, flexao: 34 },
            ],
          };

          setStats(statsBackend);
        })
        .catch((err) => {
          console.error("Erro ao buscar treinos executados:", err);
        });
    }
  }, [user, loading]);

  if (loading) return <Card title="Bem-vindo">Carregando...</Card>;
  if (!user) return <Card title="Bem-vindo">Usuário não autenticado.</Card>;

  return (
    <div className="conteudo">
      <h1 className="text-2xl font-bold">
        Olá, {user?.first_name || "Paciente"} 👋
      </h1>

      <div className="cards-row">
        <Card title="Treinos Realizados" size="al">
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#282829" }}>
            {stats?.totalTreinosExecutados}
          </p>
        </Card>

        <Card title="Data do Último Treino" size="al">
          <p style={{ fontSize: "24px", color: "#282829"}}>
            {stats?.ultimoTreino.data}
          </p>
        </Card>
      </div>

      <Card title="Evolução por Exercício" size="al">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats?.evolucaoExercicios}>
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="agachamento" stroke="#4f46e5" />
            <Line type="monotone" dataKey="prancha" stroke="#10b981" />
            <Line type="monotone" dataKey="flexao" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
