import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

import Card from '../components/Card';
import FiltroData from '../components/Dashboard/FiltroData';
import GraficoForca from '../components/Dashboard/GraficoForca';
import GraficoMobilidade from '../components/Dashboard/GraficoMobilidade';
import GraficoEstabilidade from '../components/Dashboard/GraficoEstabilidade';
import GraficoTesteDor from '../components/Dashboard/GraficoTestesDor';
import GraficoTesteFuncao from '../components/Dashboard/GraficoTestesFuncao';
import DadosUsuario from '../pages/Usuario/DadosUsuario'
import logo from '../images/logo3.png';

const containerAnimacao = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function RelatorioPublico({ usuarioSelecionado }) {
  const { token } = useParams();
  const [paciente, setPaciente] = useState(usuarioSelecionado || null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(!!token);

  useEffect(() => {
    async function fetchPaciente() {
      if (!token) {
        setPaciente(usuarioSelecionado);
        setCarregando(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/relatorio-publico/${token}/`);
        setPaciente(res.data);
      } catch (err) {
        console.error('Erro ao carregar relatório público:', err);
        setPaciente(null);
      } finally {
        setCarregando(false);
      }
    }
    fetchPaciente();
  }, [token, usuarioSelecionado]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'Não informada';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Carregando relatório...
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium text-red-600">
        Paciente não encontrado.
      </div>
    );
  }

  return (
    <div className="conteudo p-6" style={{ padding: 42, margin: '0 auto' }}>
      {/* Cabeçalho */}
      <motion.div {...containerAnimacao} className="cabeçalho-relatorio" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={logo} alt="Logo Neutralize" style={{ height: 60, width: 'auto' }} />
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>
            Neutralize - Avaliação Fisioterapêutica
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: 14, gap: 4, fontWeight: 'bold' }}>
          <span>Contato: (31) 99287-7639</span>
          <span>Instagram: @neutralize.ft</span>
          <span>neutralizeft.com.br</span>
        </div>
      </motion.div>

      {/* Título */}
      <motion.div {...containerAnimacao}>
        <h1 className="text-3xl font-bold text-center mb-2">
          Relatório Interativo — {paciente.nome}
        </h1>
        <p className="text-center text-gray-600">
          Dados atualizados automaticamente da plataforma Neutralize
        </p>
      </motion.div>

      {/* Filtro de Data */}
      <motion.div {...containerAnimacao} style={{ width: '100%', marginTop: 16 }}>
        <Card size="al">
          <FiltroData token={token} valorSelecionado={dataSelecionada} onChange={setDataSelecionada} />
        </Card>
      </motion.div>

      {/* Dados do Paciente */}
<motion.div {...containerAnimacao} style={{ width: '100%' }}>
  <DadosUsuario token={token} />
</motion.div>

      {/* Grid de Gráficos */}
      <div className="dashboard-grid mt-6">
  {[

    {
      title: "Força Muscular",
      comp: <GraficoForca token={token} dataSelecionada={dataSelecionada} />,
      size: "md",
    },
    {
      title: "Mobilidade",
      comp: <GraficoMobilidade token={token} dataSelecionada={dataSelecionada} />,
      size: "md",
    },
    {
      title: "Estabilidade",
      comp: <GraficoEstabilidade token={token} dataSelecionada={dataSelecionada} />,
      size: "lg",
    },
    {
      title: "Dor",
      comp: <GraficoTesteDor token={token} dataSelecionada={dataSelecionada} />,
      size: "sm",
    },
    {
      title: "Função",
      comp: <GraficoTesteFuncao token={token} dataSelecionada={dataSelecionada} />,
      size: "lg",
    },
  ].map((item, i) => (
    <motion.div
      key={item.title}
      style={{ display: 'contents' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * i, duration: 0.4 }}
    >
      <Card title={item.title} size={item.size}>
        {item.comp}
      </Card>
    </motion.div>
  ))}
</div>
    </div>
  );
}
