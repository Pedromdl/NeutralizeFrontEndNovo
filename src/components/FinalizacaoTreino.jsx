import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FinalizacaoTreino() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("check"); 
  // ⬆️ Já inicia direto no "check", já que o spinner foi removido

  useEffect(() => {
    // Redirecionar após animação
    const timer = setTimeout(() => navigate("/paciente"), 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <div style={overlayStyles}>
        <div className="checkContainer">
          <svg viewBox="0 0 52 52" className="checkSvg">
            <path
              d="M14 27l7 7 17-17"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="checkText">Treino Finalizado</p>
        </div>
      </div>

      <style>{`
        .checkContainer {
          text-align: center;
          animation: fadeIn 0.5s forwards;
        }

        .checkSvg {
          width: 100px;
          margin-bottom: 10px;
          animation: zoomIn 0.4s forwards;
        }

        .checkText {
          color: white;
          font-size: 26px;
          margin-top: 5px;
          animation: fadeIn 0.4s 0.2s forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes zoomIn {
          from { transform: scale(0.3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// Mantém o overlay igual
export const overlayStyles = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
