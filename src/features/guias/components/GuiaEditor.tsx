import { useState, useRef } from 'react';
import { GuiaBlock } from './GuiaBlock';
import { ActividadImprimible } from './ActividadImprimible';
import { GuiaDocenteImprimible } from './GuiaDocenteImprimible';
import { PrintButton } from './PrintButton';
import { guiaService } from '../api/guia.api';
import type { Guia, BloqueContenido, MetadataImagen } from '../types/guia.types';

interface GuiaEditorProps {
  guia: Guia;
  isSaving: boolean;
  isPublishing?: boolean;
  onSave: (titulo: string, contenido_json: BloqueContenido[]) => void;
  onPublish?: () => void;
}

const buildImageUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');
  return `${base}${url}`;
};

const ACTIVIDAD_MARKER = 'ACTIVIDAD PRÁCTICA IMPRIMIBLE';

export const GuiaEditor = ({ guia, isSaving, isPublishing, onSave, onPublish }: GuiaEditorProps) => {
  const [titulo, setTitulo] = useState(guia.titulo);
  const [blocks, setBlocks] = useState<BloqueContenido[]>(guia.contenido_json);
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());
  const [editingTitle, setEditingTitle] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'docente' | 'estudiante'>('docente');

  const printRef        = useRef<HTMLDivElement>(null);
  const printDocenteRef = useRef<HTMLDivElement>(null);

  // ── Imagen ilustrativa ─────────────────────────────────────────────────────
  const imageBlockIndex = blocks.findIndex((b) => b.tipo === 'imagen');
  const imageBlock      = imageBlockIndex >= 0 ? blocks[imageBlockIndex] : null;
  const imageMeta       = imageBlock ? (imageBlock.metadata as unknown as MetadataImagen) : null;

  const actividadStartIdx    = blocks.findIndex((b) => b.contenido.includes(ACTIVIDAD_MARKER));
  const hasActividadImprimible = actividadStartIdx >= 0;


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
    const block  = blocks[i];
    const meta   = block.metadata as unknown as MetadataImagen;
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
      // silencioso — mantiene imagen anterior
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


  const ImageThumbnail = () =>
    imageBlock && imageMeta?.url ? (
      <div className="flex items-center gap-4 py-3 px-4 bg-gray-50/80 rounded-xl border border-dashed border-gray-200">
        <img
          src={buildImageUrl(imageMeta.url)}
          alt={imageMeta.alt ?? 'Imagen de la guía'}
          className="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0 border border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700 font-public leading-tight truncate">
            {imageMeta.alt ?? 'Imagen ilustrativa del tema'}
          </p>
          <p className="text-xs text-gray-400 font-public mt-0.5">
            Ilustración generada por IA · aparece en la Actividad del estudiante
          </p>
        </div>
        <button
          onClick={() => handleRegenerateImage(imageBlockIndex)}
          disabled={regeneratingIdx === imageBlockIndex}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-copper border border-gray-200 hover:border-copper/50 bg-white px-3 py-1.5 rounded-full transition disabled:opacity-50 font-public shrink-0"
          title="Regenerar imagen con IA"
        >
          {regeneratingIdx === imageBlockIndex ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Generando…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerar
            </>
          )}
        </button>
      </div>
    ) : null;

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border-t-4 border-copper font-public">

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
            esPublicada ? 'bg-olive/10 text-olive' : 'bg-amber/20 text-amber'
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

      {/* ── Tabs ──────────────────────────────────────────────────────────────── */}
      {hasActividadImprimible && (
        <div className="flex px-8 border-b border-gray-100">
          {([
            { key: 'docente',    label: '📋 Guía del docente' },
            { key: 'estudiante', label: '🎓 Actividad del estudiante' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-3 text-sm font-semibold font-public border-b-2 -mb-px transition ${
                activeTab === key
                  ? 'border-copper text-copper'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Contenido ─────────────────────────────────────────────────────────── */}
      <div className="px-8 py-6">

        {/* Tab: Guía del docente */}
        {activeTab === 'docente' && (
          <>
            <div className="space-y-4">
              {blocks.map((block, i) => {
                if (block.tipo === 'imagen') return null;
                if (hasActividadImprimible && i >= actividadStartIdx) return null;
                return (
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
                );
              })}
            </div>

            <div className="hidden">
              <GuiaDocenteImprimible
                ref={printDocenteRef}
                allBlocks={blocks}
                titulo={titulo}
              />
            </div>
          </>
        )}

        {/* Tab: Actividad del estudiante — bloques editables igual que la guía */}
        {activeTab === 'estudiante' && (
          <>
            <div className="mb-5">
              <ImageThumbnail />
            </div>

            <div className="space-y-4">
              {blocks.map((block, i) => {
                if (block.tipo === 'imagen') return null;
                if (i < actividadStartIdx) return null;
                return (
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
                );
              })}
            </div>

            <div className="hidden">
              <ActividadImprimible
                ref={printRef}
                allBlocks={blocks}
                titulo={titulo}
              />
            </div>
          </>
        )}

      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div className="px-8 pb-8 pt-5 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-gray-400 font-public">
          Los cambios crean una nueva versión en el servidor.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {saveSuccess && (
            <span className="text-sm text-olive font-public flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Guardado
            </span>
          )}

          {activeTab === 'docente' && (
            <PrintButton
              contentRef={printDocenteRef}
              documentTitle={`Guía del Docente — ${titulo}`}
              label="Guía PDF"
            />
          )}

          {hasActividadImprimible && activeTab === 'estudiante' && (
            <PrintButton
              contentRef={printRef}
              documentTitle={`Actividad — ${titulo}`}
              label="Actividad PDF"
            />
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
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
        </div>
      </div>

    </article>
  );
};
