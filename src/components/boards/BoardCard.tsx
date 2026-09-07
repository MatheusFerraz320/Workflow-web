import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, LayoutDashboard, ArrowRight } from 'lucide-react';
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
      className="group cursor-pointer rounded-2xl border border-gray-200 border-l-4 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:shadow-gray-900/50"
      style={{ borderLeftColor: board.color }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${board.color}15` }}
        >
          <LayoutDashboard className="h-6 w-6" style={{ color: board.color }} />
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(board);
            }}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(board);
            }}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
        {board.name}
      </h3>

      {board.description && (
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
          {board.description}
        </p>
      )}

      {!board.description && <div className="mb-4" />}

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: board.color }}
          />
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Criado em {formatDate(board.createdAt)}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-600 dark:text-gray-600 dark:group-hover:text-brand-400" />
      </div>
    </div>
  );
}
