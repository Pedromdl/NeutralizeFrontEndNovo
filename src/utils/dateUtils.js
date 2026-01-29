// src/utils/dateUtils.js

/**
 * Formata datas vindas do backend (YYYY-MM-DD ou ISO)
 * para o padrão brasileiro DD/MM/YYYY
 * ⚠️ Não usa Date() para evitar bug de fuso horário
 */
export function formatarData(data) {
  if (!data) return "-";

  const [ano, mes, dia] = data.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata data + hora (ISO)
 * Ex: 2026-01-17T14:30:00
 */
export function formatarDataHora(dataHora) {
  if (!dataHora) return "-";

  const [data, hora] = dataHora.split("T");
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora.slice(0, 5)}`;
}

/**
 * Retorna quantos dias se passaram desde a data
 * (usado para "há quantos dias sem sessão")
 */
export function diasDesde(data) {
  if (!data) return null;

  const [ano, mes, dia] = data.split("T")[0].split("-");
  const dataAlvo = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  

  const diff = hoje - dataAlvo;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se a data está no passado
 */
export function dataPassada(data) {
  if (!data) return false;

  const [ano, mes, dia] = data.split("T")[0].split("-");
  const dataAlvo = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  return dataAlvo < hoje;
}
