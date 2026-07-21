import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const isAuthenticated = !!user;

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '';

  return { user, isAuthenticated, isLoading, initials, login, logout };
}
