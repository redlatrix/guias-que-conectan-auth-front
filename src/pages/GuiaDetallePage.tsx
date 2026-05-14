import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { GlobeIcon } from '@/features/auth/components/GlobeIcon';
import { useGuias } from '@/features/guias/hooks/useGuias';
import { GuiaEditor } from '@/features/guias/components/GuiaEditor';
import { SkeletonGuia } from '@/features/guias/components/SkeletonGuia';
import type { BloqueContenido } from '@/features/guias/types/guia.types';

export const GuiaDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const { currentGuia, isLoadingList, isSaving, isPublishing, error, loadGuia, saveGuia, publishGuia } = useGuias();

  useEffect(() => {
    if (id) loadGuia(Number(id));
  }, [id]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

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
      {/* Header */}
      <header className="bg-olive px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <GlobeIcon size={36} />
            <div>
              <p className="text-cream font-crimson font-bold text-base tracking-widest uppercase leading-none">
                Guias que
              </p>
              <p className="text-cream/70 text-[10px] tracking-[0.3em] uppercase">Conectan</p>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              to="/generar"
              className="text-cream/70 hover:text-cream text-sm font-public transition"
            >
              Nueva Guía
            </Link>
            <Link
              to="/mis-guias"
              className="text-cream/70 hover:text-cream text-sm font-public transition"
            >
              Mis Guías
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-cream/80 hover:text-cream text-sm font-public border border-cream/30 hover:border-cream/70 px-4 py-1.5 rounded-md transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
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
