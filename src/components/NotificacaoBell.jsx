// components/NotificacaoBell.jsx
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import "./NotificacaoBell.css";

export default function NotificacaoBell() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 🔹 Busca notificações da API
  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        // Substitua pela sua API real
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notificacoes/`);
        const data = await response.json();
        setNotificacoes(data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        // Fallback com dados de exemplo
      }
    };

    fetchNotificacoes();
  }, []);

  // 🔹 Marcar notificação como lida
  const marcarComoLida = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notificacoes/${id}/ler/`, {
        method: "PATCH",
      });
      
      setNotificacoes(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, lida: true } : notif
        )
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  // 🔹 Marcar todas como lidas
  const marcarTodasComoLidas = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notificacoes/marcar-todas-lidas/`, {
        method: "PATCH",
      });
      
      setNotificacoes(prev =>
        prev.map(notif => ({ ...notif, lida: true }))
      );
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="notificacao-wrapper">
      <button 
        className="btn-notificacao"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notificações"
      >
        <Bell size={24} />
        {notificacoesNaoLidas > 0 && (
          <span className="notificacao-badge">
            {notificacoesNaoLidas}
          </span>
        )}
      </button>

      {/* 🔹 Dropdown de Notificações */}
      {showNotifications && (
        <div className="notificacao-dropdown">
          <div className="notificacao-header">
            <h3>Notificações</h3>
            <div className="notificacao-actions">
              {notificacoesNaoLidas > 0 && (
                <button 
                  className="btn-marcar-todas"
                  onClick={marcarTodasComoLidas}
                >
                  Marcar todas como lida
                </button>
              )}
              <button 
                className="btn-fechar"
                onClick={() => setShowNotifications(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="notificacao-list">
            {notificacoes.length > 0 ? (
              notificacoes.map((notificacao) => (
                <div 
                  key={notificacao.id} 
                  className={`notificacao-item ${notificacao.lida ? 'lida' : 'nao-lida'}`}
                  onClick={() => !notificacao.lida && marcarComoLida(notificacao.id)}
                >
                  <p>{notificacao.mensagem}</p>
                  <span className="notificacao-time">
                    {new Date(notificacao.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))
            ) : (
              <p className="sem-notificacoes">Nenhuma notificação</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
