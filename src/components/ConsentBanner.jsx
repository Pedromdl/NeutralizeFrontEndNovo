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
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: "0.5rem",
    background: "#1a1a1a",
    boxSizing: "border-box",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontSize: "14px",
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
