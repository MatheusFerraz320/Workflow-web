import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Inbox,
  LayoutDashboard,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: LayoutGrid, label: 'Meus Trabalhos', path: '/my-work' },
  { icon: Inbox, label: 'Inbox', path: '/inbox' },
];

const boardItems = [
  { label: 'Tráfego Pago', color: '#8b5cf6' },
  { label: 'Design', color: '#ec4899' },
  { label: 'Conteúdo', color: '#22c55e' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-gray-200 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-b2-600 text-sm font-bold text-white">
          B2
        </div>
        {!collapsed && <span className="text-sm font-semibold text-gray-900">B2.Work</span>}
      </div>

      <div className="flex flex-col items-center gap-2 border-b border-gray-200 px-4 py-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-b2-100 text-xl font-bold text-b2-700">
          M
        </div>
        {!collapsed && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">Matheus</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              location.pathname === item.path
                ? 'bg-b2-50 text-b2-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && item.label}
          </Link>
        ))}

        <div className="pt-4">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600',
            )}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Boards</span>}
          </div>

          {!collapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {boardItems.map((board) => (
                <Link
                  key={board.label}
                  to={`/boards/${board.label.toLowerCase().replace(/\s/g, '-')}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: board.color }}
                  />
                  {board.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/boards"
            className={cn(
              'mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )}
          >
            <Star className="h-5 w-5 shrink-0" />
            {!collapsed && 'Favoritos'}
          </Link>
        </div>
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
