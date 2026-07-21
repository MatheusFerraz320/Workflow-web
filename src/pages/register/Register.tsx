import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import type { UserRole } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'USER', label: 'Usuário' },
  { value: 'MANAGER', label: 'Gestor' },
  { value: 'ADMIN', label: 'Admin' },
];

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

const initialErrors: Errors = {};

export function Register() {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!role) {
      newErrors.role = 'O cargo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!validateForm()) {
        toast.warning('Preencha todos os campos corretamente');
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success(`${name} foi cadastrado com sucesso!`);
      setName('');
      setEmail('');
      setPassword('');
      setRole('USER');
      setErrors({});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar com o servidor';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-b2-100 dark:bg-b2-900/40">
            <UserPlus className="h-5 w-5 text-b2-600 dark:text-b2-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cadastrar Colaborador</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Preencha os dados para criar uma nova conta</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="name"
              label="Nome completo"
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="joao@b2.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cargo
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-b2-500"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={loading} className="w-auto px-6">
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
