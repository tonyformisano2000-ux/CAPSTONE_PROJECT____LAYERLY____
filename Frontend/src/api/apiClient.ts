import { store } from "../redux/store";

const BASE_URL = "http://localhost:3220";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = store.getState().auth.token;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}
export async function apiUpload(endpoint: string, formData: FormData) {
  const token = store.getState().auth.token;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // NIENTE Content-Type qui — il browser lo imposta da solo per FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}
export default apiFetch;
