import { useState } from 'react';
import { GuiaBlock } from './GuiaBlock';
import type { Guia, BloqueContenido } from '../types/guia.types';

interface GuiaEditorProps {
  guia: Guia;
  isSaving: boolean;
  onSave: (titulo: string, contenido_json: BloqueContenido[]) => void;
}

/**
 * Editor de guía con edición optimista por bloque.
 * - El título es editable al hacer clic.
 * - Cada bloque muestra un botón "Editar" al hacer hover.
 * - "Guardar Cambios" llama a PUT /api/guias/:id con el estado local.
 */
export const GuiaEditor = ({ guia, isSaving, onSave }: GuiaEditorProps) => {
  const [titulo, setTitulo] = useState(guia.titulo);
  const [blocks, setBlocks] = useState<BloqueContenido[]>(guia.contenido_json);
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());
  const [editingTitle, setEditingTitle] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleBlock = (i: number) => {
    setEditingIndices((prev) => {
      const next = new Set(prev); // siempre nueva referencia para trigger de re-render
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const updateBlock = (i: number, contenido: string) => {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? { ...b, contenido } : b)));
  };

  const handleSave = async () => {
    setSaveSuccess(false);
    await onSave(titulo, blocks);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 border-t-4 border-copper font-public">
      {/* Encabezado editable */}
      <header className="mb-6 pb-5 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-public mb-1">
          Editando · Versión {guia.version_numero}
        </p>
        <div className="group/title flex items-start gap-2">
          {editingTitle ? (
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
              className="flex-1 font-crimson text-3xl font-bold text-olive border-b-2 border-copper outline-none bg-transparent leading-tight"
            />
          ) : (
            <h1
              className="flex-1 font-crimson text-3xl font-bold text-olive leading-tight cursor-pointer hover:text-copper transition"
              title="Haz clic para editar el título"
              onClick={() => setEditingTitle(true)}
            >
              {titulo}
            </h1>
          )}
          <button
            onClick={() => setEditingTitle(!editingTitle)}
            className="mt-1 text-gray-300 hover:text-copper transition shrink-0"
            title="Editar título"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-public uppercase tracking-wide ${
            guia.estado === 'publicado' ? 'bg-olive/10 text-olive' : 'bg-amber/20 text-amber'
          }`}>
            {guia.estado}
          </span>
          <span className="text-xs text-gray-400 font-public">
            {new Date(guia.creado_en).toLocaleDateString('es-CO', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* Bloques editables */}
      <div className="space-y-4">
        {blocks.map((block, i) => (
          // Las imágenes no son editables con textarea
          block.tipo === 'imagen' ? (
            <GuiaBlock key={i} block={block} />
          ) : (
            <div key={i} className="relative group">
              <GuiaBlock
                block={block}
                isEditing={editingIndices.has(i)}
                onContentChange={(c) => updateBlock(i, c)}
              />
              <button
                onClick={() => toggleBlock(i)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white border border-gray-200 text-gray-500 hover:text-copper hover:border-copper px-2 py-0.5 rounded font-public shadow-sm"
              >
                {editingIndices.has(i) ? '✓ Listo' : 'Editar'}
              </button>
            </div>
          )
        ))}
      </div>

      {/* Footer con botón guardar */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400 font-public">
          Los cambios crean una nueva versión en el servidor.
        </p>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm text-olive font-public flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Guardado
            </span>
          )}
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Guardando...
              </span>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
