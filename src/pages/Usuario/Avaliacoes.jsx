import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';


export default function Avaliacoes({ usuarioId }) {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!usuarioId) return;

        axios.get(`${import.meta.env.VITE_API_URL}/api/anamnese/?paciente=${usuarioId}`)
            .then((response) => setAvaliacoes(response.data))
            .catch((error) => console.error('Erro ao carregar avaliações:', error));
    }, [usuarioId]);

    const abrirAvaliacao = (id) => {
        navigate(`/avaliacoes/${id}`); // Ajuste a rota para seu detalhe de avaliação
    };

    return (
        <Card title="Avaliações do Paciente" size="al">
            {avaliacoes.length === 0 ? (
                <p>Nenhuma avaliação encontrada.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {avaliacoes.map(avaliacao => {
                        const [year, month, day] = avaliacao.data_avaliacao.split('-');
                        const dataFormatada = `${day}/${month}/${year}`;
                        return (
                            <li
                                key={avaliacao.id}
                                style={{ cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}
                                onClick={() => abrirAvaliacao(avaliacao.id)}
                            >
                                <strong>{`Avaliação em ${dataFormatada}`}</strong>
                            </li>
                        )
                    })}
                </ul>
            )}
        </Card>
    );
}
