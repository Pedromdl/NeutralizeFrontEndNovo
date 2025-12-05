import { useEffect } from "react";
import axios from "axios";

export default function StravaCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const token = localStorage.getItem("access_token"); // JWT do seu login

    if (code && token) {
      axios.post(`${import.meta.env.VITE_API_URL}/strava/exchange-token/`, 
        { code }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // sucesso → redireciona para página de integrações
        window.location.href = "/configuracoes/strava";
      })
      .catch(err => console.error(err));
    }
  }, []);

  return <p>Conectando Strava...</p>;
}
