import type { Guia } from '../types/guia.types';

interface GuiaCardProps {
  guia: Guia;
  onClick: () => void;
}

export const GuiaCard = ({ guia, onClick }: GuiaCardProps) => (
  <button
    onClick={onClick}
    className="text-left w-full bg-white rounded-xl shadow-sm border border-gray-100 hover:border-copper hover:shadow-md transition-all p-5 group"
  >
    {/* Estado y versión */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-public uppercase tracking-wide ${
          guia.estado === 'publicado'
            ? 'bg-olive/10 text-olive'
            : 'bg-amber/20 text-amber'
        }`}
      >
        {guia.estado}
      </span>
      <span className="text-xs text-gray-400 font-public shrink-0">
        v{guia.version_numero}
      </span>
    </div>

    <h3 className="font-crimson text-lg font-semibold text-gray-800 group-hover:text-copper transition-colors leading-snug mb-2">
      {guia.titulo}
    </h3>

    <p className="text-xs text-gray-400 font-public">
      {new Date(guia.creado_en).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}
    </p>
  </button>
);
