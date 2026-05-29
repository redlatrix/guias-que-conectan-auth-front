import axios from 'axios';
import { checkTokenOrRedirect } from '../utils/token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (!checkTokenOrRedirect()) {
      return Promise.reject(new axios.Cancel('Token expirado'));
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = window.location.pathname === '/login' || window.location.pathname === '/register';
    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
