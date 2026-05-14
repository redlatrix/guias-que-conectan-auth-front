import { useState, useRef, useEffect } from 'react';
import type { DBA } from '../types/guia.types';

interface DbaDropdownProps {
  dbas: DBA[];
  value: number;
  onChange: (id: number) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Custom dropdown para seleccionar un DBA con el enunciado_oficial completo visible.
 */
export const DbaDropdown = ({
  dbas,
  value,
  onChange,
  loading = false,
  disabled = false,
  placeholder = 'Selecciona un DBA',
}: DbaDropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = dbas.find((d) => d.id === value) ?? null;


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const isDisabled = disabled || loading;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-public bg-white text-left flex items-start justify-between gap-2 outline-none focus:border-copper focus:ring-1 focus:ring-copper transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-normal"
      >
        <span className={`flex-1 leading-snug whitespace-normal break-words ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? (
            <>
              <span className="text-copper font-semibold">[{selected.codigo_men}]</span>{' '}
              {selected.enunciado_oficial}
            </>
          ) : (
            placeholder
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>


      {open && !isDisabled && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {dbas.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-4 font-public text-center">
              No hay DBAs disponibles para este grado.
            </p>
          ) : (
            dbas.map((d) => (
              <div
                key={d.id}
                role="option"
                aria-selected={d.id === value}
                onClick={() => {
                  onChange(d.id);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { onChange(d.id); setOpen(false); }
                }}
                tabIndex={0}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition cursor-pointer hover:bg-copper/5 focus:outline-none focus:bg-copper/5 ${
                  d.id === value
                    ? 'bg-copper/10 border-l-2 border-l-copper pl-3.5'
                    : ''
                }`}
              >
                <span className="block text-xs font-semibold text-copper font-public mb-0.5 uppercase tracking-wide">
                  {d.codigo_men}
                </span>
                <span className="block text-sm text-gray-800 font-public leading-relaxed whitespace-normal break-words">
                  {d.enunciado_oficial}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
