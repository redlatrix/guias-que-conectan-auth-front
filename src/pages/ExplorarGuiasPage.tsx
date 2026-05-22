import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { guiaService } from '@/features/guias/api/guia.api';
import type { Guia } from '@/features/guias/types/guia.types';
import { buildImageUrl } from '@/features/guias/utils/buildImageUrl';

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
        <h1 className="font-crimson text-5xl font-bold text-olive mb-3">
          Explorar guías de aprendizaje
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto mb-6">
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
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
  const gradoLabel = guia.grado_nombre
    ?? guia.titulo.split('—').pop()?.trim()
    ?? '';

  const imageBlock = guia.contenido_json?.find((b) => b.tipo === 'imagen');
  const imageUrl = imageBlock
    ? (imageBlock.metadata as { url?: string })?.url ?? null
    : null;

  const descripcion = guia.titulo;

  const fecha = guia.creado_en
    ? new Date(guia.creado_en).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

    console.log(guia ,'dataaa')
  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-copper/30 transition-all group overflow-hidden flex flex-col"
    >
      {/* Cover image */}
      <div className="w-full h-36 bg-olive/5 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={buildImageUrl(imageUrl)}
            alt="Portada de la guía"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-olive/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-2">
        {/* Status badge + grade */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full font-public uppercase tracking-wide bg-olive/10 text-olive">
            Publicada
          </span>
          {gradoLabel && (
            <span className="text-xs text-gray-500 font-public font-medium">
              {guia.grado_numero ? `${guia.grado_numero}°` : ''} {gradoLabel}
            </span>
          )}
        </div>

        {/* Description */}
        {descripcion && (
          <p className="text-sm text-gray-600 font-public leading-relaxed line-clamp-2 group-hover:text-gray-800 transition-colors">
            {descripcion}
          </p>
        )}

        {/* Footer: teacher + date */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            
            {guia.docente_nombre && (
              <span className="text-xs text-gray-500 font-public truncate flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {guia.docente_nombre}
              </span>
            )}
            {fecha && <span className="text-xs text-gray-400 shrink-0">{fecha}</span>}
          </div>
          <span className="text-xs text-copper/60 shrink-0 font-semibold group-hover:text-copper transition-colors">Ver guía →</span>
        </div>
      </div>
    </button>
  );
};
