import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // e.g. http://localhost:5000/api
  headers: { 'Content-Type': 'application/json' }
});

// Call this after login to set the Bearer header
export function setToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
