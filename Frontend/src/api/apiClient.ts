import { store } from "../redux/store";

// In produzione arriva da VITE_API_URL (impostata su Netlify, letta al momento della build).
// Lo slash finale viene tolto perche' gli endpoint iniziano gia' con "/".
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3220").replace(/\/+$/, "");

// Il backend risponde 403 anche quando il token e' scaduto o assente,
// quindi il messaggio deve coprire entrambi i casi.
async function buildError(response: Response) {
  const errorBody = await response.json().catch(() => null);
  if (errorBody?.message) return new Error(errorBody.message);

  if (response.status === 401 || response.status === 403) {
    return new Error(
      "Not authorized: log in again, or your account lacks permission for this action",
    );
  }
  return new Error(`Request failed with status ${response.status}`);
}

// fetch lancia un TypeError ("Failed to fetch") quando il server non risponde
// affatto: backend spento, porta sbagliata, CORS. Non e' un errore applicativo,
// quindi va tradotto in un messaggio comprensibile invece di finire a schermo.
async function request(url: string, init: RequestInit) {
  try {
    return await fetch(url, init);
  } catch {
    throw new Error(
      "Could not reach the server. Make sure the backend is running and try again.",
    );
  }
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = store.getState().auth.token;

  const response = await request(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  // 204 No Content (es. DELETE): non c'e' corpo da parsare
  if (response.status === 204) return null;

  return response.json();
}
export async function apiUpload(endpoint: string, formData: FormData) {
  const token = store.getState().auth.token;

  const response = await request(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // NIENTE Content-Type qui — il browser lo imposta da solo per FormData
    },
    body: formData,
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  return response.json();
}
export default apiFetch;
