import { useEffect, useState } from 'react';

const MENSAJES = [
  'Leyendo el DBA y diseñando la estructura de la guía... ✨',
  'Construyendo las actividades pedagógicas para tus estudiantes... 📚',
  'Redactando la pregunta problematizadora y los propósitos... 🧠',
  'Generando la imagen ilustrativa del tema... 🎨',
  'Buscando recursos complementarios del tema... 🔍',
  '¡Ya casi está lista! Unos segundos más... ⏳',
];

export const SkeletonGuia = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % MENSAJES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8">
      {/* Mensaje de estado — arriba, visible */}
      <div className="bg-olive/10 border border-olive/20 rounded-xl px-5 py-4 flex items-center gap-3">
        <svg
          className="w-5 h-5 text-olive shrink-0 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm text-olive font-public font-medium transition-all duration-500">
          {MENSAJES[idx]}
        </p>
      </div>

      {/* Skeleton cards — animación pulse */}
      <div className="animate-pulse space-y-6">
        {/* Header de la guía */}
        <div className="bg-white rounded-2xl p-8 border-t-4 border-olive/30 shadow-sm">
          <div className="h-3 bg-olive/15 rounded w-1/4 mb-3" />
          <div className="h-8 bg-olive/20 rounded-lg w-3/4 mb-2" />
          <div className="h-5 bg-olive/10 rounded w-1/2" />
          <div className="flex gap-2 mt-4">
            <div className="h-5 w-20 bg-olive/15 rounded-full" />
            <div className="h-5 w-28 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Bloque texto largo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/5" />
        </div>

        {/* Tarjeta Actividad */}
        <div className="bg-amber/10 border-l-4 border-amber/40 rounded-r-xl p-5 space-y-2">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-20 bg-amber/30 rounded-full" />
            <div className="h-5 w-16 bg-amber/20 rounded-full" />
            <div className="h-5 w-14 bg-amber/20 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        {/* Bloque texto corto */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Tarjeta Cuestionario */}
        <div className="bg-copper/10 border-l-4 border-copper/40 rounded-r-xl p-5 space-y-2">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-28 bg-copper/20 rounded-full" />
            <div className="h-5 w-14 bg-copper/15 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
};
