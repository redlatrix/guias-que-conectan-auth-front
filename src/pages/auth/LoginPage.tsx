import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { authService } from '@/features/auth/api/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LoginCredentials } from '@/features/auth/types/auth.types';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const response = await authService.login(data);
      setAuth(response.token, response.perfil);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setApiError(error.response?.data?.error ?? 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Inicio de sesión">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Email */}
        <div>
          <label className="block text-xs font-public text-gray-600 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
            placeholder="correo@ejemplo.com"
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo válido',
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-public">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-public text-gray-600 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
            placeholder="••••••••"
            {...register('password', {
              required: 'La contraseña es obligatoria',
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 font-public">{errors.password.message}</p>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
            <p className="text-xs text-red-600 font-public">{apiError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-copper hover:bg-copper-dark text-white font-public font-semibold py-2.5 rounded-md transition disabled:opacity-60 mt-1"
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>

        {/* Link registro */}
        <p className="text-center text-xs text-gray-500 font-public mt-1">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-copper hover:text-brown font-semibold transition">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};
