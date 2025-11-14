// src/useGA.js

export const enviarEventoGA = (nomeEvento, params = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", nomeEvento, params);g
  }
};
