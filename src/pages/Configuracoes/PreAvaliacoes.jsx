import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import Card from '../../components/Card';

export default function PreAvaliacoes() {
    const navigate = useNavigate();

    const [avaliacoes, setAvaliacoes] = useState([]);
    const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');

    useEffect(() => {
        buscarAvaliacoes();
    }, []);

    const buscarAvaliacoes = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/preavaliacao/`);
            const data = await res.json();
            setAvaliacoes(data);
        } catch (err) {
            console.error('Erro ao buscar pré-avaliações:', err);
        }
    };

    const selecionarAvaliacao = (avaliacao) => {
        setAvaliacaoSelecionada(avaliacao);
        setTitulo(avaliacao.titulo || '');
        setConteudo(avaliacao.texto || '');
    };

    const salvar = async () => {
        const method = avaliacaoSelecionada ? 'PATCH' : 'POST';
        const url = avaliacaoSelecionada
            ? `${import.meta.env.VITE_API_URL}/api/preavaliacao/${avaliacaoSelecionada.id}/`
            : `${import.meta.env.VITE_API_URL}/api/preavaliacao/`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, texto: conteudo }),
            });

            if (!res.ok) throw new Error('Erro ao salvar');
            await buscarAvaliacoes();
            alert('Salvo com sucesso!');
        } catch (err) {
            alert('Erro ao salvar: ' + err.message);
        }
    };

    const excluir = async () => {
        if (!avaliacaoSelecionada) return;
        if (!window.confirm('Tem certeza que deseja excluir esta pré-avaliação?')) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/preavaliacao/${avaliacaoSelecionada.id}/`, {
                method: 'DELETE',
            });
            setAvaliacaoSelecionada(null);
            setTitulo('');
            setConteudo('');
            await buscarAvaliacoes();
        } catch (err) {
            alert('Erro ao excluir: ' + err.message);
        }
    };

    const opcoesSelect = avaliacoes.map((a) => ({ value: a.id, label: a.titulo }));

    return (
        <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
            <Card title="Pré-Avaliações" size="al">
                <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                    ← Voltar
                </button>

                <Select
                    options={opcoesSelect}
                    placeholder="Buscar pré-avaliações..."
                    onChange={(opt) => {
                        const selecionada = avaliacoes.find((a) => a.id === opt.value);
                        selecionarAvaliacao(selecionada);
                    }}
                    isClearable
                    styles={{
                        container: (base) => ({ ...base, marginBottom: '1rem' }),
                        control: (base) => ({
                            ...base,
                            borderRadius: '0.5rem', // arredondamento da borda
                            padding: '2px', // opcional: suaviza o layout
                        }),
                    }}
                />

                <input
                    type="text"
                    placeholder="Título da avaliação"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={{
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        fontSize: '1rem',
                        textAlign: 'center',
                        borderRadius: '0.5rem', // aqui também
                        border: '1px solid #ccc',
                    }}
                />

                <ReactQuill
                    theme="snow"
                    value={conteudo}
                    onChange={setConteudo}
                    style={{ marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={salvar} style={{ backgroundColor: '#b7de42', color: 'white' }}>
                        {avaliacaoSelecionada ? 'Salvar alterações' : 'Criar nova'}
                    </button>
                    {avaliacaoSelecionada && (
                        <button onClick={excluir} style={{ backgroundColor: '#dc2626', color: 'white' }}>
                            Excluir
                        </button>
                    )}
                </div>
            </Card>
        </div>
    );
}
