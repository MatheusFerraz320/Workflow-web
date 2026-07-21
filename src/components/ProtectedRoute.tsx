import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/user';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

const rolePriority: Record<UserRole, number> = {
  USER: 0,
  MANAGER: 1,
  ADMIN: 2,
};

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && rolePriority[user.role] < rolePriority[requiredRole]) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
