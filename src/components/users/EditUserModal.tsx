import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import type { User, UserRole } from '@/types/user';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'USER', label: 'Usuário' },
  { value: 'MANAGER', label: 'Gestor' },
  { value: 'ADMIN', label: 'Admin' },
];

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function EditUserModal({ open, user, onClose }: EditUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const updateUser = useUserStore((s) => s.updateUser);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword('');
    }
  }, [user]);

  if (!open || !user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const dto: { name: string; email: string; role: UserRole; password?: string } = {
        name: name.trim(),
        email: email.trim(),
        role,
      };
      if (password.trim()) {
        dto.password = password.trim();
      }
      await updateUser(user!.id, dto);
      toast.success('Colaborador atualizado com sucesso!');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar colaborador';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Editar Colaborador</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="edit-name"
            label="Nome"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="edit-email"
            label="Email"
            type="email"
            placeholder="email@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargo
            </label>
            <select
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-500"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="edit-password"
            label="Nova senha (deixe vazio para manter)"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} className="w-auto bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="w-auto px-6">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
