import { useNavigate } from 'react-router-dom';
import '../components/css/Configuracoes.css';

export default function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div className="conteudo-configuracoes">
      <h1 className="text-2xl font-bold mb-6 text-center">Configurações</h1>

      <div className="coluna-botoes">
        <div className="coluna-esquerda">
        <button
          onClick={() => navigate('/configuracoes/pre-avaliacoes')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
        >
        📝 Cadastro de Avaliações Pré-Padronizadas
        </button>
      
        <button
          onClick={() => alert('Outro botão')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
        >
          Cadastro de Testes Pré-Padronizados
        </button>
        </div>

        <div className="coluna-direita">

        <button
          onClick={() => alert('Exemplo')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded"
        >
          Exemplo
        </button>

        <button
          onClick={() => navigate('/perfil')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded"
        >
          Perfil
        </button>
        </div>
      </div>
    </div>
  );
}
