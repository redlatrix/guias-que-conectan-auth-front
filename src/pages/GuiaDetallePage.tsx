import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGuias } from '@/features/guias/hooks/useGuias';
import { GuiaEditor } from '@/features/guias/components/GuiaEditor';
import { SkeletonGuia } from '@/features/guias/components/SkeletonGuia';
import { AuthNavbar } from '@/features/auth/components/AuthNavbar';
import type { BloqueContenido } from '@/features/guias/types/guia.types';

export const GuiaDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentGuia, isLoadingList, isSaving, isPublishing, error, loadGuia, saveGuia, publishGuia } = useGuias();

  useEffect(() => {
    if (id) loadGuia(Number(id));
  }, [id]);

  const handleSave = async (titulo: string, contenido_json: BloqueContenido[]) => {
    if (!currentGuia) return;
    await saveGuia(currentGuia.id, { titulo, contenido_json });
  };

  const handlePublish = async () => {
    if (!currentGuia) return;
    await publishGuia(currentGuia.id);
  };

  return (
    <div className="min-h-screen bg-cream font-public">
      <AuthNavbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-public mb-6">
          <Link to="/mis-guias" className="hover:text-copper transition">
            Mis Guías
          </Link>
          <span>›</span>
          <span className="text-gray-600 truncate max-w-[260px]">
            {currentGuia ? currentGuia.titulo : `Guía #${id}`}
          </span>
        </div>

        {/* Contenido */}
        {isLoadingList && <SkeletonGuia />}

        {error && !isLoadingList && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😞</div>
            <h2 className="font-crimson text-xl font-semibold text-gray-600 mb-2">
              Guía no encontrada
            </h2>
            <p className="text-sm text-gray-400 font-public mb-6">{error}</p>
            <Link
              to="/mis-guias"
              className="bg-copper hover:bg-copper-dark text-white font-public font-semibold px-6 py-2.5 rounded-lg transition inline-block"
            >
              Ver mis guías
            </Link>
          </div>
        )}

        {currentGuia && !isLoadingList && (
          <GuiaEditor
            guia={currentGuia}
            isSaving={isSaving}
            isPublishing={isPublishing}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        )}
      </main>
    </div>
  );
};
