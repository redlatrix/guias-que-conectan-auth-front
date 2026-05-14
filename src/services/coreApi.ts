import axios from 'axios';

/**
 * Instancia de Axios para el backend core (guias-que-conectan-core).
 */
export const coreApi = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:3001/api',
  withCredentials: true,
});

coreApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

coreApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
