import { Pin, PinOff, Calendar, AlertTriangle, Bolt, ArrowUp, ArrowDown, LayoutDashboard } from 'lucide-react';
import type { Item, Priority, ItemStatus } from '@/types/item';

interface WorkListItemProps {
  item: Item;
  isPinned: boolean;
  onTogglePin: (itemId: string) => void;
  onClick: (item: Item) => void;
}

const priorityConfig: Record<Priority, { label: string; borderColor: string; badgeClass: string; icon: typeof Bolt }> = {
  URGENT: {
    label: 'URGENTE',
    borderColor: 'border-l-red-500',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    icon: AlertTriangle,
  },
  HIGH: {
    label: 'ALTA',
    borderColor: 'border-l-orange-500',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    icon: Bolt,
  },
  MEDIUM: {
    label: 'MÉDIA',
    borderColor: 'border-l-yellow-400',
    badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    icon: ArrowUp,
  },
  LOW: {
    label: 'BAIXA',
    borderColor: 'border-l-green-500',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    icon: ArrowDown,
  },
};

const statusConfig: Record<ItemStatus, { label: string; dotColor: string; badgeClass: string }> = {
  TODO: {
    label: 'Pendente',
    dotColor: 'bg-gray-400',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  },
  IN_PROGRESS: {
    label: 'Em Progresso',
    dotColor: 'bg-blue-500',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  },
  REVIEW: {
    label: 'Revisão',
    dotColor: 'bg-purple-500',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  },
  DONE: {
    label: 'Concluído',
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

export function WorkListItem({ item, isPinned, onTogglePin, onClick }: WorkListItemProps) {
  const priority = priorityConfig[item.priority];
  const PriorityIcon = priority.icon;
  const status = statusConfig[item.status];
  const overdue = item.dueDate && isOverdue(item.dueDate) && item.status !== 'DONE';

  return (
    <div
      onClick={() => onClick(item)}
      className={`group flex cursor-pointer items-stretch gap-0 rounded-xl border border-gray-200 border-l-4 bg-white transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${priority.borderColor} ${overdue ? '!border-l-red-500' : ''}`}
    >
      <div className="flex flex-1 items-center gap-4 p-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${priority.badgeClass}`}>
          <PriorityIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {item.title}
          </h4>

          {item.description && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {item.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${priority.badgeClass}`}>
              {priority.label}
            </span>

            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dotColor}`} />
              {status.label}
            </span>

            {item.board && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <LayoutDashboard className="h-3 w-3" />
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.board.color ?? '#6b7280' }}
                />
                {item.board.name}
              </span>
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
                {overdue && <span className="font-semibold">• atrasado</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center border-l border-gray-100 px-3 opacity-0 transition-opacity group-hover:opacity-100 dark:border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(item.id);
          }}
          className={`rounded-lg p-2 transition-colors ${
            isPinned
              ? 'text-b2-600 hover:bg-b2-50 dark:text-b2-400 dark:hover:bg-b2-950/30'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          }`}
          title={isPinned ? 'Desafixar item' : 'Fixar item'}
        >
          {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
