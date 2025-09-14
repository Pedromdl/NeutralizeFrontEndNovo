import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  // 🔹 Buscar treinos do paciente (apenas estatísticas)
  useEffect(() => {
  if (!loading && user) {
    const controller = new AbortController();
    let ativo = true;

    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/?paciente=${user.id}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!ativo) return; // 🔹 evita setState após unmount
        const data = res.data;
        setStats({
          totalTreinosExecutados: data.length,
          ultimoTreino: data.length
            ? {
                nome: data[data.length - 1].treino?.nome || "Treino",
                data: new Date(data[data.length - 1].data).toLocaleDateString("pt-BR"),
              }
            : { nome: "Nenhum treino", data: "-" },
        });
      })
      .catch((err) => {
        if (err.name === "CanceledError") {
          console.log("❌ Requisição de treinos cancelada");
        } else {
          console.error("Erro ao buscar treinos executados:", err);
        }
      });

    return () => {
      ativo = false;
      controller.abort();
    };
  }
}, [user, loading]);

  if (loading) return <Card title="Bem-vindo">Carregando...</Card>;
  if (!user) return <Card title="Bem-vindo">Usuário não autenticado.</Card>;

  return (
    <div className="conteudo">
      <h1 className="text-2xl font-bold">Olá, {user?.first_name || "Paciente"} 👋</h1>

      <div className="cards-row">
        <Card title="Treinos Realizados" size="al">
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#282829" }}>
            {stats?.totalTreinosExecutados}
          </p>
        </Card>

        <Card title="Data do Último Treino" size="al">
          <p style={{ fontSize: "24px", color: "#282829" }}>
            {stats?.ultimoTreino.data}
          </p>
        </Card>
      </div>
    </div>
  );
}
