import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import placeholderImg from '@/assets/placeholder-login.svg';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passWordError , setPassWordError] = useState('');
  const [emailError , setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!email) {
        setEmailError('Preencha o email');
        toast.warning('Preencha todos o email');
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        setError(data.message);
        return;
      }

      localStorage.setItem('token', data.access_token);
      window.location.href = '/';
    } catch {
      setError('Erro ao conectar com o servidor');
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-b2-950 to-b2-700 p-12 md:flex">
        <img src={placeholderImg} alt="" className="mb-8 w-64 opacity-80" />
        <h1 className="mb-3 text-4xl font-bold text-white">B2.Work</h1>
        <p className="max-w-xs text-center text-lg text-b2-200">
          Gerencie seus workflows com eficiencia
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 md:hidden">B2.Work</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <h2 className="hidden text-3xl font-bold text-gray-900 md:block">Login</h2>

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {emailError && <p className="text-sm text-red-500">{emailError}</p>}

          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {passWordError && <p className="text-sm text-red-500">{passWordError}</p>}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" loading={loading}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
