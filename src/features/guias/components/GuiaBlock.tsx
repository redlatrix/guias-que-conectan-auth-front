import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  BloqueContenido,
  MetadataImagen,
  MetadataActividad,
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
  onRegenerateImage?: () => void;
  isRegenerating?: boolean;
}

export const GuiaBlock = ({ block, isEditing, onContentChange, onRegenerateImage, isRegenerating }: GuiaBlockProps) => {
  // ── IMAGEN ──────────────────────────────────────────────────────────────────
  if (block.tipo === 'imagen') {
    const meta = block.metadata as unknown as MetadataImagen;
    const src = buildImageUrl(meta.url);
    return (
      <figure className="my-4 group/img">
        <img
          src={src}
          alt={meta.alt}
          className="rounded-lg max-w-xs mx-auto shadow-sm border border-gray-100"
          loading="lazy"
        />
        {meta.alt && (
          <figcaption className="text-center text-xs text-gray-400 mt-2 font-public italic">
            {meta.alt}
          </figcaption>
        )}
        {onRegenerateImage && (
          <div className="flex justify-center mt-2">
            <button
              onClick={onRegenerateImage}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-copper border border-gray-200 hover:border-copper/50 bg-white px-3 py-1.5 rounded-full transition disabled:opacity-50 font-public"
            >
              {isRegenerating ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerar imagen
                </>
              )}
            </button>
          </div>
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => (
              <img src={src} alt={alt} className="rounded-lg max-w-xs mx-auto shadow-sm border border-gray-100 my-2" loading="lazy" />
            ),
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-copper hover:text-brown underline underline-offset-2 transition">
                {children}
              </a>
            ),
            hr: () => (
              <div style={{ borderBottom: '1px solid #d1d5db', margin: '4px 0 8px 0' }} />
            ),
          }}
        >
          {block.contenido}
        </ReactMarkdown>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              hr: () => <div style={{ borderBottom: '1px solid #d1d5db', margin: '4px 0 8px 0' }} />,
            }}>{block.contenido}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  // ── CUESTIONARIO ─────────────────────────────────────────────────────────────
  if (block.tipo === 'cuestionario') {
    return (
      <div className="bg-copper/10 border-l-4 border-copper rounded-r-xl p-5 my-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-copper font-public">
            Cuestionario
          </span>
        </div>
        {isEditing ? (
          <textarea
            className="w-full min-h-[100px] border border-copper/40 rounded-md px-3 py-2 text-sm font-public outline-none focus:border-copper focus:ring-1 focus:ring-copper transition resize-y bg-white"
            value={block.contenido}
            onChange={(e) => onContentChange?.(e.target.value)}
          />
        ) : (
          <div className="prose prose-sm prose-stone max-w-none font-public text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              hr: () => <div style={{ borderBottom: '1px solid #d1d5db', margin: '4px 0 8px 0' }} />,
            }}>{block.contenido}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  return null;
};
