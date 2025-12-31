import { useEffect, useState } from 'react'
import axios from 'axios'

function ModalExercicio({
  isOpen,
  onClose,
  treinoId,
  exerciciosDisponiveis = [],
  exercicioAtual = null,
  onSuccess
}) {
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null)
  const [observacao, setObservacao] = useState('')
  const [series, setSeries] = useState(1)
  const [repeticoes, setRepeticoes] = useState(10)
  const [carga, setCarga] = useState(0)
  const [loading, setLoading] = useState(false)

  // 🔥 NOVO: buffer local de exercícios
  const [listaExercicios, setListaExercicios] = useState([])

  const editando = Boolean(exercicioAtual?.id)

  useEffect(() => {
    if (!isOpen) return

    // sempre limpa a lista ao abrir
    setListaExercicios([])

    if (editando) {
      setExercicioSelecionado(exercicioAtual.orientacao_detalhes || null)
      setObservacao(exercicioAtual.observacao || '')
      setSeries(exercicioAtual.series_planejadas || 1)
      setRepeticoes(exercicioAtual.repeticoes_planejadas || 10)
      setCarga(exercicioAtual.carga_planejada || 0)
    } else {
      setExercicioSelecionado(null)
      setObservacao('')
      setSeries(1)
      setRepeticoes(10)
      setCarga(0)
    }
  }, [isOpen, editando, exercicioAtual])

  if (!isOpen) return null

  // ➕ adiciona exercício à lista local
  const handleAdicionarNaLista = () => {
    if (!exercicioSelecionado) return

    setListaExercicios(prev => [
      ...prev,
      {
        orientacao: exercicioSelecionado.id,
        series_planejadas: series,
        repeticoes_planejadas: repeticoes,
        carga_planejada: carga,
        observacao
      }
    ])

    // limpa formulário
    setExercicioSelecionado(null)
    setObservacao('')
    setSeries(1)
    setRepeticoes(10)
    setCarga(0)
  }

  const handleRemoverDaLista = (indexToRemove) => {
    setListaExercicios(prev =>
        prev.filter((_, index) => index !== indexToRemove)
    )
    }


  // 💾 salva todos (batch)
  const handleSalvarTodos = async () => {
    if (!listaExercicios.length || !treinoId) return

    setLoading(true)

    try {
      const payload = listaExercicios.map(ex => ({
        ...ex,
        treino: treinoId
      }))

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/exerciciosprescritos/batch/`,
        payload
      )

      onSuccess?.(res.data)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar exercícios')
    } finally {
      setLoading(false)
    }
  }

  // ✏️ edição individual (mantida)
  const handleSalvarEdicao = async () => {
    if (!exercicioSelecionado || !treinoId) return

    setLoading(true)

    const payload = {
      treino: treinoId,
      orientacao: exercicioSelecionado.id,
      series_planejadas: series,
      repeticoes_planejadas: repeticoes,
      carga_planejada: carga,
      observacao
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exerciciosprescritos/${exercicioAtual.id}/`,
        payload
      )

      onSuccess?.(res.data)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erro ao editar exercício')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-conteudo">
        <h2>{editando ? 'Editar Exercício' : 'Adicionar Exercícios'}</h2>

        <div className="modal-form">
          <label>
            Exercício
            <select
              value={exercicioSelecionado?.id || ''}
              onChange={(e) => {
                const ex = exerciciosDisponiveis.find(
                  item => item.id === Number(e.target.value)
                )
                setExercicioSelecionado(ex || null)
              }}
            >
              <option value="">Selecione um exercício</option>
              {exerciciosDisponiveis.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.titulo}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-inputs">
            <label>
              Séries
              <input
                type="number"
                min="1"
                value={series}
                onChange={e => setSeries(Number(e.target.value) || 1)}
              />
            </label>

            <label>
              Repetições
              <input
                type="number"
                min="1"
                value={repeticoes}
                onChange={e => setRepeticoes(Number(e.target.value) || 1)}
              />
            </label>

            <label>
              Carga
              <input
                type="number"
                min="0"
                value={carga}
                onChange={e => setCarga(Number(e.target.value) || 0)}
              />
            </label>
          </div>

          <label>
            Observação
            <input
              type="text"
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
            />
          </label>
        </div>

        {/* 📋 lista local */}
        {!editando && listaExercicios.length > 0 && (
          <div className="lista-exercicios">
            <h4>Exercícios adicionados</h4>

{listaExercicios.map((ex, index) => (
  <div key={index} className="lista-item-wrapper">
    <div className="lista-item">
      <div className="lista-info">
        <strong>
          {
            exerciciosDisponiveis.find(o => o.id === ex.orientacao)?.titulo
          }
        </strong>
        <span>
          {ex.series_planejadas}x{ex.repeticoes_planejadas} • {ex.carga_planejada}kg
        </span>
      </div>
    </div>

    <button
      className="btn-remover"
      onClick={() => handleRemoverDaLista(index)}
      title="Remover exercício"
    >
      ✕
    </button>
  </div>
))}

          </div>
          
        )}

        <div className="modal-botoes">
          {editando ? (
            <button
              className="btn-salvar"
              onClick={handleSalvarEdicao}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          ) : (
            <>
              <button
                className="btn-secundario"
                onClick={handleAdicionarNaLista}
              >
                Adicionar à lista
              </button>

              <button
                className="btn-salvar"
                onClick={handleSalvarTodos}
                disabled={loading || listaExercicios.length === 0}
              >
                {loading ? 'Salvando...' : 'Salvar todos'}
              </button>
            </>
          )}

          <button
            className="btn-resetar"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalExercicio
