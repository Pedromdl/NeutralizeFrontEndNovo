// hooks/useCep.js
import { useState, useCallback } from 'react';
import axios from 'axios';

export function useCep() {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState(null);

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = useCallback(async (cep) => {
    // Limpa erro anterior
    setErroCep(null);
    
    // Validação básica
    const cepLimpo = cep.replace(/\D/g, '');
    if (!cepLimpo || cepLimpo.length !== 8) {
      setErroCep('CEP deve conter 8 dígitos');
      return null;
    }

    setBuscandoCep(true);
    
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (response.data.erro) {
        setErroCep('CEP não encontrado');
        return null;
      }

      return {
        cep: cepLimpo,
        rua: response.data.logradouro || '',
        bairro: response.data.bairro || '',
        cidade: response.data.localidade || '',
        estado: response.data.uf || '',
        complemento: response.data.complemento || ''
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setErroCep('Erro ao buscar CEP. Tente novamente.');
      return null;
    } finally {
      setBuscandoCep(false);
    }
  }, []);

  // Formatar CEP na exibição
  const formatarCep = useCallback((cep) => {
    if (!cep) return '';
    const cepStr = cep.toString().replace(/\D/g, '');
    if (cepStr.length === 8) {
      return cepStr.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cepStr;
  }, []);

  // Aplicar máscara enquanto digita (função que estava faltando)
  const aplicarMascaraCep = useCallback((valor) => {
    if (!valor) return '';
    const cepNumerico = valor.replace(/\D/g, '');
    if (cepNumerico.length > 5) {
      return cepNumerico.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    }
    return cepNumerico;
  }, []);

  // Limpar erro
  const limparErro = useCallback(() => {
    setErroCep(null);
  }, []);

  return {
    buscarEnderecoPorCep,
    formatarCep,
    aplicarMascaraCep, // ← ESTA É A FUNÇÃO QUE ESTAVA FALTANDO
    buscandoCep,
    erroCep,
    limparErro
  };
}