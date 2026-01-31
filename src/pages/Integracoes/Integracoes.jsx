import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Contact from "../../../src/images/contatos.png";


export default function Integracoes() {
    const [googleConnected, setGoogleConnected] = useState(false);
    const [stravaData, setStravaData] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [showDistancia, setShowDistancia] = useState(false);
    const [showFreq, setShowFreq] = useState(true);
    const [showTempo, setShowTempo] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);

    const connectedParam = query.get("strava_connected");
    const googleConnectedParam = query.get("google_connected");

    const token = localStorage.getItem("token"); // JWT ou token de sessão

    // ===================== FUNÇÕES =====================

    const fetchStravaData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/strava/status/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStravaData(res.data);

            if (res.data.conectado) {
                const atividadesRes = await axios.get(`${API_URL}/api/strava/atividades/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
    };

    const handleConnect = () => {
        const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
        const REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_STRAVA_REDIRECT_URI);
        const SCOPE = encodeURIComponent(import.meta.env.VITE_STRAVA_SCOPE);

        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${REDIRECT_URI}` +
            `&approval_prompt=auto` +
            `&scope=${SCOPE}` +
            `&state=${encodeURIComponent(token)}`;

        window.location.href = authUrl;
    };

    const handleDisconnect = async () => {
        try {
            await axios.post(`${API_URL}/api/strava/desconectar/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (err) {
            console.error("Erro ao desconectar Strava:", err);
        }
    };

    const handleGoogleConnect = () => {
        const token = localStorage.getItem("token"); // seu JWT
        const GOOGLE_CONNECT_URL = `${API_URL}/api/google/contacts/connect/?token=${token}`;

        window.location.href = GOOGLE_CONNECT_URL;
    };

    const handleGoogleDisconnect = async () => {
        try {
            await axios.post(`${API_URL}/api/google/contacts/disconnect/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGoogleConnected(false);
        } catch (err) {
            console.error("Erro ao desconectar Google:", err);
            alert("Erro ao desconectar a conta Google");
        }
    };

    const fetchGoogleContacts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/google/contacts/list/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Contatos Google:", res.data);
            // Aqui você pode atualizar um state para mostrar os contatos
        } catch (err) {
            console.error("Erro ao buscar contatos Google:", err.response || err);
        }
    };

    const fetchGoogleStatus = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/google/contacts/status/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGoogleConnected(res.data.conectado);
        } catch (err) {
            console.error("Erro ao buscar status do Google", err);
        }
    };

    useEffect(() => {
        fetchStravaData();
        fetchGoogleStatus();

        if (connectedParam === "1") {
            navigate(location.pathname, { replace: true });
        }

        if (googleConnectedParam === "1") {
            setGoogleConnected(true);
            navigate(location.pathname, { replace: true });
        }
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const googleConnectedParam = query.get("google_connected");

        if (googleConnectedParam === "1") {
            setGoogleConnected(true); // atualiza botão
            navigate(location.pathname, { replace: true }); // remove query da URL
        }
    }, [location]);

    // ===================== EFFECT =====================
    useEffect(() => {
        fetchStravaData();

        if (connectedParam === "1") {
            const cleanUrl = location.pathname;
            navigate(cleanUrl, { replace: true });
        }

        if (googleConnectedParam === "1") {
            setGoogleConnected(true);
            const cleanUrl = location.pathname;
            navigate(cleanUrl, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_URL]);

    // ===================== RENDER =====================
    return (
        <div className="integracao-page">
            <h1 className="integracoes-title">Integrações</h1>

            <div className="integracoes-container">

                {/* GRID DOS CARDS */}
                {/* ================= STRAVA ================= */}
                {/*             <div className="integracao-card">
                <div className="integracao-header">
                    <div className="integracao-header-left">
                        <Activity color="#fc5200" size={22} />
                        <h2>Strava</h2>
                    </div>
                    {stravaData?.conectado ? (
                        <div className="integracao-actions">
                            <button className="btn-outline" onClick={fetchStravaData}>
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

                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 20 }} />

                                            {showDistancia && (
                                                <Bar yAxisId="left" dataKey="distancia" name="Distância (km)" fill="#fc5200" barSize={30} />
                                            )}
                                            {showTempo && (
                                                <Bar yAxisId="left" dataKey="tempo" name="Tempo (min)" fill="#6b46c1" barSize={30} opacity={0.7} />
                                            )}
                                            {showFreq && (
                                                <>
                                                    <Line yAxisId="right" type="monotone" dataKey="freqMedia" stroke="#2b6cb0" name="Frequência Média" />
                                                    <Line yAxisId="right" type="monotone" dataKey="freqMax" stroke="#e53e3e" name="Frequência Máxima" />
                                                    <Line yAxisId="right" type="monotone" dataKey="freqMin" stroke="#38a169" name="Frequência Mínima" />
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
            </div> */}

                {/* ================= GOOGLE CONTACTS ================= */}
                <div className="integracao-card">
                    <div className="integracao-header">
                        <div className="integracao-header-left">
                            <img src={Contact} alt="Contact" style={{ width: "50px" }} />
                            <h2>Contatos do Google</h2>
                        </div>

                        {googleConnected ? (
                            <button className="btn-danger" onClick={handleGoogleDisconnect}>
                                Desconectar
                            </button>
                        ) : (
                            <button className="button" onClick={handleGoogleConnect}>
                                Conectar
                            </button>
                        )}
                    </div>

                    <div className="integracao-content">
                        {googleConnected ? (
                            <p>Conta Google conectada com sucesso.</p>
                        ) : (
                            <div className="integracao-info-empty">
                                Conecte sua conta Google para importar contatos.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
