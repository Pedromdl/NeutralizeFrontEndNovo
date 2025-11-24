import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutModal = ({ plano, onClose, onSuccess }) => {
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
  
  const [assinaturaAtual, setAssinaturaAtual] = useState(null);
  const [loading, setLoading] = useState(false);

  // Buscar assinatura existente ao abrir modal
  useEffect(() => {
    const buscarAssinaturaAtual = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/assinatura/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.assinatura) {
          setAssinaturaAtual(response.data.assinatura);
          console.log('📋 Assinatura atual:', response.data.assinatura);
          
          // Verificar se pode ser ativada
          if (response.data.assinatura.status !== 'aguardando_pagamento') {
            alert('❌ Esta assinatura não pode ser ativada com cartão.');
            onClose();
          }
        } else {
          alert('❌ Nenhuma assinatura encontrada. Crie uma assinatura primeiro.');
          onClose();
        }
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        alert('❌ Erro ao carregar assinatura.');
        onClose();
      }
    };

    buscarAssinaturaAtual();
  }, []);

  const processarPagamento = async () => {
    const token = localStorage.getItem('access');
    
    if (!token) {
      alert('❌ Usuário não autenticado.');
      return;
    }

    // 🔥 VALIDAÇÃO: Verificar se temos assinatura para ativar
    if (!assinaturaAtual || assinaturaAtual.status !== 'aguardando_pagamento') {
      alert('❌ Não foi possível encontrar uma assinatura para ativar.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 [DEBUG] Ativando assinatura existente...');
      
      // 🔥 ATIVAR assinatura existente com cartão
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assinatura/${assinaturaAtual.id}/ativar-com-cartao/`,
        {
          dados_cartao: {
            ...dadosCartao,
            number: dadosCartao.number.replace(/\s/g, ''),
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data.success) {
        alert('✅ Pagamento processado! Assinatura ativada.');
        onSuccess(response.data.assinatura);
      } else {
        alert(`Erro: ${response.data.error}`);
      }

    } catch (error) {
      console.error('❌ Erro:', error);
      
      if (error.response) {
        alert(`Erro ${error.response.status}: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        alert('❌ Não foi possível conectar com o servidor.');
      } else {
        alert(`Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Funções de formatação
  const formatarNumeroCartao = (valor) => {
    return valor.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatarCPF = (valor) => {
    return valor.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatarCEP = (valor) => {
    return valor.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatarTelefone = (valor) => {
    return valor.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Handlers
  const handleNumeroCartaoChange = (e) => {
    const valorFormatado = formatarNumeroCartao(e.target.value);
    setDadosCartao({...dadosCartao, number: valorFormatado});
  };

  const handleCPFChange = (e) => {
    const valorFormatado = formatarCPF(e.target.value);
    setDadosCartao({...dadosCartao, cpfCnpj: valorFormatado});
  };

  const handleCEPChange = (e) => {
    const valorFormatado = formatarCEP(e.target.value);
    setDadosCartao({...dadosCartao, postalCode: valorFormatado});
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setDadosCartao({...dadosCartao, phone: valorFormatado});
  };

  const handleCelularChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setDadosCartao({...dadosCartao, mobilePhone: valorFormatado});
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Finalizar Assinatura</h2>
          <button onClick={onClose} className="btn-fechar">×</button>
        </div>
        
        <div className="plano-info">
          <h3>{plano.nome}</h3>
          <p className="preco-destaque">R$ {plano.preco_mensal}/mês</p>
        </div>

        <div className="form-section">
          <h4>📋 Dados Pessoais</h4>
          <div className="form-cartao">
            <div className="input-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={dadosCartao.name}
                onChange={(e) => setDadosCartao({
                  ...dadosCartao, 
                  name: e.target.value,
                  holderName: e.target.value // Preenche automaticamente
                })}
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={dadosCartao.email}
                onChange={(e) => setDadosCartao({...dadosCartao, email: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>CPF/CNPJ *</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={dadosCartao.cpfCnpj}
                onChange={handleCPFChange}
                maxLength="18"
                disabled={loading}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>CEP *</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  value={dadosCartao.postalCode}
                  onChange={handleCEPChange}
                  maxLength="9"
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label>Número *</label>
                <input
                  type="text"
                  placeholder="123"
                  value={dadosCartao.addressNumber}
                  onChange={(e) => setDadosCartao({...dadosCartao, addressNumber: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Complemento</label>
              <input
                type="text"
                placeholder="Apto, bloco, etc."
                value={dadosCartao.addressComplement}
                onChange={(e) => setDadosCartao({...dadosCartao, addressComplement: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>Telefone *</label>
                <input
                  type="text"
                  placeholder="(00) 0000-0000"
                  value={dadosCartao.phone}
                  onChange={handleTelefoneChange}
                  maxLength="15"
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label>Celular</label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={dadosCartao.mobilePhone}
                  onChange={handleCelularChange}
                  maxLength="15"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>💳 Dados do Cartão</h4>
          <div className="form-cartao">
            <div className="input-group">
              <label>Nome no Cartão *</label>
              <input
                type="text"
                placeholder="Como está no cartão"
                value={dadosCartao.holderName}
                onChange={(e) => setDadosCartao({...dadosCartao, holderName: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Número do Cartão *</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={dadosCartao.number}
                onChange={handleNumeroCartaoChange}
                maxLength="19"
                disabled={loading}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>Validade *</label>
                <div className="row">
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength="2"
                    value={dadosCartao.expiryMonth}
                    onChange={(e) => setDadosCartao({
                      ...dadosCartao, 
                      expiryMonth: e.target.value.replace(/\D/g, '')
                    })}
                    disabled={loading}
                  />
                  <span style={{margin: '0 0.5rem', lineHeight: '3rem'}}>/</span>
                  <input
                    type="text"
                    placeholder="AAAA"
                    maxLength="4"
                    value={dadosCartao.expiryYear}
                    onChange={(e) => setDadosCartao({
                      ...dadosCartao, 
                      expiryYear: e.target.value.replace(/\D/g, '')
                    })}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>CVV *</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="3"
                  value={dadosCartao.ccv}
                  onChange={(e) => setDadosCartao({
                    ...dadosCartao, 
                    ccv: e.target.value.replace(/\D/g, '')
                  })}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          className="btn-pagar"
          onClick={processarPagamento}
          disabled={loading}
        >
          {loading ? '🔄 Processando...' : `💳 Assinar por R$ ${plano.preco_mensal}/mês`}
        </button>
        
        <p style={{
          textAlign: 'center', 
          marginTop: '1rem', 
          color: '#6c757d', 
          fontSize: '0.8rem',
          lineHeight: '1.4'
        }}>
          🔒 Pagamento 100% seguro processado pelo ASAAS
        </p>
      </div>
    </div>
  );
};

export default CheckoutModal;