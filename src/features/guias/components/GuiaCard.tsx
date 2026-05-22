import type { Guia } from '../types/guia.types';

import { buildImageUrl } from '../utils/buildImageUrl';

interface GuiaCardProps {
  guia: Guia;
  onClick: () => void;
  docenteNombre?: string;
}

function extractCardData(guia: Guia) {
  const gradoLabel = guia.grado_nombre
    ?? guia.titulo.split('—').pop()?.trim()
    ?? '';

  const imageBlock = guia.contenido_json?.find((b) => b.tipo === 'imagen');
  const imageUrl = imageBlock
    ? (imageBlock.metadata as { url?: string })?.url ?? null
    : null;

  const descripcion = guia.titulo

  return { gradoLabel, imageUrl, descripcion };
}

export const GuiaCard = ({ guia, onClick, docenteNombre }: GuiaCardProps) => {
  const { gradoLabel, imageUrl, descripcion } = extractCardData(guia);
  const nombre = guia.docente_nombre ?? docenteNombre;

  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white rounded-xl shadow-sm border border-gray-100 hover:border-copper hover:shadow-md transition-all group overflow-hidden flex flex-col"
    >
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
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-public uppercase tracking-wide ${
              guia.estado === 'publicado'
                ? 'bg-olive/10 text-olive'
                : 'bg-amber/20 text-amber'
            }`}
          >
            {guia.estado}
          </span>
          {gradoLabel && (
            <span className="text-xs text-gray-500 font-public font-medium">
              {guia.grado_numero ? `${guia.grado_numero}°` : ''} {gradoLabel}
            </span>
          )}
        </div>

        {/* Description */}
        {descripcion && (
          <p className="text-sm text-gray-600 font-public leading-relaxed line-clamp-2">
            {descripcion} hola
          </p>
        )}

        {/* Footer: teacher + date */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          {nombre && (
            <span className="text-xs text-gray-500 font-public truncate flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {nombre}
            </span>
          )}
          <span className="text-xs text-gray-400 font-public shrink-0">
            {new Date(guia.creado_en).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </button>
  );
};
