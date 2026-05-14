import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { useGuias } from '@/features/guias/hooks/useGuias';
import { GuiaCard } from '@/features/guias/components/GuiaCard';


const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
    <div className="flex justify-between">
      <div className="h-4 w-16 bg-gray-200 rounded-full" />
      <div className="h-4 w-8 bg-gray-100 rounded-full" />
    </div>
    <div className="h-5 bg-gray-200 rounded w-3/4" />
    <div className="h-5 bg-gray-200 rounded w-1/2" />
    <div className="h-3 bg-gray-100 rounded w-1/3" />
  </div>
);

export const MisGuiasPage = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const { guias, isLoadingList, error, loadMisGuias } = useGuias();

  useEffect(() => {
    loadMisGuias();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream font-public">
      {/* Header */}
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
              className="text-cream/70 hover:text-cream text-sm font-public transition"
            >
              Nueva Guía
            </Link>
            <Link
              to="/mis-guias"
              className="text-cream text-sm font-public font-semibold border-b-2 border-cream/70 pb-0.5"
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

      <main className="max-w-4xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-crimson text-3xl font-bold text-olive">Mis Guías</h1>
            <p className="text-sm text-gray-500 font-public mt-1">
              {isLoadingList
                ? 'Cargando tus guías...'
                : `${guias.length} guía${guias.length !== 1 ? 's' : ''} encontrada${guias.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link
            to="/generar"
            className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-5 py-2.5 rounded-lg transition flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Guía
          </Link>
        </div>


        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600 font-public">
            {error}
          </div>
        )}


        {isLoadingList ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : guias.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="font-crimson text-xl font-semibold text-gray-600 mb-2">
              Aún no tienes guías
            </h2>
            <p className="text-sm text-gray-400 font-public mb-6">
              Crea tu primera guía de aprendizaje con ayuda de la IA.
            </p>
            <Link
              to="/generar"
              className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-6 py-2.5 rounded-lg transition inline-block"
            >
              Crear mi primera guía
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guias.map((guia) => (
              <GuiaCard
                key={guia.id}
                guia={guia}
                onClick={() => navigate(`/guias/${guia.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
