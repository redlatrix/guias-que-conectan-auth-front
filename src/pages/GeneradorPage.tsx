import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { GeneradorGuia } from '@/features/guias/components/GeneradorGuia';

export const GeneradorPage = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream font-public">
      {/* Header — mismo estilo que Dashboard */}
      <header className="bg-olive px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <GlobeIcon size={36} />
            <div>
              <p className="text-cream font-crimson font-bold text-base tracking-widest uppercase leading-none">
                Guias que
              </p>
              <p className="text-cream/70 text-[10px] tracking-[0.3em] uppercase">Conectan</p>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              to="/generar"
              className="text-cream text-sm font-public font-semibold border-b-2 border-cream/70 pb-0.5"
            >
              Nueva Guía
            </Link>
            <Link
              to="/mis-guias"
              className="text-cream/70 hover:text-cream text-sm font-public transition"
            >
              Mis Guías
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-cream/80 hover:text-cream text-sm font-public border border-cream/30 hover:border-cream/70 px-4 py-1.5 rounded-md transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <GeneradorGuia />
      </main>
    </div>
  );
};
