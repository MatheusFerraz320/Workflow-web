import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import placeholderImg from '@/assets/placeholder-login.svg';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar com o servidor';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-b2-950 to-b2-700 p-12 md:flex">
        <img src={placeholderImg} alt="" className="mb-8 w-64 opacity-80" />
        <h1 className="mb-3 text-4xl font-bold text-white">B2.Work</h1>
        <p className="max-w-xs text-center text-lg text-b2-200">
          Gerencie seus workflows com eficiencia
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100 md:hidden">B2.Work</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <h2 className="hidden text-3xl font-bold text-gray-900 dark:text-gray-100 md:block">Login</h2>

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
