import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { guiaService } from '@/features/guias/api/guia.api';
import type { Guia } from '@/features/guias/types/guia.types';

export const ExplorarGuiasPage = () => {
  const navigate = useNavigate();
  const [guias, setGuias] = useState<Guia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    guiaService
      .getGuiasPublicas()
      .then(setGuias)
      .catch(() => setError('No fue posible cargar las guías. Intenta de nuevo.'))
      .finally(() => setIsLoading(false));
  }, []);

  const guiasFiltradas = guias.filter((g) =>
    g.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col font-public">
      {/* Navbar */}
      <header className="bg-olive px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <GlobeIcon size={36} />
          <div>
            <p className="text-cream font-crimson font-bold text-base tracking-widest uppercase leading-none">
              Guias que
            </p>
            <p className="text-cream/70 text-[10px] tracking-[0.3em] uppercase">Conectan</p>
          </div>
        </div>
        <Link
          to="/login"
          className="text-cream/80 hover:text-cream text-sm font-public border border-cream/30 hover:border-cream/70 px-4 py-1.5 rounded-md transition"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* Hero */}
      <div className="bg-olive/10 border-b border-olive/20 px-6 py-10 text-center">
        <h1 className="font-crimson text-4xl font-bold text-olive mb-3">
          Explorar guías de aprendizaje
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
          Guías de Ciencias Sociales alineadas con los DBA del MEN, creadas por docentes colombianos.
        </p>
        <div className="max-w-md mx-auto relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-olive/30 rounded-lg text-sm outline-none focus:border-copper focus:ring-1 focus:ring-copper bg-white transition"
          />
        </div>
      </div>

      {/* Contenido */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && guiasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              {search ? 'No se encontraron guías con ese título.' : 'Aún no hay guías publicadas.'}
            </p>
          </div>
        )}

        {!isLoading && !error && guiasFiltradas.length > 0 && (
          <>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-5 font-public">
              {guiasFiltradas.length} {guiasFiltradas.length === 1 ? 'guía disponible' : 'guías disponibles'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guiasFiltradas.map((guia) => (
                <GuiaPublicaCard key={guia.id} guia={guia} onClick={() => navigate(`/explorar/${guia.id}`)} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer CTA */}
      <footer className="border-t border-gray-100 bg-white py-8 text-center">
        <p className="text-sm text-gray-500 font-public mb-3">
          ¿Eres docente? Crea y comparte tus propias guías con IA.
        </p>
        <Link
          to="/register"
          className="inline-block bg-copper hover:bg-copper-dark text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Crear cuenta
        </Link>
      </footer>
    </div>
  );
};

// ── Tarjeta de guía pública ──────────────────────────────────────────────────

const GuiaPublicaCard = ({ guia, onClick }: { guia: Guia; onClick: () => void }) => {
  const bloqueTexto = guia.contenido_json?.find((b) => b.tipo === 'texto');
  const preview = bloqueTexto
    ? bloqueTexto.contenido.replace(/[#*>`]/g, '').trim().slice(0, 120)
    : null;

  const fecha = guia.creado_en
    ? new Date(guia.creado_en).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-copper/30 transition-all p-5 flex flex-col gap-3 w-full"
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-crimson text-lg font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-copper">
          {guia.titulo}
        </h3>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider bg-olive/10 text-olive px-2 py-0.5 rounded-full">
          Publicada
        </span>
      </div>

      {/* Preview de contenido */}
      {preview && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{preview}…</p>
      )}

      {/* Footer de la tarjeta */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
        {fecha && <span className="text-[11px] text-gray-400">{fecha}</span>}
        <span className="text-[11px] text-copper/60 ml-auto">Ver guía →</span>
      </div>
    </button>
  );
};
