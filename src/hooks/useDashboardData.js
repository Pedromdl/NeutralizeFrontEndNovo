import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useDashboardData = (usuarioId, dataSelecionada) => {
  const [dados, setDados] = useState({
    forca: null,
    mobilidade: null,
    estabilidade: null,
    testedor: null,
    testefuncao: null
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarTodosDados = async () => {
      // Não busca se não tiver usuário
      if (!usuarioId) return;

      setCarregando(true);
      setErro(null);

      try {
        // 1. Definir os endpoints
        const endpoints = [
          'forca',
          'mobilidade', 
          'estabilidade',
          'testedor',
          'testefuncao'
        ];

        // 2. Construir parâmetros de query (igual ao que você já usa)
        const parametros = `paciente=${usuarioId}${
          dataSelecionada ? `&data_avaliacao=${dataSelecionada}` : ''
        }`;

        console.log(`🔄 Buscando dados para: ${parametros}`);

        // 3. Criar array de promises
        const promises = endpoints.map(async (endpoint) => {
          const response = await fetch(`${API_URL}/${endpoint}/?${parametros}`);
          
          if (!response.ok) {
            throw new Error(`Erro ${response.status} em ${endpoint}`);
          }
          
          return response.json();
        });

        // 4. Executar todas as requisições em paralelo
        const resultados = await Promise.all(promises);

        // 5. Organizar os dados no mesmo formato do estado
        const dadosOrganizados = {};
        endpoints.forEach((endpoint, index) => {
          dadosOrganizados[endpoint] = resultados[index];
        });

        console.log('✅ Dados carregados:', dadosOrganizados);
        setDados(dadosOrganizados);

      } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarTodosDados();
  }, [usuarioId, dataSelecionada]); // Reexecuta quando ID ou data mudar

  return { dados, carregando, erro };
};