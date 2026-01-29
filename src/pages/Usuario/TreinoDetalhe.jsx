import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Card from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import "../../components/css/TreinoDetalhe.css"
import {
  Edit,
  X,
  Copy,
  ChevronRight,
  ChevronDown,
  Plus
} from 'lucide-react'
import ModalExercicio from '../../components/ModalExercicio'

export default function TreinoDetalhe() {
  const { id } = useParams()

  const [secao, setSecao] = useState(null)
  const [treinosSecao, setTreinosSecao] = useState([])
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([])

  const [novoTreinoAtivo, setNovoTreinoAtivo] = useState(false)
  const [novoNomeTreino, setNovoNomeTreino] = useState('')

  const [treinoEditandoId, setTreinoEditandoId] = useState(null)
  const [nomeEdicao, setNomeEdicao] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [treinoSelecionado, setTreinoSelecionado] = useState(null)
  const [exercicioSelecionadoParaEditar, setExercicioSelecionadoParaEditar] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =======================
  // 🔹 CARREGAR DADOS
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const resTreinos = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/treinos/?secao=${id}`
        )

        const tituloSecao = resTreinos.data[0]?.secao_titulo || 'Seção'

        setTreinosSecao(
          resTreinos.data.map(t => ({
            ...t,
            expandido: false,
            exerciciosDoTreino: t.exercicios || []
          }))
        )

        setSecao({ id, titulo: tituloSecao })

        const resExercicios = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bancoexercicios/`
        )
        setExerciciosDisponiveis(resExercicios.data)

        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('Erro ao carregar treinos')
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // =======================
  // 🔹 CRIAR TREINO
  // =======================
  const criarTreino = async () => {
    if (!novoNomeTreino.trim()) {
      setNovoTreinoAtivo(false)
      setNovoNomeTreino('')
      return
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/treinos/`,
        { secao: id, nome: novoNomeTreino }
      )

      setTreinosSecao(prev => [
        ...prev,
        { ...res.data, expandido: false, exerciciosDoTreino: [] }
      ])

      setNovoNomeTreino('')
      setNovoTreinoAtivo(false)
    } catch (err) {
      console.error(err)
      alert('Erro ao criar treino')
    }
  }

  // =======================
  // 🔹 DUPLICAR TREINO
  // =======================
  const duplicarTreino = async (treino) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/treinos/${treino.id}/duplicar/`
      )

      setTreinosSecao(prev => [
        ...prev,
        {
          ...res.data,
          expandido: false,
          exerciciosDoTreino: res.data.exercicios || []
        }
      ])
    } catch (err) {
      console.error(err)
      alert('Erro ao duplicar treino')
    }
  }

  // =======================
  // 🔹 RENOMEAR TREINO
  // =======================
  const salvarNomeTreino = async (treinoId) => {
    if (!nomeEdicao.trim()) return

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/treinos/${treinoId}/`,
        { nome: nomeEdicao }
      )

      setTreinosSecao(prev =>
        prev.map(t =>
          t.id === treinoId ? { ...t, nome: res.data.nome } : t
        )
      )

      setTreinoEditandoId(null)
      setNomeEdicao('')
    } catch (err) {
      console.error(err)
      alert('Erro ao renomear treino')
    }
  }

  // =======================
  // 🔹 MODAL
  // =======================
  const abrirModalAdicionar = (treino) => {
    setTreinoSelecionado(treino)
    setExercicioSelecionadoParaEditar(null)
    setModalAberto(true)
  }

  const abrirModalEditar = (exercicio, treino) => {
    setTreinoSelecionado(treino)
    setExercicioSelecionadoParaEditar(exercicio)
    setModalAberto(true)
  }

  // =======================
  // 🔹 ATUALIZAR ESTADO
  // =======================
  const atualizarEstadoAposSalvar = (resultado) => {
    const exerciciosSalvos = Array.isArray(resultado)
      ? resultado
      : [resultado]

    setTreinosSecao(prev =>
      prev.map(t => {
        if (t.id !== treinoSelecionado.id) return t

        if (exercicioSelecionadoParaEditar) {
          return {
            ...t,
            exerciciosDoTreino: t.exerciciosDoTreino.map(e =>
              e.id === exerciciosSalvos[0].id ? exerciciosSalvos[0] : e
            )
          }
        }

        return {
          ...t,
          exerciciosDoTreino: [
            ...t.exerciciosDoTreino,
            ...exerciciosSalvos
          ]
        }
      })
    )
  }

  // =======================
  // 🔹 EXCLUSÕES
  // =======================
  const excluirTreino = async (treinoId) => {
    if (!window.confirm('Deseja excluir este treino?')) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/treinos/${treinoId}/`
      )

      setTreinosSecao(prev =>
        prev.filter(t => t.id !== treinoId)
      )
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir treino')
    }
  }

  const excluirExercicio = async (exercicioId, treinoId) => {
    if (!window.confirm('Deseja excluir este exercício?')) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/exerciciosprescritos/${exercicioId}/`
      )

      setTreinosSecao(prev =>
        prev.map(t =>
          t.id === treinoId
            ? {
              ...t,
              exerciciosDoTreino: t.exerciciosDoTreino.filter(
                e => e.id !== exercicioId
              )
            }
            : t
        )
      )
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir exercício')
    }
  }

  // =======================
  // 🔹 ESTADOS
  // =======================
  if (loading) return <LoadingSpinner message="Carregando treinos..." />
  if (error) return <LoadingSpinner message={error} showTimeout />

  // =======================
  // 🔹 RENDER
  // =======================
  return (
    <div className="conteudo" style={{ gap: '20px' }}>
      <Card
        size="al"
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{secao?.titulo}</span>

            <button
              onClick={() => setNovoTreinoAtivo(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Plus size={16} />
              Adicionar Treino
            </button>
          </div>
        }
      />

      {novoTreinoAtivo && (
        <Card size="al">
          <input
            className="input treino-input"
            placeholder="Nome do treino"
            value={novoNomeTreino}
            autoFocus
            onChange={e => setNovoNomeTreino(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && criarTreino()}
            onBlur={criarTreino}
          />
        </Card>
      )}

      {treinosSecao.map(t => (
        <Card key={t.id} size="al">
          <div className="treino-header">
            <button
              className="btn-icon"
              onClick={() =>
                setTreinosSecao(prev =>
                  prev.map(tr =>
                    tr.id === t.id
                      ? { ...tr, expandido: !tr.expandido }
                      : tr
                  )
                )
              }
            >
              {t.expandido ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>

            {treinoEditandoId === t.id ? (
              <input
                className="input treino-input"
                value={nomeEdicao}
                onChange={e => setNomeEdicao(e.target.value)}
                onBlur={() => salvarNomeTreino(t.id)}
                autoFocus
              />
            ) : (
              <h3>{t.nome || 'Treino sem nome'}</h3>
            )}

            <div className="treino-acoes">
              <button
                className="btn-icon"
                onClick={() => {
                  setTreinoEditandoId(t.id)
                  setNomeEdicao(t.nome)
                }}
              >
                <Edit size={18} />
              </button>

              <button
                className="btn-icon"
                onClick={() => duplicarTreino(t)}
              >
                <Copy size={18} />
              </button>

              <button
                className="btn-icon danger"
                onClick={() => excluirTreino(t.id)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {t.expandido && (
            <>
              {t.exerciciosDoTreino.length > 0 ? (
                <div className="tabela-exercicios-wrapper">
                  <div className="tabela-exercicios">
                    <div className="tabela-header">
                      <div>Exercício</div>
                      <div>Séries</div>
                      <div>Reps</div>
                      <div>Carga</div>
                      <div>Obs.</div>
                      <div>Ações</div>
                    </div>

                    {t.exerciciosDoTreino.map(ex => (
                      <div key={ex.id} className="tabela-linha">
                        <div>{ex.orientacao_detalhes?.titulo}</div>
                        <div>{ex.series_planejadas}</div>
                        <div>{ex.repeticoes_planejadas}</div>
                        <div>{ex.carga_planejada}</div>
                        <div style={{ padding: '15px' }}>
                          {ex.observacao || '-'}
                        </div>

                        <div className="tabela-acoes">
                          <button onClick={() => abrirModalEditar(ex, t)}>
                            <Edit size={18} />
                          </button>
                          <button onClick={() => excluirExercicio(ex.id, t.id)}>
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ opacity: 0.6 }}>Nenhum exercício adicionado.</p>
              )}

              <button
                onClick={() => abrirModalAdicionar(t)}
                style={{ marginTop: '1rem' }}
              >
                Adicionar Exercício
              </button>
            </>
          )}
        </Card>
      ))}

      <ModalExercicio
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        treinoId={treinoSelecionado?.id}
        exerciciosDisponiveis={exerciciosDisponiveis}
        exercicioAtual={exercicioSelecionadoParaEditar}
        onSuccess={atualizarEstadoAposSalvar}
      />
    </div>
  )
}
