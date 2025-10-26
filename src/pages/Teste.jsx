import React, { useState } from "react";
import "./SpinnerTeste.css"; // CSS separado só para teste

export default function SpinnerTeste() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={() => setLoading(true)}>Ativar Spinner</button>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Entrando na conta...</p>
        </div>
      )}
    </div>
  );
}