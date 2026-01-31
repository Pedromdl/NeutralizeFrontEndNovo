// components/ProtegidoPorAssinatura.jsx
import { useAssinatura } from '../context/AssinaturaContext';
import ModalPagamento from './ModalPagamento';

export default function ProtegidoPorAssinatura({ 
  children, 
  bloquearSeTrialExpirado = true 
}) {
  const { precisaPagamento, loading } = useAssinatura();

if (loading) {
  return children; // ou children direto
}

  if (bloquearSeTrialExpirado && precisaPagamento) {
    return <ModalPagamento />;
  }

  return children;
}