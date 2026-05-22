import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { guiaService } from '@/features/guias/api/guia.api';
import { GuiaBlock } from '@/features/guias/components/GuiaBlock';
import { SkeletonGuia } from '@/features/guias/components/SkeletonGuia';
import type { Guia } from '@/features/guias/types/guia.types';

export const ExplorarGuiaDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const [guia, setGuia] = useState<Guia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    guiaService
      .getGuiaPublica(Number(id))
      .then(setGuia)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-cream flex flex-col font-public">
      {/* Navbar */}
      <header className="bg-olive px-6 py-4 flex items-center justify-between shadow-md">
        <Link to="/explorar" className="flex items-center gap-3">
          <GlobeIcon size={36} />
          <div>
            <p className="text-cream font-crimson font-bold text-base tracking-widest uppercase leading-none">
              Guias que
            </p>
            <p className="text-cream/70 text-[10px] tracking-[0.3em] uppercase">Conectan</p>
          </div>
        </Link>
        <Link
          to="/login"
          className="text-cream/80 hover:text-cream text-sm font-public border border-cream/30 hover:border-cream/70 px-4 py-1.5 rounded-md transition"
        >
          Iniciar sesión
        </Link>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-public mb-6">
          <Link to="/explorar" className="hover:text-copper transition">
            Explorar guías
          </Link>
          <span>›</span>
          <span className="text-gray-600 truncate max-w-[240px]">
            {guia ? guia.titulo : `Guía #${id}`}
          </span>
        </div>

        {isLoading && <SkeletonGuia />}

        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="font-crimson text-xl font-semibold text-gray-500 mb-2">
              Guía no disponible
            </p>
            <p className="text-sm text-gray-400 font-public mb-6">
              Esta guía no existe o aún no ha sido publicada.
            </p>
            <Link
              to="/explorar"
              className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-6 py-2.5 rounded-lg transition inline-block"
            >
              Volver al explorador
            </Link>
          </div>
        )}

        {guia && !isLoading && (
          <article className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-copper">
            {/* Encabezado */}
            <header className="mb-6 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-olive/10 text-olive px-2.5 py-0.5 rounded-full font-public">
                  Publicada
                </span>
                <span className="text-xs text-gray-400 font-public">
                  v{guia.version_numero}
                </span>
              </div>
              <h1 className="font-crimson text-4xl font-bold text-olive leading-tight mb-2">
                {guia.titulo}
              </h1>
              {guia.creado_en && (
                <p className="text-xs text-gray-400 font-public">
                  {new Date(guia.creado_en).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </header>

            {/* Bloques de contenido — solo lectura */}
            <div className="space-y-4">
              {guia.contenido_json.map((block, i) => (
                <GuiaBlock key={i} block={block} />
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <Link
                to="/explorar"
                className="text-sm text-gray-400 hover:text-copper font-public transition flex items-center gap-1"
              >
                ← Volver al explorador
              </Link>
              <Link
                to="/register"
                className="bg-copper hover:bg-copper-dark text-white text-sm font-public font-semibold px-5 py-2 rounded-lg transition"
              >
                Crear mi propia guía
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};
