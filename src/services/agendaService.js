const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchEventosAgenda({ start, end }) {
  const res = await fetch(
    `${API_URL}/api/eventosagenda/?start=${start}&end=${end}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) throw new Error("Erro ao buscar eventos");
  return res.json();
}

export async function createEventoAgenda(payload) {
  const res = await fetch(`${API_URL}/api/eventosagenda/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao criar evento");
  return res.json();
}

export async function updateEventoAgenda(id, payload) {
  const res = await fetch(`${API_URL}/api/eventosagenda/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao atualizar evento");
  return res.json();
}

export async function deleteEventoAgenda(id) {
  const res = await fetch(`${API_URL}/api/eventosagenda/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir evento");
}
