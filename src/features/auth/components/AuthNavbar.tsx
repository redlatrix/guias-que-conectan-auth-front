import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobeIcon } from './GlobeIcon';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { to: '/generar',   label: 'Nueva Guia' },
  { to: '/mis-guias', label: 'Mis Guias' },
  { to: '/explorar',  label: 'Explorar guias' },
] as const;

export const AuthNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
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
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                className={`text-sm font-public transition ${
                  isActive
                    ? 'text-cream font-semibold border-b-2 border-cream/70 pb-0.5'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="text-cream/80 hover:text-cream text-sm font-public border border-cream/30 hover:border-cream/70 px-4 py-1.5 rounded-md transition"
      >
        Cerrar sesion
      </button>
    </header>
  );
};
