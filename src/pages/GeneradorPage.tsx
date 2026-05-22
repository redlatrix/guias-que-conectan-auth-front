import { GeneradorGuia } from '@/features/guias/components/GeneradorGuia';
import { AuthNavbar } from '@/features/auth/components/AuthNavbar';

export const GeneradorPage = () => {
  return (
    <div className="min-h-screen bg-cream font-public">
      <AuthNavbar />

      <main className="max-w-3xl lg:max-w-6xl mx-auto px-4 py-10">
        <GeneradorGuia />
      </main>
    </div>
  );
};
