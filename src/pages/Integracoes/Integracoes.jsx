import { useEffect, useState } from "react";
import axios from "axios";
import "./Integracoes.css";
import { Activity, Link, RefreshCw, Eye, EyeOff } from "lucide-react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function Integracoes() {
    const [stravaData, setStravaData] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [showDistancia, setShowDistancia] = useState(false);
    const [showFreq, setShowFreq] = useState(true);
    const [showTempo, setShowTempo] = useState(true);

    // 🔗 URL dinâmica (funciona em local e produção)
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`${API_URL}/api/strava/status/`);
                setStravaData(res.data);

                if (res.data.conectado) {
                    const atividadesRes = await axios.get(`${API_URL}/api/strava/atividades/`);
                    const formatadas = atividadesRes.data.map((a) => ({
                        nome: a.name,
                        tipo: a.type,
                        tempo: Math.round(a.moving_time / 60),
                        data: new Date(a.start_date_local).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                        }),
                        distancia: (a.distance / 1000).toFixed(2),
                        freqMedia: a.average_heartrate ? Math.round(a.average_heartrate) : null,
                        freqMax: a.max_heartrate ? Math.round(a.max_heartrate) : null,
                        freqMin: a.min_heartrate ? Math.round(a.min_heartrate) : null,
                    }));

                    setAtividades(formatadas.reverse().slice(-10));
                }
            } catch (err) {
                console.error("Erro ao buscar dados do Strava:", err);
                setErro("Falha ao carregar dados do Strava.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [API_URL]);

    const handleConnect = () => {
        window.location.href = `${API_URL}/api/strava/authorize/`;
    };

    const handleDisconnect = async () => {
        await axios.post(`${API_URL}/api/strava/desconectar/`);
        window.location.reload();
    };

    if (loading) return <div className="integracoes-loading">Carregando integrações...</div>;

    return (
        <div className="integracoes-container">
            <h1 className="integracoes-title">Integrações</h1>

            <div className="integracao-card">
                <div className="integracao-header">
                    <div className="integracao-header-left">
                        <Activity color="#fc5200" size={22} />
                        <h2>Strava</h2>
                    </div>
                    {stravaData?.conectado ? (
                        <div className="integracao-actions">
                            <button className="btn-outline" onClick={() => window.location.reload()}>
                                <RefreshCw size={16} /> Atualizar
                            </button>
                            <button className="btn-danger" onClick={handleDisconnect}>
                                Desconectar
                            </button>
                        </div>
                    ) : (
                        <button className="btn-primary" onClick={handleConnect}>
                            <Link size={16} /> Conectar Strava
                        </button>
                    )}
                </div>

                <div className="integracao-content">
                    {stravaData?.conectado ? (
                        <>
                            <div className="integracao-info-grid">
                                <p><strong>Nome:</strong> {stravaData.firstname} {stravaData.lastname}</p>
                                <p><strong>Cidade:</strong> {stravaData.city || "—"}</p>
                                <p><strong>País:</strong> {stravaData.country || "—"}</p>
                            </div>

                            {atividades.length > 0 && (
                                <div className="strava-grafico-container">
                                    <div className="grafico-header">
                                        <h3>Últimas atividades</h3>
                                        <div className="grafico-toggles">
                                            <button
                                                onClick={() => setShowDistancia(!showDistancia)}
                                                className={`grafico-toggle-btn ${showDistancia ? "ativo" : ""}`}
                                            >
                                                {showDistancia ? <EyeOff size={16} /> : <Eye size={16} />} Distância
                                            </button>
                                            <button
                                                onClick={() => setShowFreq(!showFreq)}
                                                className={`grafico-toggle-btn ${showFreq ? "ativo" : ""}`}
                                            >
                                                {showFreq ? <EyeOff size={16} /> : <Eye size={16} />} Frequência
                                            </button>
                                            <button
                                                onClick={() => setShowTempo(!showTempo)}
                                                className={`grafico-toggle-btn ${showTempo ? "ativo" : ""}`}
                                            >
                                                {showTempo ? <EyeOff size={16} /> : <Eye size={16} />} Tempo
                                            </button>
                                        </div>
                                    </div>

                                    <ResponsiveContainer width="100%" height={350}>
                                        <ComposedChart data={atividades}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="data" />
                                            <YAxis yAxisId="left" orientation="left" />
                                            <YAxis yAxisId="right" orientation="right" domain={[60, 200]} hide={!showFreq} />

                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        const atividade = atividades.find((a) => a.data === label);
                                                        return (
                                                            <div className="tooltip-custom">
                                                                <p className="tooltip-title">📅 {label}</p>
                                                                {atividade && (
                                                                    <>
                                                                        <p className="tooltip-info">
                                                                            🏃 <strong>Tipo:</strong> {atividade.tipo}
                                                                        </p>
                                                                        <p className="tooltip-info">
                                                                            ⏱ <strong>Tempo:</strong> {atividade.tempo} min
                                                                        </p>
                                                                    </>
                                                                )}
                                                                <hr className="tooltip-divider" />
                                                                {payload.map((entry, index) => (
                                                                    <p
                                                                        key={index}
                                                                        className="tooltip-value"
                                                                        style={{ color: entry.color }}
                                                                    >
                                                                        {entry.name}:{" "}
                                                                        {entry.name.includes("Distância")
                                                                            ? `${entry.value} km`
                                                                            : entry.name.includes("Frequência")
                                                                                ? `${entry.value} bpm`
                                                                                : `${entry.value} min`}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />

                                            <Legend
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                align="center"
                                                wrapperStyle={{ paddingTop: 20 }}
                                            />

                                            {showDistancia && (
                                                <Bar
                                                    yAxisId="left"
                                                    dataKey="distancia"
                                                    name="Distância (km)"
                                                    fill="#fc5200"
                                                    barSize={30}
                                                />
                                            )}
                                            {showTempo && (
                                                <Bar
                                                    yAxisId="left"
                                                    dataKey="tempo"
                                                    name="Tempo (min)"
                                                    fill="#6b46c1"
                                                    barSize={30}
                                                    opacity={0.7}
                                                />
                                            )}
                                            {showFreq && (
                                                <>
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="freqMedia"
                                                        stroke="#2b6cb0"
                                                        name="Frequência Média"
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="freqMax"
                                                        stroke="#e53e3e"
                                                        name="Frequência Máxima"
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="freqMin"
                                                        stroke="#38a169"
                                                        name="Frequência Mínima"
                                                    />
                                                </>
                                            )}
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="integracao-info-empty">
                            {erro
                                ? erro
                                : "Você ainda não conectou sua conta Strava. Clique no botão acima para integrar."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
