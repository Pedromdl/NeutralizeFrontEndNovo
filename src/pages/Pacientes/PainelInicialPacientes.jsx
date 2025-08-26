import { useEffect, useState, useContext } from "react";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      // 🔹 Mock de estatísticas
      const mockData = {
        totalPastas: 4,
        totalSecoes: 12,
        totalExercicios: 48,
        ultimoTreino: {
          nome: "Fortalecimento de Quadril",
          data: "20/08/2025",
        },
        progresso: {
          forca: 70,
          mobilidade: 85,
          dor: 20, // menor é melhor
        },
      };
      setStats(mockData);
    }
  }, [user, loading]);

  if (loading) return <Card title="Bem-vindo" size="al">Carregando...</Card>;
  if (!user) return <Card title="Bem-vindo" size="al">Usuário não autenticado.</Card>;

  // 🔹 Preparando dados para o gráfico
  const progressoData = [
    { nome: "Força", valor: stats?.progresso.forca },
    { nome: "Mobilidade", valor: stats?.progresso.mobilidade },
    { nome: "Dor", valor: stats?.progresso.dor },
  ];

  return (
    <div className="conteudo">
      <h1>Olá, {user?.first_name || "Paciente"} 👋</h1>

      {/* Grid de cards */}
      <div className="dashboard-grid"      >
        <Card title="Resumo" size="sm">
          <p>📁 Pastas: {stats?.totalPastas}</p>
          <p>📑 Seções: {stats?.totalSecoes}</p>
          <p>🏋️ Exercícios: {stats?.totalExercicios}</p>
        </Card>

        <Card title="Último Treino" size="sm">
          <p><strong>{stats?.ultimoTreino.nome}</strong></p>
          <p>📅 {stats?.ultimoTreino.data}</p>
        </Card>

        <Card title="Meu Progresso" size="sm">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressoData}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
