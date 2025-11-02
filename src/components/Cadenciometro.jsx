import { useState, useEffect } from "react";

export default function Cadenciometro({ fases = [] }) {
  if (!fases.length) return <p>Sem fases definidas</p>;

  const [faseAtual, setFaseAtual] = useState(0);
  const [tempo, setTempo] = useState(fases[0].duracao);
  const [altura, setAltura] = useState(
    fases[0].direcao === "subindo" ? 0 :
    fases[0].direcao === "descendo" ? 100 : 50
  );
  const [rodando, setRodando] = useState(true);

  useEffect(() => {
    if (!rodando) return;

    const totalSegundos = fases[faseAtual].duracao;
    const intervalo = 50; // ms, para animação suave
    const passos = totalSegundos * 1000 / intervalo;
    const fase = fases[faseAtual];

    let count = 0;
    const anim = setInterval(() => {
      count++;
      let novaAltura;

      if (fase.direcao === "subindo") {
        novaAltura = (count / passos) * 100;
      } else if (fase.direcao === "descendo") {
        novaAltura = 100 - (count / passos) * 100;
      } else {
        novaAltura = 50;
      }

      setAltura(novaAltura);

      if (count >= passos) {
        clearInterval(anim);
        if (faseAtual < fases.length - 1) {
          setFaseAtual(faseAtual + 1);
          setTempo(fases[faseAtual + 1].duracao);
        } else {
          setRodando(false);
        }
      }
    }, intervalo);

    return () => clearInterval(anim);
  }, [faseAtual, fases, rodando]);

  // Atualiza contador regressivo
  useEffect(() => {
    if (!rodando) return;
    const contador = setInterval(() => {
      setTempo((t) => (t > 0 ? t - 1 : t));
    }, 1000);
    return () => clearInterval(contador);
  }, [rodando]);

  const fase = fases[faseAtual];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "50px", height: "200px", border: "1px solid #ccc", borderRadius: "10px", overflow: "hidden", backgroundColor: "#eee" }}>
        <div style={{
          height: `${altura}%`,
          backgroundColor: fase.cor,
          transition: "height 50ms linear"
        }}></div>
      </div>
      <p style={{ fontWeight: "bold", marginTop: "10px" }}>{fase.nome}</p>
      <p style={{ fontSize: "24px" }}>{tempo}s</p>
      {!rodando && <p style={{ color: "green", marginTop: "10px" }}>Exercício concluído!</p>}
    </div>
  );
}
