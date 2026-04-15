import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { authService } from '@/features/auth/api/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { RegisterData } from '@/features/auth/types/auth.types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const response = await authService.register(data);
      setAuth(response.token, response.perfil);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setApiError(error.response?.data?.error ?? 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Registro">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Nombre */}
        <div>
          <label className="block text-xs font-public text-gray-600 mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
            placeholder="Tu nombre completo"
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
          {errors.nombre && (
            <p className="text-xs text-red-500 mt-1 font-public">{errors.nombre.message}</p>
          )}
        </div>

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

        {/* Grid: contraseña + confirmar */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-public text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
              placeholder="••••••••"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-public">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-public text-gray-600 mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 font-public">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Rol */}
        <div>
          <label className="block text-xs font-public text-gray-600 mb-1">Rol</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition bg-white"
            {...register('rol', { required: 'Selecciona un rol' })}
          >
            <option value="">Selecciona un rol</option>
            <option value="docente">Docente</option>
            <option value="administrador">Administrador</option>
          </select>
          {errors.rol && (
            <p className="text-xs text-red-500 mt-1 font-public">{errors.rol.message}</p>
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
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>

        {/* Link login */}
        <p className="text-center text-xs text-gray-500 font-public mt-1">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-copper hover:text-brown font-semibold transition">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};
