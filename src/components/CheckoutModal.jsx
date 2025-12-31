import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CheckoutModal.module.css';

const CheckoutModal = ({ assinaturaId, plano, onClose, onSuccess }) => {
  const [assinaturaAtual, setAssinaturaAtual] = useState(null);
  const [organizacao, setOrganizacao] = useState(null);
  const [hasCardToken, setHasCardToken] = useState(false);
  const [dadosCartao, setDadosCartao] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    name: '',
    email: '',
    cpfCnpj: '',
    postalCode: '',
    addressNumber: '',
    addressComplement: '',
    phone: '',
    mobilePhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [modoPagamento, setModoPagamento] = useState('cartao_novo'); // 'cartao_novo' ou 'cartao_salvo'

  // ----------------------------------------------
  // BUSCAR ASSINATURA + ORGANIZAÇÃO
  // ----------------------------------------------
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          alert('Usuário não autenticado.');
          onClose();
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/assinatura/${assinaturaId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("🔎 RES DETALHES ASSINATURA:", res.data);

        setAssinaturaAtual(res.data.assinatura);
        setOrganizacao(res.data.organizacao);

        const tokenSalvo = res.data.organizacao?.credit_card_token;
        setHasCardToken(Boolean(tokenSalvo));

        // Se tem cartão salvo, oferece como opção padrão
        if (tokenSalvo) {
          setModoPagamento('cartao_salvo');
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao carregar informações da assinatura.');
        onClose();
      }
    };

    buscarDados();
  }, [assinaturaId, onClose]);

  // ----------------------------------------------
  // USAR CARTÃO SALVO
  // ----------------------------------------------
  const usarCartaoSalvo = async () => {
    const token = localStorage.getItem('access');
    if (!token) return alert('❌ Usuário não autenticado.');

    setLoading(true);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assinatura/${assinaturaId}/ativar-usando-token/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.data.success) {
        alert("✅ Assinatura ativada com sucesso!");
        onSuccess(resp.data.assinatura);
      } else {
        alert(resp.data.error || "Erro ao ativar assinatura.");
      }

    } catch (error) {
      console.error("Erro ao usar cartão salvo:", error);
      alert(error.response?.data?.error || "Erro ao ativar assinatura.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------
  // PAGAR COM CARTÃO NOVO
  // ----------------------------------------------
  const processarPagamento = async () => {
    // Se escolheu usar cartão salvo, chama a função específica
    if (modoPagamento === 'cartao_salvo') {
      return await usarCartaoSalvo();
    }

    // Caso contrário, processa com cartão novo
    const token = localStorage.getItem('access');
    if (!token) return alert('❌ Usuário não autenticado.');

    if (!dadosCartao.number || !dadosCartao.ccv || !dadosCartao.expiryMonth || !dadosCartao.expiryYear) {
      return alert("Preencha os dados do cartão.");
    }

    setLoading(true);

    try {
      const remoteIp = await fetch("https://api.ipify.org/?format=json")
        .then(r => r.json())
        .then(r => r.ip)
        .catch(() => null);

      const payload = {
        dados_cartao: {
          holderName: dadosCartao.holderName,
          number: dadosCartao.number.replace(/\s/g, ''),
          expiryMonth: dadosCartao.expiryMonth,
          expiryYear: dadosCartao.expiryYear,
          ccv: dadosCartao.ccv
        },
        holder_info: {
          name: dadosCartao.name,
          email: dadosCartao.email,
          cpfCnpj: dadosCartao.cpfCnpj.replace(/\D/g, ''),
          postalCode: dadosCartao.postalCode.replace(/\D/g, ''),
          addressNumber: dadosCartao.addressNumber,
          addressComplement: dadosCartao.addressComplement,
          phone: dadosCartao.phone.replace(/\D/g, ''),
          remoteIp
        }
      };

      console.log("📦 PAYLOAD:", payload);

      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assinatura/${assinaturaId}/ativar-com-cartao/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.data.success) {
        alert("✅ Pagamento realizado! Assinatura ativada.");
        onSuccess(resp.data.assinatura);
      } else {
        alert(resp.data.error || "Erro ao processar pagamento.");
      }

    } catch (error) {
      console.error("Erro ao pagar:", error);
      alert(error.response?.data?.error || "Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosCartao(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ----------------------------------------------
  // RENDER
  // ----------------------------------------------
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.checkoutModal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h2>Finalizar Assinatura</h2>
          <button className={styles.btnFechar} onClick={onClose}>×</button>
        </div>

        <div className={styles.planoInfo}>
          <h3>{plano.nome}</h3>
          <p className={styles.precoDestaque}>R$ {plano.preco_mensal}/mês</p>
        </div>

        {/* SELEÇÃO DO MODO DE PAGAMENTO */}
        {hasCardToken && (
          <div className={styles.selecaoPagamento}>
            <h4>Escolha como pagar:</h4>
            <div className={styles.opcoesPagamento}>
              <label className={styles.radioOpcao}>
                <input
                  type="radio"
                  name="modoPagamento"
                  value="cartao_salvo"
                  checked={modoPagamento === 'cartao_salvo'}
                  onChange={(e) => setModoPagamento(e.target.value)}
                />
                <span>🔒 Usar cartão salvo</span>
                <small>Pagamento rápido e seguro</small>
              </label>
              
              <label className={styles.radioOpcao}>
                <input
                  type="radio"
                  name="modoPagamento"
                  value="cartao_novo"
                  checked={modoPagamento === 'cartao_novo'}
                  onChange={(e) => setModoPagamento(e.target.value)}
                />
                <span>💳 Usar novo cartão</span>
                <small>Digite os dados do cartão</small>
              </label>
            </div>
          </div>
        )}

        {/* FORMULÁRIO DE CARTÃO NOVO (só aparece se selecionado) */}
        {modoPagamento === 'cartao_novo' && (
          <div className={styles.formCartao}>
            <h4>Dados do Cartão</h4>
            
            <div className={styles.formGroup}>
              <label>Nome no Cartão *</label>
              <input
                type="text"
                name="holderName"
                value={dadosCartao.holderName}
                onChange={handleInputChange}
                placeholder="Ex: JOÃO DA SILVA"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número do Cartão *</label>
              <input
                type="text"
                name="number"
                value={dadosCartao.number}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>

            <div className={styles.gridDuasColunas}>
              <div className={styles.formGroup}>
                <label>Validade (Mês) *</label>
                <input
                  type="text"
                  name="expiryMonth"
                  value={dadosCartao.expiryMonth}
                  onChange={handleInputChange}
                  placeholder="MM"
                  maxLength="2"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Validade (Ano) *</label>
                <input
                  type="text"
                  name="expiryYear"
                  value={dadosCartao.expiryYear}
                  onChange={handleInputChange}
                  placeholder="AAAA"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>CVV *</label>
              <input
                type="text"
                name="ccv"
                value={dadosCartao.ccv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>

            <h4>Dados do Titular</h4>
            
            <div className={styles.formGroup}>
              <label>Nome Completo *</label>
              <input
                type="text"
                name="name"
                value={dadosCartao.name}
                onChange={handleInputChange}
                placeholder="Nome completo"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>CPF/CNPJ *</label>
              <input
                type="text"
                name="cpfCnpj"
                value={dadosCartao.cpfCnpj}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={dadosCartao.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Telefone *</label>
              <input
                type="text"
                name="phone"
                value={dadosCartao.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>
        )}

        {/* BOTÃO DE FINALIZAR */}
        <div className={styles.botoesAcao}>
          <button
            className={modoPagamento === 'cartao_salvo' ? styles.btnCartaoSalvo : styles.btnCartaoNovo}
            onClick={processarPagamento}
            disabled={loading}
          >
            {loading ? '🔄 Processando...' : (
              modoPagamento === 'cartao_salvo' 
                ? `🔒 Confirmar com cartão salvo - R$ ${plano.preco_mensal}/mês`
                : `💳 Pagar com cartão novo - R$ ${plano.preco_mensal}/mês`
            )}
          </button>
          
          <button 
            className={styles.btnCancelar}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;