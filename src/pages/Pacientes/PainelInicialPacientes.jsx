import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from 'date-fns/locale';


export default function DashboardPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [treinosDias, setTreinosDias] = useState([]);

  useEffect(() => {
    if (!loading && user) {
      const controller = new AbortController();
      let ativo = true;

      axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/resumo_treinos/`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!ativo) return;

          const data = res.data;

          setStats({  
            totalTreinosExecutados: data.totalTreinosExecutados,
            ultimoTreino: data.ultimoTreino,
          });

          // transforma todas as datas "dd/mm/yyyy" em objetos Date
          const dias = data.treinosExecutados?.map(d => {
            const [dia, mes, ano] = d.split('/');
            return new Date(Number(ano), Number(mes) - 1, Number(dia));
          }) || [];

          setTreinosDias(dias);
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
        <Card title="Treinos Realizados" style={{ fontSize: "12px" }}  size="al">
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
      locale={ptBR} // ← adiciona o idioma
    />
      </Card>
    </div>
  );
}
