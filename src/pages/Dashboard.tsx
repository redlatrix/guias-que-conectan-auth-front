import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const rolLabel: Record<string, string> = {
    docente: 'Docente',
    administrador: 'Administrador',
  };

  return (
    <div className="min-h-screen bg-cream font-public">
      {/* Header */}
      <header className="bg-olive px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-cream opacity-90"
            fill="none"
            viewBox="0 0 48 48"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="24" cy="10" r="3" fill="currentColor" stroke="none" />
            <circle cx="10" cy="30" r="3" fill="currentColor" stroke="none" />
            <circle cx="38" cy="30" r="3" fill="currentColor" stroke="none" />
            <circle cx="18" cy="40" r="3" fill="currentColor" stroke="none" />
            <circle cx="30" cy="40" r="3" fill="currentColor" stroke="none" />
            <line x1="24" y1="10" x2="10" y2="30" strokeWidth={1.5} />
            <line x1="24" y1="10" x2="38" y2="30" strokeWidth={1.5} />
            <line x1="10" y1="30" x2="18" y2="40" strokeWidth={1.5} />
            <line x1="38" y1="30" x2="30" y2="40" strokeWidth={1.5} />
            <line x1="10" y1="30" x2="38" y2="30" strokeWidth={1.5} />
          </svg>
          <div>
            <p className="text-cream font-crimson font-bold text-base tracking-widest uppercase leading-none">
              Guias que
            </p>
            <p className="text-cream/70 text-[10px] tracking-[0.3em] uppercase">Conectan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-cream/80 hover:text-cream text-sm font-public border border-cream/30 hover:border-cream/70 px-4 py-1.5 rounded-md transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Content */}
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
      </main>
    </div>
  );
};
