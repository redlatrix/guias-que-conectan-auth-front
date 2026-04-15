import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-olive flex flex-col items-center justify-center py-8 px-6 gap-3">
          {/* Icono de red / conexiones */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-cream opacity-90"
            fill="none"
            viewBox="0 0 48 48"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="24" cy="10" r="3" fill="currentColor" stroke="none" />
            <circle cx="10" cy="30" r="3" fill="currentColor" stroke="none" />
            <circle cx="38" cy="30" r="3" fill="currentColor" stroke="none" />
            <circle cx="18" cy="40" r="3" fill="currentColor" stroke="none" />
            <circle cx="30" cy="40" r="3" fill="currentColor" stroke="none" />
            <line x1="24" y1="10" x2="10" y2="30" strokeWidth={1.5} />
            <line x1="24" y1="10" x2="38" y2="30" strokeWidth={1.5} />
            <line x1="10" y1="30" x2="18" y2="40" strokeWidth={1.5} />
            <line x1="38" y1="30" x2="30" y2="40" strokeWidth={1.5} />
            <line x1="10" y1="30" x2="38" y2="30" strokeWidth={1.5} />
          </svg>
          <div className="text-center">
            <p className="text-cream font-crimson font-bold text-xl tracking-widest uppercase leading-tight">
              Guias que
            </p>
            <p className="text-cream/80 text-xs tracking-[0.3em] uppercase font-public">
              Conectan
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-8 py-6">
          <h2 className="text-center font-crimson text-2xl font-semibold text-gray-800 mb-5">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};
