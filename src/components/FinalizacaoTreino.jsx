import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FinalizacaoTreino() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("spinner"); // spinner | check | done

  useEffect(() => {
    // Spinner -> Check
    const timer1 = setTimeout(() => setPhase("check"), 1800);

    // Check -> Redirecionar
    const timer2 = setTimeout(() => navigate("/paciente"), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <>
      <div style={overlayStyles}>
        {phase === "spinner" && <div className="spinner"></div>}

        {phase === "check" && (
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
        )}
      </div>

      <style>{`
        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid #ddd;
          border-top: 6px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

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

// FinalizacaoTreino.jsx
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