import { useEffect, useState } from "react";

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        Usamos cookies essenciais para garantir o funcionamento da plataforma.
        Ao continuar, você concorda com nossa{" "}
        <a href="/politica-privacidade" style={styles.link}>
          Política de Privacidade
        </a>.
      </p>
      <button style={styles.button} onClick={handleAccept}>
        Aceitar
      </button>
    </div>
  );
}

const styles = {
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: "1rem",
    background: "#1a1a1a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9999,
    boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
  },
  button: {
    background: "#00c853",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  link: {
    color: "#00e676",
    textDecoration: "underline",
  },
  text: {
    marginRight: "1rem",
    maxWidth: "80%",
  },
};
