import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanosList = () => {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🔍 DEBUG - Token:', token);
      console.log('🔍 DEBUG - URL completa:', `${import.meta.env.VITE_API_URL}/api/planos/`);
      
      if (!token) {
        setError('Usuário não autenticado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/planos/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Resposta recebida:', response.data);
      setPlanos(response.data.planos);
    } catch (err) {
      console.error('❌ Erro detalhado fetchPlanos:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        url: err.config?.url
      });
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Acesso não autorizado. Token inválido ou expirado.');
      } else if (err.response?.status === 404) {
        setError('Endpoint não encontrado. Verifique a URL da API.');
      } else {
        setError(`Erro ${err.response?.status || 'desconhecido'} ao carregar planos.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const assinarPlano = async (planoId, metodoPagamento) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/assinatura/criar/`, {
        plano_id: planoId,
        billing_type: metodoPagamento,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Assinatura criada com sucesso!');
        window.location.href = `/assinatura/${response.data.assinatura.id}`;
      } else {
        alert(`Erro: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Erro assinarPlano:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Acesso não autorizado. Faça login novamente.');
      } else if (err.response) {
        alert(`Erro: ${err.response.data.error || 'Erro ao criar assinatura'}`);
      } else if (err.request) {
        alert('Erro de conexão. Verifique sua internet.');
      } else {
        alert('Erro inesperado ao criar assinatura');
      }
    }
  };

  if (loading) return <div className="loading">Carregando planos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="planos-container">
      <h1>Escolha seu Plano</h1>
      
      <div className="planos-grid">
        {planos.map((plano) => (
          <PlanoCard 
            key={plano.id} 
            plano={plano} 
            onAssinar={assinarPlano}
          />
        ))}
      </div>
    </div>
  );
};

const PlanoCard = ({ plano, onAssinar }) => {
  const [metodoSelecionado, setMetodoSelecionado] = useState('PIX');

  return (
    <div className="plano-card">
      <div className="plano-header">
        <h3>{plano.nome}</h3>
        <div className="preco">R$ {plano.preco_mensal}/mês</div>
      </div>

      <div className="plano-descricao">
        <p>{plano.descricao}</p>
      </div>

      <div className="plano-recursos">
        <ul>
          <li>✓ {plano.max_pacientes} pacientes</li>
          <li>✓ {plano.max_usuarios} usuários</li>
          {plano.max_avaliacoes_mes && (
            <li>✓ {plano.max_avaliacoes_mes} avaliações/mês</li>
          )}
          {plano.dias_trial > 0 && (
            <li>✓ {plano.dias_trial} dias grátis</li>
          )}
        </ul>
      </div>

      <div className="metodo-pagamento">
        <label>
          <input
            type="radio"
            value="PIX"
            checked={metodoSelecionado === 'PIX'}
            onChange={(e) => setMetodoSelecionado(e.target.value)}
          />
          PIX
        </label>
        <label>
          <input
            type="radio"
            value="BOLETO"
            checked={metodoSelecionado === 'BOLETO'}
            onChange={(e) => setMetodoSelecionado(e.target.value)}
          />
          Boleto
        </label>
        <label>
          <input
            type="radio"
            value="CREDIT_CARD"
            checked={metodoSelecionado === 'CREDIT_CARD'}
            onChange={(e) => setMetodoSelecionado(e.target.value)}
          />
          Cartão de Crédito
        </label>
      </div>

      <button
        className="btn-assinar"
        onClick={() => onAssinar(plano.id, metodoSelecionado)}
      >
        Assinar Agora
      </button>
    </div>
  );
};

export default PlanosList;