import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="min-h-screen bg-cream flex items-start justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
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
