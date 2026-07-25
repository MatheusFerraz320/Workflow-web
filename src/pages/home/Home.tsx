import { useEffect, useState } from 'react';
import { Plus, LayoutDashboard, LayoutGrid, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBoardStore } from '@/stores/boardStore';
import { BoardCard } from '@/components/boards/BoardCard';
import { CreateBoardModal } from '@/components/boards/CreateBoardModal';
import { EditBoardModal } from '@/components/boards/EditBoardModal';
import { toast } from 'sonner';
import type { Board } from '@/types/board';

export function Home() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'Usuário';
  const { boards, isLoading, fetchBoards, deleteBoard } = useBoardStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editBoard, setEditBoard] = useState<Board | null>(null);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  async function handleDelete(board: Board) {
    if (!confirm(`Deseja excluir o board "${board.name}"?`)) return;
    try {
      await deleteBoard(board.id);
      toast.success('Quadro excluído com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir board';
      toast.error(message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-b2-50 to-b2-100/60 p-6 sm:p-8 dark:from-b2-950/40 dark:to-b2-900/20">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm dark:bg-gray-800/80">
            <LayoutGrid className="h-7 w-7 text-b2-600 dark:text-b2-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              Olá, {firstName}!
            </h1>
            <p className="mt-0.5 text-base text-gray-600 sm:text-lg dark:text-gray-300">
              Bem-vindo ao B2WorkFlow
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-100 dark:bg-b2-900/40">
            <LayoutDashboard className="h-5 w-5 text-b2-600 dark:text-b2-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Quadros de Trabalho
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie seus projetos e tarefas
            </p>
          </div>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 self-start rounded-full bg-b2-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-b2-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Novo Quadro
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
        </div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 dark:border-gray-700">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <LayoutDashboard className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-base font-medium text-gray-500 dark:text-gray-400">
            Nenhum quadro encontrado
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Crie seu primeiro quadro para começar
          </p>
          <button
            onClick={() => setCreateOpen(true)}
            className="mt-6 flex items-center gap-2 rounded-full bg-b2-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-b2-700"
          >
            <Plus className="h-4 w-4" />
            Novo Quadro
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onEdit={setEditBoard}
              onDelete={handleDelete}
            />
          ))}

          <button
            onClick={() => setCreateOpen(true)}
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:border-b2-400 hover:bg-b2-50/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-b2-500 dark:hover:bg-b2-950/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-b2-100 dark:bg-gray-800 dark:group-hover:bg-b2-900/40">
              <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Novo Quadro</span>
          </button>
        </div>
      )}

      <CreateBoardModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditBoardModal open={!!editBoard} board={editBoard} onClose={() => setEditBoard(null)} />
    </div>
  );
}
