import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AuthNavbar } from '@/features/auth/components/AuthNavbar';

export const Dashboard = () => {
  const { user } = useAuth();

  const rolLabel: Record<string, string> = {
    docente: 'Docente',
    administrador: 'Administrador',
  };

  return (
    <div className="min-h-screen bg-cream font-public">
      <AuthNavbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Tarjeta bienvenida */}
        <div className="bg-white rounded-2xl shadow-md p-8 border-l-4 border-copper">
          <p className="text-sm text-gray-400 font-public mb-1 uppercase tracking-widest">
            Bienvenido/a
          </p>
          <h1 className="font-crimson text-4xl font-bold text-olive leading-tight mb-3">
            {user?.docente?.nombre ?? user?.email}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Badge rol */}
            <span className="inline-flex items-center gap-1.5 bg-olive/10 text-olive text-xs font-semibold px-3 py-1 rounded-full font-public uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-olive inline-block" />
              {rolLabel[user?.rol ?? ''] ?? user?.rol}
            </span>

            {/* Email */}
            <span className="text-sm text-gray-500 font-public">{user?.email}</span>
          </div>
        </div>

        {/* Info adicional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-public">
              Estado
            </p>
            <p className="font-crimson text-xl font-semibold text-gray-700">
              {user?.activo ? 'Activo' : 'Inactivo'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-public">
              Último ingreso
            </p>
            <p className="font-crimson text-xl font-semibold text-gray-700">
              {user?.ultimo_login
                ? new Date(user.ultimo_login).toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
                : 'Primera sesión'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-crimson text-xl font-semibold text-gray-700 mb-4">
            ¿Qué quieres hacer hoy?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/generar"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:border-copper hover:shadow-md transition-all p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-copper/10 flex items-center justify-center shrink-0 group-hover:bg-copper/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-copper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-crimson text-lg font-semibold text-gray-800 group-hover:text-copper transition-colors">
                  Crear nueva guía
                </h3>
                <p className="text-xs text-gray-400 font-public mt-0.5">
                  Genera una guía de aprendizaje con IA en segundos.
                </p>
              </div>
            </Link>

            <Link
              to="/mis-guias"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:border-olive hover:shadow-md transition-all p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-olive/10 flex items-center justify-center shrink-0 group-hover:bg-olive/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-crimson text-lg font-semibold text-gray-800 group-hover:text-olive transition-colors">
                  Mis guías
                </h3>
                <p className="text-xs text-gray-400 font-public mt-0.5">
                  Revisa, edita y comparte tus guías creadas.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
