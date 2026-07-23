import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import type { Board } from '@/types/board';

interface BoardCardProps {
  board: Board;
  onEdit: (board: Board) => void;
  onDelete: (board: Board) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function BoardCard({ board, onEdit, onDelete }: BoardCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{board.name}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(board);
            }}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(board);
            }}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title="Excluir"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {board.description && (
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {board.description}
        </p>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500">Criado em {formatDate(board.createdAt)}</p>
    </div>
  );
}
