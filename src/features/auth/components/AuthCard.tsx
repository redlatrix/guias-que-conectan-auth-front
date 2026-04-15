import type { ReactNode } from 'react';
import { GlobeIcon } from './GlobeIcon';

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
          <GlobeIcon size={64} />
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
