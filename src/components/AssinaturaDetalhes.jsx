import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckoutModal from '../../src/components/CheckoutModal'; // Ajuste o caminho conforme sua estrutura
import './AssinaturaDetalhes.css';

const AssinaturaDetalhes = () => {
  const [assinatura, setAssinatura] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarPlanos, setMostrarPlanos] = useState(false);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const { assinaturaId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssinatura();
    fetchPlanos();
  }, [assinaturaId]);

  const fetchAssinatura = async () => {
    try {
      const token = localStorage.getItem('access');
      
      if (!token) {
        setError('Usuário não autenticado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const url = assinaturaId 
        ? `${import.meta.env.VITE_API_URL}/api/assinatura/${assinaturaId}/`
        : `${import.meta.env.VITE_API_URL}/api/assinatura/`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setAssinatura(response.data.assinatura);
      setTransacoes(response.data.transacoes || []);
      
      // 🔥 MOSTRAR PLANOS AUTOMATICAMENTE se trial expirado
      if (response.data.assinatura?.status === 'aguardando_pagamento') {
        setMostrarPlanos(true);
      }
    } catch (err) {
      console.error('❌ Erro fetchAssinatura:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Acesso não autorizado. Token inválido ou expirado.');
      } else if (err.response?.status === 404) {
        setError('Nenhuma assinatura encontrada');
      } else {
        setError('Erro ao carregar assinatura');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/planos/`
      );
      setPlanos(response.data.planos || []);
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
    }
  };

  const cancelarAssinatura = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assinatura/${assinatura.id}/cancelar/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Assinatura cancelada com sucesso!');
        fetchAssinatura();
      } else {
        alert(`Erro: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Erro cancelarAssinatura:', err);
      alert('Erro ao cancelar assinatura');
    }
  };

  // 🔥 NOVA FUNÇÃO: Abrir modal de checkout
  const abrirCheckout = (plano) => {
    setPlanoSelecionado(plano);
    setCheckoutAberto(true);
  };

  // 🔥 NOVA FUNÇÃO: Fechar modal de checkout
  const fecharCheckout = () => {
    setCheckoutAberto(false);
    setPlanoSelecionado(null);
  };

  // 🔥 NOVA FUNÇÃO: Processar sucesso do checkout
  const handleSucessoCheckout = (novaAssinatura) => {
    setCheckoutAberto(false);
    setPlanoSelecionado(null);
    setMostrarPlanos(false);
    
    // Recarregar dados da assinatura
    fetchAssinatura();
    
    // Mostrar mensagem de sucesso
    alert('🎉 Assinatura ativada com sucesso! Todas as funcionalidades estão liberadas.');
    
    // Se estava em trial expirado, recarregar a página para remover bloqueios
    if (assinatura?.status === 'aguardando_pagamento') {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // 🔥 FUNÇÃO ANTIGA (mantida para compatibilidade)
  const assinarPlano = async (planoId) => {
    try {
      const token = localStorage.getItem('access');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assinatura/criar/`,
        {
          plano_id: planoId,
          billing_type: 'credit_card'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Assinatura criada com sucesso!');
        fetchAssinatura();
        setMostrarPlanos(false);
      } else {
        alert(`Erro: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Erro assinarPlano:', err);
      alert('Erro ao processar assinatura');
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      trial: '#28a745',
      ativa: '#007bff',
      suspensa: '#dc3545',
      cancelada: '#6c757d',
      aguardando_pagamento: '#ffc107'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assinatura-detalhes">
      {/* 🔥 MODAL DE CHECKOUT */}
      {checkoutAberto && planoSelecionado && (
        <CheckoutModal 
          plano={planoSelecionado}
          onClose={fecharCheckout}
          onSuccess={handleSucessoCheckout}
        />
      )}

      {/* 🔥 CABEÇALHO ÚNICO */}
      <div className="assinatura-header">
        <h1>Minha Assinatura</h1>
        {assinatura && (
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(assinatura.status) }}
          >
            {assinatura.status_display}
          </span>
        )}
      </div>

      {/* 🔥 SEÇÃO DE ALERTA - Para trial expirado */}
      {assinatura?.status === 'aguardando_pagamento' && (
        <div className="alerta-importante">
          <div className="alerta-icon">⚠️</div>
          <div className="alerta-content">
            <h3>Seu trial expirou!</h3>
            <p>Para continuar usando todas as funcionalidades, assine um de nossos planos.</p>
          </div>
        </div>
      )}

      {/* 🔥 INFORMAÇÕES DA ASSINATURA (SEMPRE VISÍVEL) */}
      {assinatura && (
        <div className="assinatura-info">
          <div className="info-card">
            <h3>{assinatura.plano.nome}</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Valor:</label>
                <span>R$ {assinatura.plano.preco_mensal}/mês</span>
              </div>
              
              <div className="info-item">
                <label>Método de pagamento:</label>
                <span>{assinatura.metodo_pagamento_display}</span>
              </div>
              
              <div className="info-item">
                <label>Próximo pagamento:</label>
                <span>{formatarData(assinatura.data_proximo_pagamento)}</span>
              </div>
            </div>

            {assinatura.em_trial && (
              <div className="trial-info">
                🆓 <strong>Período de Trial</strong> até {formatarData(assinatura.data_fim_trial)}
              </div>
            )}

            {/* 🔥 BOTÃO PARA VER PLANOS - Aparece no trial ativo */}
            {assinatura.status === 'trial' && !mostrarPlanos && (
              <div className="acoes-trial">
                <button 
                  className="btn-ver-planos"
                  onClick={() => setMostrarPlanos(true)}
                >
                  📋 Ver Planos Disponíveis
                </button>
                <p className="texto-ajuda">
                  Conheça nossas opções para quando seu trial acabar
                </p>
              </div>
            )}
          </div>

          <div className="limites-card">
            <h3>Limites do Plano</h3>
            <ul>
              <li>📊 {assinatura.plano.max_pacientes} pacientes</li>
              <li>👥 {assinatura.plano.max_usuarios} usuários</li>
              <li>📝 {assinatura.plano.max_avaliacoes_mes || 'Ilimitadas'} avaliações/mês</li>
            </ul>
          </div>
        </div>
      )}

      {/* 🔥 SEÇÃO DE PLANOS - Controlada por estado */}
      {(mostrarPlanos || !assinatura || assinatura.status === 'aguardando_pagamento') && (
        <div className="planos-section">
          <div className="planos-header">
            <h2>📦 Escolha seu Plano</h2>
            <p>Selecione o plano ideal para o crescimento da sua clínica</p>
            
            {assinatura?.status === 'trial' && (
              <button 
                className="btn-fechar-planos"
                onClick={() => setMostrarPlanos(false)}
              >
                Voltar aos detalhes
              </button>
            )}
          </div>

          <div className="planos-grid">
            {planos.map((plano) => (
              <div key={plano.id} className="plano-card">
                <div className="plano-header">
                  <h3>{plano.nome}</h3>
                  <div className="plano-preco">
                    R$ {plano.preco_mensal}<span>/mês</span>
                  </div>
                </div>

                <div className="plano-beneficios">
                  <ul>
                    <li>✅ {plano.max_pacientes} pacientes</li>
                    <li>✅ {plano.max_usuarios} usuários</li>
                    <li>✅ {plano.max_avaliacoes_mes || 'Ilimitadas'} avaliações/mês</li>
                    {plano.dias_trial > 0 && (
                      <li>🆓 {plano.dias_trial} dias grátis</li>
                    )}
                  </ul>
                </div>

                <button 
                  className="btn-assinar"
                  onClick={() => abrirCheckout(plano)} // 🔥 AGORA USA A NOVA FUNÇÃO
                >
                  {assinatura?.status === 'aguardando_pagamento' ? 'Assinar Agora' : 'Selecionar Plano'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 HISTÓRICO E AÇÕES (só mostra se tem assinatura) */}
      {assinatura && assinatura.status !== 'aguardando_pagamento' && !mostrarPlanos && (
        <>
          <div className="transacoes-section">
            <h3>Histórico de Pagamentos</h3>
            
            {transacoes.length > 0 ? (
              <div className="transacoes-list">
                {transacoes.map((transacao) => (
                  <div key={transacao.id} className="transacao-item">
                    <div className="transacao-data">
                      <span>{formatarData(transacao.data_vencimento)}</span>
                      {transacao.data_pagamento && (
                        <span className="pago-em">
                          Pago em: {formatarData(transacao.data_pagamento)}
                        </span>
                      )}
                    </div>
                    <div className="transacao-valor">
                      R$ {transacao.valor}
                    </div>
                    <div className="transacao-status">
                      {transacao.status}
                    </div>
                    {transacao.url_boleto && (
                      <a href={transacao.url_boleto} target="_blank" rel="noopener noreferrer">
                        Ver Boleto
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma transação encontrada.</p>
            )}
          </div>

          {assinatura.status !== 'cancelada' && (
            <div className="actions">
              <button 
                className="btn-cancelar"
                onClick={cancelarAssinatura}
              >
                Cancelar Assinatura
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssinaturaDetalhes;