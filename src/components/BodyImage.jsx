import React from "react";
import { muscleData } from "../data/muscleData";

export default function BodyWithAsymmetry() {
  // Função para calcular lado mais fraco e diferença percentual
  const getWeakSide = (E, D) => {
    const diff = Math.abs(E - D);
    const perc = Math.round((diff / Math.max(E, D)) * 100);
    return {
      side: E < D ? "E" : "D",
      value: perc,
    };
  };

  // Coordenadas de cada articulação
  const coords = {
    joelho: {
      E: { x: 2339, y: 4553, w: 350, h: 400, textX: 2500, textY: 4600 },
      D: { x: 1750, y: 4553, w: 350, h: 400, textX: 1800, textY: 4600 },
    },
    quadril: {
      E: { x: 2234, y: 2800, w: 594, h: 579, textX: 2400, textY: 2850 },
      D: { x: 1582, y: 2800, w: 594, h: 579, textX: 1600, textY: 2850 },
    },
    ombro: {
      E: { x: 2755, y: 1410, w: 327, h: 312, textX: 2800, textY: 1460 },
      D: { x: 1366, y: 1426, w: 327, h: 312, textX: 1400, textY: 1476 },
    },
    cotovelo: {
      E: { x: 3058, y: 2161, w: 327, h: 312, textX: 3100, textY: 2210 },
      D: { x: 1181, y: 2124, w: 327, h: 312, textX: 1200, textY: 2174 },
    },
    punho: {
      E: { x: 3631, y: 2896, w: 327, h: 312, textX: 3650, textY: 2946 },
      D: { x: 624, y: 2918, w: 327, h: 312, textX: 650, textY: 2968 },
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 800, margin: "0 auto" }}>
      {/* Fundo PNG */}
      <img
        src="/images/corpohumano.png"
        alt="Corpo humano"
        style={{ width: "100%", display: "block", borderRadius: 12 }}
      />

      {/* SVG sobreposto */}
      <svg
        viewBox="0 0 4431 7350"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {Object.keys(muscleData).map((area) => {
          const { E, D } = muscleData[area];
          const weak = getWeakSide(E, D);

          const rect = coords[area][weak.side];
          const textX = rect.textX;
          const textY = rect.textY;

          return (
            <g key={area}>
              {/* Retângulo do lado mais fraco */}
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.w}
                height={rect.h}
                fill="rgba(255,0,0,0.3)"
                stroke="#ff000055"
                strokeWidth={2}
              />

              {/* Texto de assimetria */}
                  <text
                      x={textX}
                      y={textY}
                      fill="black"
                      fontSize="90"       // Reduzi de 150 para 40
                      fontWeight="bold"
                      textAnchor="right"
                      dominantBaseline="right"
                  >
                      {`Assimetria ${weak.value}%`}
                  </text>

            </g>
          );
        })}
      </svg>
    </div>
  );
}
