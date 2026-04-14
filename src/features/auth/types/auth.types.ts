export interface RegisterForm  {
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
