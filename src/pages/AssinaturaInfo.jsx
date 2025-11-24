import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssinaturaInfo() {
  const [assinatura, setAssinatura] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 USA VARIÁVEL DE AMBIENTE
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [assinaturaRes, planosRes] = await Promise.all([
        axios.get(`${API_URL}/api/accounts/assinatura/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/accounts/planos/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setAssinatura(assinaturaRes.data);
      setPlanos(planosRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados da assinatura:', err);
      setError('Erro ao carregar informações da assinatura');
      
      // Se der 404, a clínica não tem assinatura ainda
      if (err.response?.status === 404) {
        setError('Sua clínica ainda não tem uma assinatura configurada');
      }
    } finally {
      setLoading(false);
    }
  };

  const fazerUpgrade = async (planoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/accounts/assinatura/upgrade/`, 
        { plano_id: planoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Plano alterado com sucesso!');
      carregarDados(); // Recarrega os dados
    } catch (err) {
      alert('Erro ao alterar plano: ' + (err.response?.data?.error || 'Erro desconhecido'));
    }
  };

  // 🔹 CORREÇÃO: Verificações antes de acessar propriedades
  if (loading) {
    return <div className="loading">Carregando informações da assinatura...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!assinatura) {
    return <div className="error-message">Nenhuma assinatura encontrada</div>;
  }

  // 🔹 CORREÇÃO: Verifica se assinatura.plano existe
  if (!assinatura.plano) {
    return <div className="error-message">Plano não configurado na assinatura</div>;
  }

  return (
    <div className="assinatura-info">
      <h3>📋 Sua Assinatura</h3>
      
      <div className="plano-atual card">
        <div className="plano-header">
          <strong>{assinatura.plano_nome || assinatura.plano?.nome}</strong>
          <span className={`status ${assinatura.status}`}>
            {assinatura.status === 'trial' ? 'Trial' : 'Ativa'}
          </span>
        </div>
        
        <div className="plano-details">
          <p>
            <strong>Pacientes:</strong> {assinatura.pacientes_cadastrados || 0} / 
            {assinatura.plano.max_pacientes === 0 ? ' Ilimitado' : ` ${assinatura.plano.max_pacientes}`}
          </p>
          
          <p>
            <strong>Usuários:</strong> {assinatura.plano.max_usuarios === 0 ? 'Ilimitados' : `Até ${assinatura.plano.max_usuarios}`}
          </p>
          
          {assinatura.em_trial && assinatura.data_fim_trial && (
            <p className="trial-info">
              ⏰ Trial até {new Date(assinatura.data_fim_trial).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>

      <h4>🔄 Alterar Plano</h4>
      <div className="planos-disponiveis">
        {planos.map(plano => (
          <div key={plano.id} className="plano-card card">
            <h5>{plano.nome}</h5>
            <p className="preco">R$ {plano.preco_mensal}/mês</p>
            
            <div className="plano-features">
              <p>📊 {plano.max_pacientes === 0 ? 'Pacientes ilimitados' : `Até ${plano.max_pacientes} pacientes`}</p>
              <p>👥 {plano.max_usuarios === 0 ? 'Usuários ilimitados' : `Até ${plano.max_usuarios} usuários`}</p>
              <p>📈 {plano.max_avaliacoes_mes === 0 ? 'Avaliações ilimitadas' : `Até ${plano.max_avaliacoes_mes} avaliações/mês`}</p>
            </div>
            
            <button 
              onClick={() => fazerUpgrade(plano.id)}
              disabled={plano.id === assinatura.plano.id}
              className={plano.id === assinatura.plano.id ? 'btn-current' : 'btn-upgrade'}
            >
              {plano.id === assinatura.plano.id ? 'Plano Atual' : 'Selecionar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}