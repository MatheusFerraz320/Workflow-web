import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, Calendar, Save, X, Camera } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Gestor',
  USER: 'Usuário',
};

const roleBadgeColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  MANAGER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  USER: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ProfilePage() {
  const { user, initials } = useAuth();
  const updateMe = useAuthStore((s) => s.updateMe);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    if (password && password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const dto: { name: string; email: string; password?: string } = {
        name: name.trim(),
        email: email.trim(),
      };
      if (password.trim()) {
        dto.password = password.trim();
      }
      await updateMe(dto);
      setPassword('');
      setConfirmPassword('');
      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setName(user!.name);
    setEmail(user!.email);
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-b2-100 text-2xl font-bold text-b2-700 dark:bg-b2-900/40 dark:text-b2-400">
              {initials}
            </div>
            <button
              type="button"
              title="Alterar foto"
              className="absolute bottom-0 right-0 rounded-full bg-b2-600 p-1.5 text-white shadow-md transition-colors hover:bg-b2-700"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
            <p className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeColors[user.role]}`}>
                <Shield className="h-3 w-3" />
                {roleLabels[user.role] ?? user.role}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Calendar className="h-3 w-3" />
                Membro desde {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="profile-name"
            label="Nome completo"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="profile-email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="profile-password"
            label="Nova senha (deixe vazio para manter)"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password && (
            <Input
              id="profile-confirm-password"
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={handleCancel}
              className="w-auto bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="w-auto px-6">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
