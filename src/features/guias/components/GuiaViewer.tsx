import { useState, useRef } from 'react';
import { GuiaBlock } from './GuiaBlock';
import { ActividadImprimible } from './ActividadImprimible';
import { GuiaDocenteImprimible } from './GuiaDocenteImprimible';
import { PrintButton } from './PrintButton';
import type { BloqueContenido, MetadataImagen } from '../types/guia.types';
import { buildImageUrl } from '../utils/buildImageUrl';
import { FaListCheck, FaGraduationCap } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const ACTIVIDAD_MARKER = 'ACTIVIDAD PRÁCTICA IMPRIMIBLE';

interface GuiaViewerProps {
    titulo: string;
    blocks: BloqueContenido[];
    isReadOnly?: boolean;
    // solo se usan si !isReadOnly:
    editingIndices?: Set<number>;
    onToggleBlock?: (i: number) => void;
    onUpdateBlock?: (i: number, contenido: string) => void;
    onRegenerateImage?: (i: number) => void;
    regeneratingIdx?: number | null;
    footerActions?: React.ReactNode;
}

export const GuiaViewer = ({
    titulo,
    blocks,
    isReadOnly = false,
    editingIndices = new Set(),
    onToggleBlock,
    onUpdateBlock,
    onRegenerateImage,
    regeneratingIdx,
    footerActions
}: GuiaViewerProps) => {
    const [activeTab, setActiveTab] = useState<'docente' | 'estudiante'>('docente');
    const printRef = useRef<HTMLDivElement>(null);
    const printDocenteRef = useRef<HTMLDivElement>(null);

    const imageBlockIndex = blocks.findIndex((b) => b.tipo === 'imagen');
    const imageBlock = imageBlockIndex >= 0 ? blocks[imageBlockIndex] : null;
    const imageMeta = imageBlock ? (imageBlock.metadata as unknown as MetadataImagen) : null;

    const actividadStartIdx = blocks.findIndex((b) => b.contenido.includes(ACTIVIDAD_MARKER));
    const hasActividadImprimible = actividadStartIdx >= 0;

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
                {!isReadOnly && onRegenerateImage && (
                    <button
                        onClick={() => onRegenerateImage(imageBlockIndex)}
                        disabled={regeneratingIdx === imageBlockIndex}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-copper border border-gray-200 hover:border-copper/50 bg-white px-3 py-1.5 rounded-full transition disabled:opacity-50 font-public shrink-0"
                    >
                        {/* ...mismo botón regenerar que ya tienes... */}
                        Regenerar
                    </button>
                )}
            </div>
        ) : null;

    return (
        <>
            {/* ── Tabs ── */}
            {hasActividadImprimible && (
                <div className="flex p-1.5 bg-gray-100 rounded-xl border border-gray-200/60 max-w-4xl mx-auto my-4">
                    {([
                        { key: 'docente', label: 'Guía del docente', icon: <FaListCheck className="w-5 h-5" /> },
                        { key: 'estudiante', label: 'Actividad del estudiante', icon: <FaGraduationCap className="w-6 h-6" /> },
                    ] as const).map(({ key, label, icon }) => {
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex-1 py-4 text-xl font-bold font-public rounded-lg transition-all flex items-center justify-center gap-3 relative ${isActive
                                    ? 'bg-white text-orange-500 shadow-sm border border-gray-200/40'
                                    : 'text-gray-500 hover:text-olive hover:bg-gray-50/50'
                                    }`}
                            >
                                {isActive && <span className="w-2 h-2 rounded-full bg-orange-500 absolute left-6 animate-ping" />}
                                <span className={isActive ? 'text-orange-500' : 'text-gray-400'}>{icon}</span>
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── Contenido ── */}
            <div className="px-8 py-6">
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
                                            isEditing={!isReadOnly && editingIndices.has(i)}
                                            onContentChange={!isReadOnly ? (c) => onUpdateBlock?.(i, c) : undefined}
                                        />
                                        {!isReadOnly && (
                                            <button
                                                onClick={() => onToggleBlock?.(i)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white border border-gray-200 text-gray-500 hover:text-copper hover:border-copper px-2 py-0.5 rounded font-public shadow-sm"
                                            >
                                                {editingIndices.has(i) ? '✓ Listo' : 'Editar'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="hidden">
                            <GuiaDocenteImprimible ref={printDocenteRef} allBlocks={blocks} titulo={titulo} />
                        </div>
                    </>
                )}

                {activeTab === 'estudiante' && (
                    <>
                        <div className="mb-5"><ImageThumbnail /></div>
                        <div className="space-y-4">
                            {blocks.map((block, i) => {
                                if (block.tipo === 'imagen') return null;
                                if (i < actividadStartIdx) return null;
                                return (
                                    <div key={i} className="relative group">
                                        <GuiaBlock
                                            block={block}
                                            isEditing={!isReadOnly && editingIndices.has(i)}
                                            onContentChange={!isReadOnly ? (c) => onUpdateBlock?.(i, c) : undefined}
                                        />
                                        {!isReadOnly && (
                                            <button
                                                onClick={() => onToggleBlock?.(i)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white border border-gray-200 text-gray-500 hover:text-copper hover:border-copper px-2 py-0.5 rounded font-public shadow-sm"
                                            >
                                                {editingIndices.has(i) ? '✓ Listo' : 'Editar'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="hidden">
                            <ActividadImprimible ref={printRef} allBlocks={blocks} titulo={titulo} />
                        </div>
                    </>
                )}
            </div>

            <div className="px-8 pb-8 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                {isReadOnly && (
                    <>
                        <Link
                            to="/explorar"
                            className="text-sm text-gray-400 hover:text-copper font-public transition flex items-center gap-1"
                        >
                            ← Volver al explorador
                        </Link>
                        <div className="flex items-center flex-wrap gap-3">
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
                            <Link
                                to="/register"
                                className="bg-copper hover:bg-copper-dark text-white text-sm font-public font-semibold px-5 py-3 rounded-lg transition"
                            >
                                Crear mi propia guía
                            </Link>
                        </div>
                    </>
                )}

                {/* Solo para editor (!isReadOnly) */}
                {!isReadOnly && (
                    <>
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
                        {footerActions}
                    </>
                )}
            </div>
        </>
    );
};