import { useEffect, useState, useMemo } from 'react';
import { Users as UsersIcon, Search, Pencil, Trash2, Loader2, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { EditUserModal } from '@/components/users/EditUserModal';
import type { User, UserRole } from '@/types/user';

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  ADMIN: {
    label: 'Admin',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  MANAGER: {
    label: 'Gestor',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  USER: {
    label: 'Usuário',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const avatarColors = [
  'bg-b2-100 text-b2-700 dark:bg-b2-900/40 dark:text-b2-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function Users() {
  const { users, isLoading, fetchUsers, deleteUser } = useUserStore();
  const currentUser = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  async function handleDeleteUser(user: User) {
    if (user.id === currentUser?.id) {
      toast.warning('Você não pode excluir seu próprio usuário');
      return;
    }
    if (!confirm(`Deseja excluir o colaborador "${user.name}"?`)) return;
    try {
      await deleteUser(user.id);
      toast.success('Colaborador excluído com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir colaborador';
      toast.error(message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-b2-100 dark:bg-b2-900/40">
            <UsersIcon className="h-5 w-5 text-b2-600 dark:text-b2-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Colaboradores</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie os membros da sua equipe
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-b2-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-700">
          <UserX className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {search ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador cadastrado'}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:block">
            <div className="grid grid-cols-[1fr_1.2fr_auto_auto_auto] items-center gap-4 border-b border-gray-200 px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <span>Colaborador</span>
              <span>Email</span>
              <span>Cargo</span>
              <span>Cadastro</span>
              <span className="text-right">Ações</span>
            </div>
            {filtered.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1fr_1.2fr_auto_auto_auto] items-center gap-4 border-b border-gray-100 px-5 py-3.5 last:border-b-0 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(user.name)}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </span>
                </div>
                <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </span>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleConfig[user.role].className}`}
                >
                  {roleConfig[user.role].label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.createdAt)}
                </span>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setEditUser(user)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 sm:hidden">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getAvatarColor(user.name)}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditUser(user)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleConfig[user.role].className}`}
                  >
                    {roleConfig[user.role].label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="mt-4 text-center text-sm text-gray-400 dark:text-gray-500">
          {filtered.length} {filtered.length === 1 ? 'colaborador' : 'colaboradores'}
          {search && ` encontrado${filtered.length === 1 ? '' : 's'}`}
        </p>
      )}

      <EditUserModal
        open={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
      />
    </div>
  );
}
