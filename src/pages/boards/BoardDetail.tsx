import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, LayoutDashboard } from 'lucide-react';
import { useBoardStore } from '@/stores/boardStore';
import type { Board } from '@/types/board';

export function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, fetchBoards, isLoading } = useBoardStore();
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (boards.length === 0) {
      fetchBoards();
    }
  }, [boards.length, fetchBoards]);

  useEffect(() => {
    if (boards.length > 0 && id) {
      setBoard(boards.find((b) => b.id === id) ?? null);
    }
  }, [boards, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LayoutDashboard className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Board não encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: board.color }} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{board.name}</h1>
        </div>
        {board.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{board.description}</p>
        )}
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-20 dark:border-gray-700">
        <LayoutDashboard className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Em breve: Kanban com grupos e itens
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          A visualização de tarefas será implementada em breve
        </p>
      </div>
    </div>
  );
}
