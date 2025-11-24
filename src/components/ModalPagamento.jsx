// components/ModalPagamento.jsx
import { useAssinatura } from '../context/AssinaturaContext';
import { useNavigate } from 'react-router-dom';

export default function ModalPagamento() {
  const { assinatura } = useAssinatura();
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-pagamento">
        <div className="modal-header">
          <h2>🚀 Hora de Evoluir!</h2>
        </div>
        
        <div className="modal-body">
          <p>Seu período de trial gratuito acabou.</p>
          <p>Para continuar usando todas as funcionalidades, assine agora mesmo!</p>
          
          <div className="beneficios">
            <h4>O que você ganha assinando:</h4>
            <ul>
              <li>✅ Cadastro ilimitado de pacientes</li>
              <li>✅ Acesso a todos os relatórios</li>
              <li>✅ Suporte prioritário</li>
              <li>✅ Funcionalidades avançadas</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/assinatura')}
            >
              Assinar Agora - R$ {assinatura?.plano?.preco_mensal}/mês
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}