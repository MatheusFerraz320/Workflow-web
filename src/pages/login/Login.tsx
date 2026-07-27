import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, ArrowRight } from 'lucide-react';

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
      <div className="relative hidden w-1/3 items-center justify-center overflow-hidden md:flex bg-gradient-to-br from-b2-950 via-b2-700 to-b2-800">
        {/* Floating Shapes */}
        <div className="absolute top-[10%] left-[15%] h-24 w-24 rounded-3xl border border-b2-400/20 bg-b2-400/10 animate-float-slow backdrop-blur-sm" />
        <div className="absolute top-[60%] left-[8%] h-16 w-16 rounded-full border border-b2-300/20 bg-b2-300/10 animate-float-medium backdrop-blur-sm" />
        <div className="absolute top-[20%] right-[12%] h-32 w-32 rounded-full border border-b2-500/15 bg-b2-500/10 animate-float-fast backdrop-blur-sm" />
        <div className="absolute bottom-[15%] right-[20%] h-20 w-20 rotate-45 rounded-2xl border border-b2-400/20 bg-b2-400/10 animate-float-medium backdrop-blur-sm" />
        <div className="absolute top-[45%] left-[30%] h-12 w-12 rounded-xl border border-b2-300/15 bg-b2-300/10 animate-float-slow backdrop-blur-sm" />
        <div className="absolute bottom-[30%] left-[50%] h-28 w-28 rounded-full border border-b2-200/10 bg-b2-200/5 animate-float-fast backdrop-blur-sm" />
        <div className="absolute top-[75%] right-[35%] h-14 w-14 rounded-2xl border border-b2-400/15 bg-b2-400/8 animate-float-slow backdrop-blur-sm" />
        <div className="absolute top-[5%] left-[55%] h-10 w-10 rotate-12 rounded-lg border border-b2-300/20 bg-b2-300/10 animate-float-medium backdrop-blur-sm" />

        {/* Glow Orbs */}
        <div className="absolute top-[25%] left-[20%] h-64 w-64 rounded-full bg-b2-500/8 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[15%] h-48 w-48 rounded-full bg-b2-400/10 blur-3xl animate-pulse-slow animation-delay-2000" />

        {/* Content */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-b2-400/20 border border-b2-400/30 backdrop-blur-sm">
              <svg className="h-7 w-7 text-b2-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-b2-300/80">B2 WorkFlow</span>
          </div>

          <h1 className="mb-4 text-5xl font-bold leading-tight text-white">
            Automatização do{' '}
            <span className="bg-gradient-to-r from-b2-300 to-b2-400 bg-clip-text text-transparent">
               workflow
            </span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-white">
            Transforme tarefas repetitivas em fluxos inteligentes. 
            Produtividade que escala com o seu negócio.
          </p>

          <div className="mt-10 flex items-center gap-6 text-sm text-white">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Automação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Colaboração</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Controle</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="mb-10 flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">B2.Work</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Colaborador faça login para continuar
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="seu@email.com"
                inputSize="lg"
                icon={<Mail className="h-5 w-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                id="password"
                label="Senha"
                type="password"
                placeholder="Sua senha"
                inputSize="lg"
                icon={<Lock className="h-5 w-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-b2-600 transition-colors hover:text-b2-700 dark:text-b2-400 dark:hover:text-b2-300"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <Button type="submit" size="lg" loading={loading}>
                <span className="flex items-center gap-2">
                  Entrar
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Não tem uma conta?{' '}
            <span className="font-medium text-b2-600 dark:text-b2-400">
              Fale com o administrador
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
