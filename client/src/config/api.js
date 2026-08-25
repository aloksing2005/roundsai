export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  let res;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers
    });
  } catch (networkErr) {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    // Non-JSON response body — fall through with empty data
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status}). Please try again.`);
  }

  return data;
}