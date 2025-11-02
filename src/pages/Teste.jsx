import React from "react";
import Cadenciometro from "../components/Cadenciometro";

export default function TesteCadenciometro() {
  const fasesExemplo = [
    { nome: "Excêntrico", duracao: 3, cor: "#00aaff", direcao: "descendo" },
    { nome: "Isométrico", duracao: 2, cor: "#ffcc00", direcao: "parado" },
    { nome: "Concêntrico", duracao: 3, cor: "#00cc66", direcao: "subindo" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>Teste do Cadenciômetro Animado</h1>
      <Cadenciometro fases={fasesExemplo} />
    </div>
  );
}
