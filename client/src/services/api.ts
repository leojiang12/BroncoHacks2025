import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || window.location.origin;
// Remove any trailing '/api', then add '/api' exactly once:
const normalizedBase = rawBase.replace(/\/api\/?$/, '') + '/api';

const api = axios.create({
  baseURL: normalizedBase,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// Attach token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
