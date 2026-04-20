import { Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { Dashboard } from '@/pages/Dashboard';
import { GeneradorPage } from '@/pages/GeneradorPage';
import { MisGuiasPage } from '@/pages/MisGuiasPage';
import { GuiaDetallePage } from '@/pages/GuiaDetallePage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generar" element={<GeneradorPage />} />
        <Route path="/mis-guias" element={<MisGuiasPage />} />
        <Route path="/guias/:id" element={<GuiaDetallePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
