import { useState } from 'react';
import { guiaService } from '../api/guia.api';
import type { Guia, BloqueContenido, MetadataImagen } from '../types/guia.types';
import { GuiaViewer } from './GuiaViewer';

interface GuiaEditorProps {
  guia: Guia;
  isSaving: boolean;
  isPublishing?: boolean;
  onSave: (titulo: string, contenido_json: BloqueContenido[]) => void;
  onPublish?: () => void;
}

export const GuiaEditor = ({ guia, isSaving, isPublishing, onSave, onPublish }: GuiaEditorProps) => {
  const [titulo, setTitulo] = useState(guia.titulo);
  const [blocks, setBlocks] = useState<BloqueContenido[]>(guia.contenido_json);
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());
  const [editingTitle, setEditingTitle] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);


  const toggleBlock = (i: number) => {
    setEditingIndices((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const updateBlock = (i: number, contenido: string) => {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? { ...b, contenido } : b)));
  };

  const handleRegenerateImage = async (i: number) => {
    const block = blocks[i];
    const meta = block.metadata as unknown as MetadataImagen;
    const prompt = meta.alt || block.contenido.replace(/^!\[([^\]]*)\].*$/, '$1');
    if (!prompt) return;

    setRegeneratingIdx(i);
    try {
      const { url } = await guiaService.regenerarImagen(guia.id, prompt);
      setBlocks((prev) =>
        prev.map((b, idx) =>
          idx === i ? { ...b, contenido: `![${prompt}](${url})`, metadata: { ...b.metadata, url, alt: prompt } } : b
        )
      );
      const updatedBlocks = blocks.map((b, idx) =>
        idx === i ? { ...b, contenido: `![${prompt}](${url})`, metadata: { ...b.metadata, url, alt: prompt } } : b
      );
      await onSave(titulo, updatedBlocks);
    } catch {
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const handleSave = async () => {
    setSaveSuccess(false);
    await onSave(titulo, blocks);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const esPublicada = guia.estado === 'publicado';

  return (
    <article className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border-t-4 border-copper font-public">
      <header className="px-8 pt-8 pb-5 border-b border-gray-100">
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
              className="flex-1 font-crimson text-4xl font-bold text-olive border-b-2 border-copper outline-none bg-transparent leading-tight"
            />
          ) : (
            <h1
              className="flex-1 font-crimson text-4xl font-bold text-olive leading-tight cursor-pointer hover:text-copper transition"
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
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-public uppercase tracking-wide ${esPublicada ? 'bg-olive/10 text-olive' : 'bg-amber/20 text-amber'
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

      <GuiaViewer
        titulo={titulo}
        blocks={blocks}
        isReadOnly={false}
        editingIndices={editingIndices}
        onToggleBlock={toggleBlock}
        onUpdateBlock={updateBlock}
        onRegenerateImage={handleRegenerateImage}
        regeneratingIdx={regeneratingIdx}
        footerActions={
          <>
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
              className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Guardando...
                </span>
              ) : 'Guardar Cambios'}
            </button>

            {!esPublicada && onPublish && (
              <button
                onClick={onPublish}
                disabled={isPublishing || isSaving}
                className="flex items-center gap-2 bg-olive hover:bg-olive-dark text-cream font-public font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {isPublishing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Publicando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Publicar guía
                  </>
                )}
              </button>
            )}

            {esPublicada && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-olive bg-olive/10 px-3 py-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Publicada
              </span>
            )}
          </>
        }
      />
    </article>
  );
};
