import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BloqueContenido, MetadataImagen } from '../types/guia.types';

// ── Constantes ─────────────────────────────────────────────────────────────────
const ACTIVIDAD_MARKER = 'ACTIVIDAD PRÁCTICA IMPRIMIBLE';

const buildImageUrl = (url: string): string => {
  if (!url || url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');
  return `${base}${url}`;
};

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface ActividadImprimibleProps {
  /** Todos los bloques de la guía — la imagen y la actividad se extraen internamente */
  allBlocks: BloqueContenido[];
  titulo: string;
}

/**
 * Hoja de trabajo imprimible de estilo editorial para el estudiante.
 *
 * — Incluye la imagen ilustrativa generada por DALL·E (float derecha).
 * — Solo renderiza la sección "ACTIVIDAD PRÁCTICA IMPRIMIBLE".
 * — Diseño tipográfico limpio sin recuadros excesivos.
 * — Se referencia desde PrintButton vía forwardRef.
 */
export const ActividadImprimible = forwardRef<HTMLDivElement, ActividadImprimibleProps>(
  ({ allBlocks, titulo }, ref) => {
    // ── Extraer imagen ─────────────────────────────────────────────────────────
    const imageBlock = allBlocks.find((b) => b.tipo === 'imagen');
    const imageMeta = imageBlock ? (imageBlock.metadata as unknown as MetadataImagen) : null;
    const imageUrl  = imageMeta?.url ? buildImageUrl(imageMeta.url) : undefined;
    const imageAlt  = imageMeta?.alt ?? 'Ilustración del tema';

    // ── Extraer bloques de actividad ───────────────────────────────────────────
    const startIdx = allBlocks.findIndex((b) => b.contenido.includes(ACTIVIDAD_MARKER));
    const actividadBlocks = startIdx >= 0 ? allBlocks.slice(startIdx) : [];

    if (!actividadBlocks.length) return null;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
      <div
        ref={ref}
        className="actividad-imprimible bg-white font-public text-gray-900"
        style={{ padding: '0', maxWidth: '180mm', margin: '0 auto', fontSize: '11pt', lineHeight: '1.65' }}
      >

        {/* ══ CABECERA ══════════════════════════════════════════════════════════ */}
        <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '7.5pt', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 3px 0', fontFamily: 'inherit' }}>
                Guías que Conectan · Actividad del Estudiante
              </p>
              <h1 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '18pt', fontWeight: '700', color: '#1a1a1a', margin: '0', lineHeight: '1.2' }}>
                {titulo}
              </h1>
            </div>
            {/* Espacio institucional */}
            <div style={{ width: '52px', height: '52px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '7pt', color: '#ccc', textAlign: 'center', lineHeight: '1.3' }}>Logo<br />inst.</span>
            </div>
          </div>
        </div>

        {/* ══ IDENTIFICACIÓN DEL ESTUDIANTE ════════════════════════════════════ */}
        <div style={{ marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10.5pt' }}>
              <strong>Nombre:</strong>
              <span style={{ display: 'inline-block', borderBottom: '1px solid #555', minWidth: '160px', marginLeft: '6px' }}>&nbsp;</span>
            </span>
            <span style={{ fontSize: '10.5pt' }}>
              <strong>Grado:</strong>
              <span style={{ display: 'inline-block', borderBottom: '1px solid #555', minWidth: '60px', marginLeft: '6px' }}>&nbsp;</span>
            </span>
            <span style={{ fontSize: '10.5pt' }}>
              <strong>Fecha:</strong>
              <span style={{ display: 'inline-block', borderBottom: '1px solid #555', minWidth: '100px', marginLeft: '6px' }}>&nbsp;</span>
            </span>
          </div>
        </div>

        {/* ══ CONTENIDO (imagen flotada + ejercicios) ═══════════════════════════ */}
        <div style={{ overflow: 'hidden' }}>

          {/* Imagen ilustrativa — float derecha, estilo editorial */}
          {imageUrl && (
            <figure style={{
              float: 'right',
              width: '42%',
              maxWidth: '210px',
              margin: '0 0 16px 22px',
              padding: '0',
            }}>
              <img
                src={imageUrl}
                alt={imageAlt}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '5px',
                  display: 'block',
                }}
              />
            </figure>
          )}

          {/* Bloques de la actividad — se omiten los de imagen (ya está en float derecha) */}
          {actividadBlocks.map((block, i) => {
            if (block.tipo === 'imagen') return null;
            return (<div key={i} className="print-block">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // ── H2: Ejercicio / sección — sin cajas ───────────────────
                  h2: ({ children }) => {
                    const text = String(children ?? '');
                    // Omitir el h2 del marcador principal (ya está en la cabecera)
                    if (text.includes(ACTIVIDAD_MARKER)) return null;
                    return (
                      <h2 style={{
                        fontFamily: 'Crimson Pro, Georgia, serif',
                        fontSize: '14pt',
                        fontWeight: '700',
                        color: '#3a3a2a',
                        marginTop: '22px',
                        marginBottom: '8px',
                        paddingBottom: '4px',
                        borderBottom: '1px solid #bbb',
                        lineHeight: '1.25',
                      }}>
                        {children}
                      </h2>
                    );
                  },
                  // ── H3: Sub-sección ───────────────────────────────────────
                  h3: ({ children }) => (
                    <h3 style={{
                      fontFamily: 'inherit',
                      fontSize: '11pt',
                      fontWeight: '700',
                      color: '#222',
                      marginTop: '14px',
                      marginBottom: '5px',
                    }}>
                      {children}
                    </h3>
                  ),
                  // ── Párrafo ───────────────────────────────────────────────
                  p: ({ children }) => {
                    // Omitir líneas "Nombre: ___ Grado: ___ Fecha: ___" generadas
                    // por GPT en guías antiguas — el componente ya las dibuja en el encabezado
                    const text = Array.isArray(children)
                      ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
                      : String(children ?? '');
                    if (/^Nombre\s*:/i.test(text.trim())) return null;
                    return (
                      <p style={{ margin: '0 0 6px 0', lineHeight: '1.65', fontSize: '10.5pt' }}>
                        {children}
                      </p>
                    );
                  },
                  // ── HR: línea de respuesta (25 guiones bajos = <hr>) ──────
                  hr: () => (
                    <div style={{
                      borderBottom: '1px solid #aaa',
                      marginBottom: '0',
                      marginTop: '22px',
                      height: '0',
                    }} />
                  ),
                  // ── Negrita / cursiva ─────────────────────────────────────
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: '700' }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: 'italic' }}>{children}</em>
                  ),
                  // ── Tabla editorial — bordes finos ────────────────────────
                  table: ({ children }) => (
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '10pt',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}>
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ borderBottom: '2px solid #333' }}>{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th style={{
                      padding: '6px 10px',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '9.5pt',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '2px solid #333',
                    }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{
                      padding: '8px 10px',
                      borderBottom: '1px solid #ccc',
                      fontSize: '10pt',
                      verticalAlign: 'top',
                      minHeight: '28px',
                    }}>
                      {children}
                    </td>
                  ),
                  // ── Listas ────────────────────────────────────────────────
                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 8px 0' }}>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: '20px', margin: '4px 0 8px 0' }}>{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '3px', lineHeight: '1.6', fontSize: '10.5pt' }}>
                      {children}
                    </li>
                  ),
                  // ── Separador visual (---) ────────────────────────────────
                  // Nota: los ___ de 25 guiones también son <hr> en ReactMarkdown
                  // Se estilizan igual como líneas de respuesta
                }}
              >
                {block.contenido}
              </ReactMarkdown>
            </div>
          );
          })}

          {/* Clear float */}
          <div style={{ clear: 'both' }} />
        </div>

        {/* ══ PIE DE PÁGINA ════════════════════════════════════════════════════ */}
        <div style={{
          marginTop: '28px',
          paddingTop: '8px',
          borderTop: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '7.5pt',
          color: '#999',
        }}>
          <span>Guías que Conectan · guiasqueconectan.edu.co</span>
          <span>Alineado con los DBA del MEN · Colombia</span>
        </div>
      </div>
    );
  }
);

ActividadImprimible.displayName = 'ActividadImprimible';
