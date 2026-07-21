import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const boards = [
  { name: 'Tráfego Pago', color: '#8b5cf6', tasks: 4, date: 'Criado em 19/07/2026' },
  { name: 'Design', color: '#ec4899', tasks: 6, date: 'Criado em 19/07/2026' },
  { name: 'Conteúdo', color: '#22c55e', tasks: 3, date: 'Criado em 19/07/2026' },
];

export function Home() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'Usuário';

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Olá, {firstName} 👋</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Bem-vindo ao B2.Work</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meus Boards</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <div
            key={board.name}
            className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: board.color }}
              />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{board.name}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{board.tasks} tarefas</p>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{board.date}</p>
          </div>
        ))}

        <button className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white transition-all hover:border-b2-400 hover:bg-b2-50 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-b2-500 dark:hover:bg-b2-950/30">
          <Plus className="h-6 w-6 text-gray-400 group-hover:text-b2-600 dark:text-gray-500 dark:group-hover:text-b2-400" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Novo Board</span>
        </button>
      </div>
    </div>
  );
}
