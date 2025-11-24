// context/AssinaturaContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AssinaturaContext = createContext();

export function AssinaturaProvider({ children }) {
  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarAssinatura = async () => {
    try {
      const token = localStorage.getItem('access');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/assinatura/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setAssinatura(response.data.assinatura);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      setAssinatura(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      carregarAssinatura();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    assinatura,
    loading,
    recarregarAssinatura: carregarAssinatura,
    precisaPagamento: assinatura?.status === 'aguardando_pagamento',
    emTrial: assinatura?.status === 'trial'
  };

  return (
    <AssinaturaContext.Provider value={value}>
      {children}
    </AssinaturaContext.Provider>
  );
}

export const useAssinatura = () => {
  const context = useContext(AssinaturaContext);
  if (!context) {
    throw new Error('useAssinatura deve ser usado dentro de AssinaturaProvider');
  }
  return context;
};