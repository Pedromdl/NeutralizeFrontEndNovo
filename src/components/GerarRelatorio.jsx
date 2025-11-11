import axios from 'axios';

export default function GerarRelatorio({ usuarioId, dataSelecionada }) {
  const gerarPDF = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/relatorio/${usuarioId}/pdf/`,
        {
          params: { data: dataSelecionada }, // envia a data para o backend
          responseType: 'blob', // importante para PDF
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${usuarioId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <button onClick={gerarPDF} className="btn-gerar-pdf" >
      Gerar PDF
    </button>
  );
}
