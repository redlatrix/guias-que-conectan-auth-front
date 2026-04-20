import { GuiaBlock } from './GuiaBlock';
import type { Guia } from '../types/guia.types';

interface GuiaRendererProps {
  guia: Guia;
}

/**
 * Componente puro de visualización de una guía.
 * Renderiza el encabezado estilo "ficha técnica MEN" y cada bloque de contenido.
 */
export const GuiaRenderer = ({ guia }: GuiaRendererProps) => (
  <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 border-t-4 border-olive font-public">
    {/* Encabezado tipo ficha técnica */}
    <header className="mb-6 pb-5 border-b border-gray-100">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-public mb-1">
        Guía de Aprendizaje · Versión {guia.version_numero}
      </p>
      <h1 className="font-crimson text-3xl font-bold text-olive leading-tight">
        {guia.titulo}
      </h1>
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-public uppercase tracking-wide ${
            guia.estado === 'publicado'
              ? 'bg-olive/10 text-olive'
              : 'bg-amber/20 text-amber'
          }`}
        >
          {guia.estado}
        </span>
        <span className="text-xs text-gray-400 font-public">
          {new Date(guia.creado_en).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>
    </header>

    {/* Bloques de contenido */}
    <div className="space-y-4">
      {guia.contenido_json.map((block, i) => (
        <GuiaBlock key={i} block={block} />
      ))}
    </div>
  </article>
);
