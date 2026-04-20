/**
 * Pantalla de carga tipo skeleton para mientras la IA genera la guía.
 * Simula visualmente la estructura de una guía real con bloques de texto,
 * actividad y cuestionario — para que el docente sepa que el sistema trabaja.
 */
export const SkeletonGuia = () => (
  <div className="animate-pulse space-y-6 max-w-3xl mx-auto py-8">
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

    {/* Mensaje de espera */}
    <p className="text-center text-sm text-olive/60 font-public animate-pulse">
      La IA está construyendo tu guía... esto puede tomar hasta 30 segundos ✨
    </p>
  </div>
);
