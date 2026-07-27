import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useBoardStore } from '@/stores/boardStore';
import { toast } from 'sonner';

const navItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: Briefcase, label: 'Meu Trabalho', path: '/my-work' },
  { icon: User, label: 'Meu Perfil', path: '/profile' },
];

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Gestor',
  USER: 'Usuário',
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, initials, logout } = useAuth();
  const { boards, fetchBoards } = useBoardStore();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  function handleLogout() {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  }

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-900',
        collapsed ? 'w-16' : 'w-64',
      )}
    >

      <Link
        to="/profile"
        className="flex flex-col items-center gap-2 border-b border-gray-200 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-b2-100 text-xl font-bold text-b2-700 dark:bg-b2-900/40 dark:text-b2-400">
          {initials}
        </div>
        {!collapsed && user && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{roleLabels[user.role] ?? user.role}</p>
          </div>
        )}
      </Link>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              location.pathname === item.path
                ? 'bg-b2-50 text-b2-700 dark:bg-b2-950/30 dark:text-b2-400'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && item.label}
          </Link>
        ))}

        <div className="pt-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Boards</span>}
          </div>

          {!collapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {boards.map((board) => (
                <Link
                  key={board.id}
                  to={`/boards/${board.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    location.pathname === `/boards/${board.id}`
                      ? 'bg-b2-50 text-b2-700 dark:bg-b2-950/30 dark:text-b2-400'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: board.color }}
                  />
                  {board.name}
                </Link>
              ))}
              {boards.length === 0 && (
                <p className="px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500">
                  Nenhum board
                </p>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="space-y-1 border-t border-gray-200 p-3 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-lg p-2 text-sm text-gray-600 
          hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400
           dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && 'Sair'}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center 
          rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 
          dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
