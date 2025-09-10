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
  const [exercicios, setExercicios] = useState([]);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
  const [evolucao, setEvolucao] = useState([]);

  // Mostrar/ocultar linhas
  const [mostrarReps, setMostrarReps] = useState(true);
  const [mostrarCarga, setMostrarCarga] = useState(true);
  const [mostrarRPE, setMostrarRPE] = useState(true);

  // 🔹 Buscar treinos do paciente
  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/?paciente=${user.id}`)
        .then((res) => {
          const data = res.data;

          const ordenados = [...data].sort(
            (a, b) => new Date(a.data) - new Date(b.data)
          );

          const totalTreinos = ordenados.length;
          const ultimoTreino = totalTreinos > 0 ? ordenados[ordenados.length - 1] : null;

          // 🔹 Extrair lista de exercícios únicos
          const exercsSet = new Map();
          ordenados.forEach(exec => {
            exec.exercicios.forEach(ex => {
              const id = ex.exercicio;
              const nome = ex.series[0]?.exercicio?.orientacao_detalhes?.titulo || `Exercício ${id}`;
              if (!exercsSet.has(id)) exercsSet.set(id, { id, nome });
            });
          });
          const listaExercicios = Array.from(exercsSet.values());
          setExercicios(listaExercicios);

          if (!exercicioSelecionado && listaExercicios.length > 0) {
            setExercicioSelecionado(listaExercicios[0].id);
          }

          const statsBackend = {
            totalTreinosExecutados: totalTreinos,
            ultimoTreino: ultimoTreino
              ? { nome: ultimoTreino.treino?.nome || "Treino", data: new Date(ultimoTreino.data).toLocaleDateString("pt-BR") }
              : { nome: "Nenhum treino", data: "-" },
          };

          setStats(statsBackend);
        })
        .catch((err) => console.error("Erro ao buscar treinos executados:", err));
    }
  }, [user, loading]);

  // 🔹 Buscar evolução do exercício selecionado
// 🔹 Buscar evolução do exercício selecionado
useEffect(() => {
  if (!exercicioSelecionado || !user) return;

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/treinosexecutados/?paciente=${user.id}`)
    .then((res) => {
      const treinos = res.data;
      console.log("Treinos recebidos do backend:", treinos);

      const evolucaoPorData = {};

      treinos.forEach((treino) => {
        const dataFormatada = new Date(treino.data).toLocaleDateString("pt-BR");

        treino.exercicios.forEach((ex) => {
          if (ex.exercicio === Number(exercicioSelecionado)) {
            ex.series.forEach((serie) => {
              const reps = serie.repeticoes;
              const carga = Number(serie.carga);
const rpe = ex.rpe !== undefined && ex.rpe !== null ? Number(ex.rpe) : null;

              if (!evolucaoPorData[dataFormatada]) {
                evolucaoPorData[dataFormatada] = { data: dataFormatada, repeticoes: reps, carga, rpe };
              } else {
                evolucaoPorData[dataFormatada].repeticoes = Math.max(evolucaoPorData[dataFormatada].repeticoes, reps);
                evolucaoPorData[dataFormatada].carga = Math.max(evolucaoPorData[dataFormatada].carga, carga);
                // Atualiza RPE apenas se existir
if (rpe !== null) {
  evolucaoPorData[dataFormatada].rpe = 
    evolucaoPorData[dataFormatada].rpe != null 
      ? Math.max(evolucaoPorData[dataFormatada].rpe, rpe)
      : rpe;
}

              }
            });
          }
        });
      });
      

      const evolucaoArray = Object.values(evolucaoPorData).sort(
        (a, b) => new Date(a.data) - new Date(b.data)
      );

      setEvolucao(evolucaoArray);
    })
    .catch((err) => console.error("Erro ao buscar evolução do exercício:", err));
}, [exercicioSelecionado, user]);


  // 🔹 Tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "8px" }}>
          <strong>{label}</strong>
          {mostrarReps && <div>Repetições: {data.repeticoes}</div>}
          {mostrarCarga && <div>Carga: {data.carga} kg</div>}
          {mostrarRPE && <div>RPE: {data.rpe ?? "-"}</div>}
        </div>
      );
    }
    return null;
  };

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
          <p style={{ fontSize: "24px", color: "#282829" }}>
            {stats?.ultimoTreino.data}
          </p>
        </Card>
      </div>

      <Card title="Evolução do Exercício" size="al">
        {/* 🔹 Select para escolher exercício */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="exercicio-select" style={{ fontWeight: 'bold', marginRight: '8px' }}>Exercício:</label>
          <select
            id="exercicio-select"
            value={exercicioSelecionado || ""}
            onChange={(e) => setExercicioSelecionado(e.target.value)}
          >
            <option value="" disabled>-- Selecione --</option>
            {exercicios.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.nome}</option>
            ))}
          </select>
        </div>

        {/* 🔹 Checkboxes para mostrar/ocultar linhas */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ marginRight: '12px' }}>
            <input type="checkbox" checked={mostrarReps} onChange={() => setMostrarReps(!mostrarReps)} />
            Repetições
          </label>
          <label style={{ marginRight: '12px' }}>
            <input type="checkbox" checked={mostrarCarga} onChange={() => setMostrarCarga(!mostrarCarga)} />
            Carga (kg)
          </label>
          <label>
            <input type="checkbox" checked={mostrarRPE} onChange={() => setMostrarRPE(!mostrarRPE)} />
            RPE
          </label>
        </div>

        {/* 🔹 Gráfico */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={evolucao}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="data" padding={{ left: 50, right: 50 }} />
            <YAxis padding={{ top: 10, bottom: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {mostrarReps && <Line type="monotone" dataKey="repeticoes" stroke="#4f46e5" name="Repetições" />}
            {mostrarCarga && <Line type="monotone" dataKey="carga" stroke="#10b981" name="Carga (kg)" />}
            {mostrarRPE && <Line type="monotone" dataKey="rpe" stroke="#ff3b3b" name="RPE" />}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
