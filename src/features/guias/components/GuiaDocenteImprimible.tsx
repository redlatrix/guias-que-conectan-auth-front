import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ActividadImprimibleProps, MetadataImagen } from '../types/guia.types';

const ACTIVIDAD_MARKER = 'ACTIVIDAD PRÁCTICA IMPRIMIBLE';

const buildImageUrl = (url: string): string => {
  if (!url || url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');
  return `${base}${url}`;
};

/**
 * Versión imprimible de la guía del docente.
 * Renderiza todos los bloques ANTES de la sección "ACTIVIDAD PRÁCTICA IMPRIMIBLE".
 */
export const GuiaDocenteImprimible = forwardRef<HTMLDivElement, ActividadImprimibleProps>(
  ({ allBlocks, titulo }, ref) => {
    const imageBlock = allBlocks.find((b) => b.tipo === 'imagen');
    const imageMeta  = imageBlock ? (imageBlock.metadata as unknown as MetadataImagen) : null;
    const imageUrl   = imageMeta?.url ? buildImageUrl(imageMeta.url) : undefined;
    const imageAlt   = imageMeta?.alt ?? 'Ilustración del tema';

    const endIdx       = allBlocks.findIndex((b) => b.contenido.includes(ACTIVIDAD_MARKER));
    const docenteBlocks = (endIdx >= 0 ? allBlocks.slice(0, endIdx) : allBlocks)
      .filter((b) => b.tipo !== 'imagen');

    if (!docenteBlocks.length) return null;

    return (
      <div
        ref={ref}
        className="guia-docente-imprimible bg-white font-public text-gray-900"
        style={{ padding: '0', maxWidth: '180mm', margin: '0 auto', fontSize: '11pt', lineHeight: '1.65' }}
      >

        {/* ══ CABECERA ══════════════════════════════════════════════════════════ */}
        <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '7.5pt', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 3px 0', fontFamily: 'inherit' }}>
                Guías que Conectan · Guía del Docente
              </p>
              <h1 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '18pt', fontWeight: '700', color: '#1a1a1a', margin: '0', lineHeight: '1.2' }}>
                {titulo}
              </h1>
            </div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                style={{ width: '52px', height: '52px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0, border: '1px solid #ddd' }}
              />
            ) : (
              <div style={{ width: '52px', height: '52px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '7pt', color: '#ccc', textAlign: 'center', lineHeight: '1.3' }}>Logo<br />inst.</span>
              </div>
            )}
          </div>
          <p style={{ fontSize: '7pt', color: '#bbb', margin: '6px 0 0 0', fontStyle: 'italic' }}>
            Documento de uso exclusivo del docente · No distribuir a estudiantes
          </p>
        </div>

        {/* ══ CONTENIDO ════════════════════════════════════════════════════════ */}
        <div>
          {docenteBlocks.map((block, i) => (
            <div key={i} className="print-block">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
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
                  ),

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

                  p: ({ children }) => (
                    <p style={{ margin: '0 0 6px 0', lineHeight: '1.65', fontSize: '10.5pt' }}>
                      {children}
                    </p>
                  ),

                  hr: () => (
                    <div style={{ borderBottom: '1px solid #aaa', marginBottom: '0', marginTop: '22px', height: '0' }} />
                  ),

                  strong: ({ children }) => (
                    <strong style={{ fontWeight: '700' }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: 'italic' }}>{children}</em>
                  ),

                  table: ({ children }) => (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', marginTop: '10px', marginBottom: '10px' }}>
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ borderBottom: '2px solid #333' }}>{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: '700', fontSize: '9.5pt', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '2px solid #333' }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #ccc', fontSize: '10pt', verticalAlign: 'top' }}>
                      {children}
                    </td>
                  ),

                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 8px 0' }}>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: '20px', margin: '4px 0 8px 0' }}>{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '3px', lineHeight: '1.6', fontSize: '10.5pt' }}>{children}</li>
                  ),
                }}
              >
                {block.contenido}
              </ReactMarkdown>
            </div>
          ))}
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

GuiaDocenteImprimible.displayName = 'GuiaDocenteImprimible';
