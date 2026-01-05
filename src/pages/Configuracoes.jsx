import { useNavigate } from 'react-router-dom';
import { 
  Settings,  
  User, 
} from 'lucide-react';
import '../components/css/Configuracoes.css';

export default function Configuracoes() {
  const navigate = useNavigate();

  const configItems = [
    {
      title: "Dados da Conta",
      description: "Gerencie suas informações pessoais",
      icon: <User size={24} />,
      path: '/perfil',
    },
  ];

  return (
    <div className="conteudo-configuracoes">
      {/* Header */}
      <div className="config-header">
        <div className="config-header-content">
          <Settings size={32} className="config-icon" />
          <div>
            <h1 className="config-title">Configurações</h1>
            <p className="config-subtitle">
              Gerencie as configurações do sistema e personalize sua experiência
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Configuração */}
      <div className="config-grid">
        <div className="category-grid">
          {configItems.map((item, index) => (
            <div
              key={index}
              className="config-card"
              onClick={() => navigate(item.path)}
            >
              <div className="card-header">
                {/* Header vazio mantido para estrutura */}
              </div>
              
              <div className="card-content">
                <div className="card-icon">
                  {item.icon}
                </div>
                <div className="card-text">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                </div>
              </div>

              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}