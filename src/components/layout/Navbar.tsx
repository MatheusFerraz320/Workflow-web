import { Link } from 'react-router-dom';
import { Search, Bell, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar boards, tarefas..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-b2-500 focus:bg-white focus:ring-1 focus:ring-b2-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-b2-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-b2-700">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Board</span>
        </button>
        {user?.role === 'ADMIN' && (
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Cadastrar usuário</span>
          </Link>
        )}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
