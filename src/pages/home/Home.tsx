import { useEffect, useState } from 'react';
import { Plus, LayoutDashboard, Loader2 } from 'lucide-react';
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Olá, {firstName}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Bem-vindo</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quadros da {" "} 
          <span className="text-b2-600 dark:text-b2-400 text-2xl">B2</span></h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white transition-all hover:border-b2-400 hover:bg-b2-50 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-b2-500 dark:hover:bg-b2-950/30"
          >
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-b2-600 dark:text-gray-500 dark:group-hover:text-b2-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Novo Board</span>
          </button>
        </div>
      )}

      {!isLoading && boards.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-700">
          <LayoutDashboard className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Nenhum board encontrado
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Crie seu primeiro board para começar
          </p>
        </div>
      )}

      <CreateBoardModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditBoardModal open={!!editBoard} board={editBoard} onClose={() => setEditBoard(null)} />
    </div>
  );
}
