import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { authService } from '@/features/auth/api/auth.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LoginCredentials } from '@/features/auth/types/auth.types';
import { FaArrowRight } from 'react-icons/fa6';

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-olive flex flex-col items-center justify-center px-10 sm:px-16 xl:px-24 py-16 lg:py-0 relative">
        <div className="w-full max-w-xl flex flex-col items-start justify-center">
          <div className="flex items-center gap-4 mb-12">
            <GlobeIcon size={90} />
            <div>
              <p className="text-cream font-crimson font-bold text-4xl tracking-widest uppercase leading-none mb-1">
                Guías que
              </p>
              <p className="text-cream/70 text-sm tracking-[0.35em] uppercase font-public">
                Conectan
              </p>
            </div>
          </div>

          <p className="text-cream font-public text-2xl font-medium leading-relaxed mb-8">
            Genera guías pedagógicas alineadas al MEN en minutos usando IA.
          </p>

          <div className="mb-10 space-y-4">
            <h3 className="text-cream font-semibold text-xl">
              ¿Prefieres explorar antes de registrarte?
            </h3>
            <p className="text-cream/80 font-public text-lg leading-relaxed">
              Te invitamos a visitar nuestro{' '}
              <Link to="/explorar" className="text-cream font-bold hover:text-amber transition underline underline-offset-4 decoration-cream/40">
                catálogo público totalmente gratis
              </Link>.
              Allí podrás inspirarte con cientos de guías didácticas creadas, validadas y compartidas por la comunidad de profesores.
            </p>
          </div>

          <div>
            <Link
              to="/explorar"
              className="inline-flex items-center gap-3 font-public font-semibold px-8 py-4 rounded-lg bg-copper hover:bg-copper-dark text-cream text-lg transition shadow-md"
            >
              Explorar guías <FaArrowRight />
            </Link>
          </div>

        </div>
      </div>

      {/* ── Panel derecho: Formulario ──────────────────────────────────────── */}
      <div className="lg:w-1/2 bg-cream flex items-center justify-center px-6 sm:px-12 py-16 lg:py-0">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg px-8 sm:px-10 py-10">
            <h2 className="text-center font-crimson text-3xl font-bold text-gray-800 mb-8">
              Inicio de sesión
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-public text-gray-600 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
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
                <label className="block text-sm font-public text-gray-600 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition"
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
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600 font-public">{apiError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-copper hover:bg-copper-dark text-white font-public font-semibold text-lg py-3.5 rounded-lg transition disabled:opacity-60 mt-1"
              >
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>

              {/* Link registro */}
              <p className="text-center text-sm text-gray-500 font-public mt-1">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-copper hover:text-brown font-semibold transition">
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
