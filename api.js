const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('pizza_token');
}

export function setSession(token, user) {
  localStorage.setItem('pizza_token', token);
  localStorage.setItem('pizza_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('pizza_token');
  localStorage.removeItem('pizza_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('pizza_user');
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}
