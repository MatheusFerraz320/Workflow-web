import { Pencil, Trash2, Calendar } from 'lucide-react';
import type { Item, Priority } from '@/types/item';

interface ItemCardProps {
  item: Item;
  onClick: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const priorityConfig: Record<Priority, { label: string; dotColor: string; badgeClass: string }> = {
  URGENT: {
    label: 'URGENTE',
    dotColor: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  },
  HIGH: {
    label: 'ALTA',
    dotColor: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  },
  MEDIUM: {
    label: 'MÉDIA',
    dotColor: 'bg-yellow-500',
    badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  },
  LOW: {
    label: 'BAIXA',
    dotColor: 'bg-green-500',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function ItemCard({ item, onClick, onEdit, onDelete }: ItemCardProps) {
  const priority = priorityConfig[item.priority];
  const overdue = item.dueDate && isOverdue(item.dueDate) && item.status !== 'DONE';

  return (
    <div
      onClick={() => onClick(item)}
      className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priority.dotColor}`} />
            <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </h4>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold leading-tight ${priority.badgeClass}`}>
              {priority.label}
            </span>

            <div className="ml-1 flex opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                title="Editar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Excluir"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {item.description && (
          <div
            className="tiptap ml-4.5 mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}

        <div className="ml-4.5 mt-2 flex flex-wrap items-center gap-3">
          {item.assignee && (
            <div className="flex items-center gap-1.5">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full bg-b2-100 text-[9px] font-bold text-b2-700 dark:bg-b2-900/30 dark:text-b2-400"
                title={item.assignee.name}
              >
                {item.assignee.name
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {item.assignee.name.split(' ')[0]}
              </span>
            </div>
          )}

          {item.dueDate && (
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                overdue
                  ? 'font-semibold text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(item.dueDate)}
              {overdue && <span className="ml-0.5 text-[10px]">atrasado</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
