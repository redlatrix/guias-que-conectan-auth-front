import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth'; // Tu hook de estado

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};