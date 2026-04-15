export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  rol: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  rol: string;
}

export interface DocenteInfo {
  id: number;
  nombre: string;
}

export interface UserProfile {
  id: number;
  email: string;
  rol: string;
  activo: boolean;
  ultimo_login: string | null;
  docente: DocenteInfo;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  perfil: UserProfile;
}

export interface AuthError {
  error: string;
}
