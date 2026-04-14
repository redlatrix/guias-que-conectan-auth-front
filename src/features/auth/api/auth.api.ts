import { api } from '@/services/api';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

export const authService = {
  /**
   * Envía las credenciales al servidor para iniciar sesión.
   * El token será gestionado automáticamente en la cookie por el backend.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Registra un nuevo usuario en el sistema.
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  /**
   * Cierra la sesión eliminando el token/cookie.
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * Obtiene la información del usuario actual (útil al refrescar la página).
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>('/auth/me');
    return data;
  }
};