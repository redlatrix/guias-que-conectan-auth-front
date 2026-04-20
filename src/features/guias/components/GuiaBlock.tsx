import ReactMarkdown from 'react-markdown';
import type {
  BloqueContenido,
  MetadataImagen,
  MetadataActividad,
  MetadataCuestionario,
} from '../types/guia.types';

/**
 * Construye la URL completa para imágenes del backend.
 * El storage devuelve paths como "/storage/images/uuid.png"
 * que son relativos al origen del core (no incluyen "/api").
 */
const buildImageUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');
  return `${base}${url}`;
};

interface GuiaBlockProps {
  block: BloqueContenido;
  isEditing?: boolean;
  onContentChange?: (contenido: string) => void;
}

export const GuiaBlock = ({ block, isEditing, onContentChange }: GuiaBlockProps) => {
  // ── IMAGEN ──────────────────────────────────────────────────────────────────
  if (block.tipo === 'imagen') {
    const meta = block.metadata as unknown as MetadataImagen;
    const src = buildImageUrl(meta.url);
    return (
      <figure className="my-4">
        <img
          src={src}
          alt={meta.alt}
          className="rounded-lg max-w-full mx-auto shadow-sm border border-gray-100"
          loading="lazy"
        />
        {meta.alt && (
          <figcaption className="text-center text-xs text-gray-400 mt-2 font-public italic">
            {meta.alt}
          </figcaption>
        )}
      </figure>
    );
  }

  // ── TEXTO ───────────────────────────────────────────────────────────────────
  if (block.tipo === 'texto') {
    if (isEditing) {
      return (
        <textarea
          className="w-full min-h-[120px] border border-olive/30 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition resize-y bg-white"
          value={block.contenido}
          onChange={(e) => onContentChange?.(e.target.value)}
        />
      );
    }
    return (
      <div className="prose prose-stone max-w-none font-public text-gray-800 leading-relaxed">
        <ReactMarkdown>{block.contenido}</ReactMarkdown>
      </div>
    );
  }

  // ── ACTIVIDAD ───────────────────────────────────────────────────────────────
  if (block.tipo === 'actividad') {
    const meta = block.metadata as Partial<MetadataActividad>;
    return (
      <div className="bg-amber/10 border-l-4 border-amber rounded-r-xl p-5 my-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber font-public">
            Actividad
          </span>
          {meta.duracion_min != null && (
            <span className="bg-amber text-white text-xs px-2 py-0.5 rounded-full font-public">
              {meta.duracion_min} min
            </span>
          )}
          {meta.tipo && (
            <span className="bg-white border border-amber/40 text-amber text-xs px-2 py-0.5 rounded-full font-public capitalize">
              {meta.tipo}
            </span>
          )}
        </div>
        {isEditing ? (
          <textarea
            className="w-full min-h-[100px] border border-amber/40 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-amber focus:ring-1 focus:ring-amber transition resize-y bg-white"
            value={block.contenido}
            onChange={(e) => onContentChange?.(e.target.value)}
          />
        ) : (
          <div className="prose prose-sm prose-stone max-w-none font-public text-gray-800">
            <ReactMarkdown>{block.contenido}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  // ── CUESTIONARIO ─────────────────────────────────────────────────────────────
  if (block.tipo === 'cuestionario') {
    const meta = block.metadata as Partial<MetadataCuestionario>;
    return (
      <div className="bg-copper/10 border-l-4 border-copper rounded-r-xl p-5 my-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-copper font-public">
            Cuestionario
          </span>
          {meta.tipo_pregunta && (
            <span className="bg-white border border-copper/40 text-copper text-xs px-2 py-0.5 rounded-full font-public capitalize">
              {meta.tipo_pregunta}
            </span>
          )}
        </div>
        {isEditing ? (
          <textarea
            className="w-full min-h-[100px] border border-copper/40 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition resize-y bg-white"
            value={block.contenido}
            onChange={(e) => onContentChange?.(e.target.value)}
          />
        ) : (
          <div className="prose prose-sm prose-stone max-w-none font-public text-gray-800">
            <ReactMarkdown>{block.contenido}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  return null;
};
