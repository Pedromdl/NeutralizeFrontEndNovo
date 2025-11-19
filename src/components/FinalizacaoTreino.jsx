import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FinalizacaoTreino() {
  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(true);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    // 1️⃣ Spinner aparece por 1.8s
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(false);
      setShowCheck(true);
    }, 1800);

    // 2️⃣ Depois do check aparecer, aguarda mais 1.5s e redireciona
    const redirectTimer = setTimeout(() => {
      navigate("/paciente");
    }, 3500);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <>
      <div style={overlayStyles}>
        {/* Spinner */}
        {showSpinner && <div className="spinner"></div>}

        {/* Check + texto */}
        {showCheck && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s forwards" }}>
            <svg
              viewBox="0 0 52 52"
              style={{
                width: "100px",
                marginBottom: "10px",
                animation: "zoomIn 0.4s forwards",
              }}
            >
              <path
                d="M14 27l7 7 17-17"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p
              style={{
                color: "white",
                fontSize: "26px",
                marginTop: "5px",
                animation: "fadeIn 0.4s 0.2s forwards",
                opacity: 0,
              }}
            >
              Treino Finalizado
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes zoomIn {
          from { transform: scale(0.3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

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
      `}</style>
    </>
  );
}

const overlayStyles = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
