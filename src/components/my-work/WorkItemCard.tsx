import { Pin, PinOff, Calendar, AlertTriangle, Bolt, ArrowUp, ArrowDown, LayoutDashboard } from 'lucide-react';
import type { Item, Priority } from '@/types/item';

interface WorkItemCardProps {
  item: Item;
  boardName?: string;
  boardColor?: string;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function WorkItemCard({ item, boardName, boardColor, isPinned, onTogglePin, onClick }: WorkItemCardProps) {
  const priority = priorityConfig[item.priority];
  const PriorityIcon = priority.icon;
  const overdue = item.dueDate && isOverdue(item.dueDate) && item.status !== 'DONE';

  return (
    <div
      onClick={() => onClick(item)}
      className={`group flex cursor-pointer items-stretch gap-0 rounded-lg border border-gray-200 border-l-4 bg-white transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${priority.borderColor}`}
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
            <div
              className="tiptap mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${priority.badgeClass}`}>
              {priority.label}
            </span>

            {boardName && (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: boardColor ?? '#6b7280' }}
                />
                {boardName}
              </span>
            )}

            {item.assignee && (
              <div className="flex items-center gap-1.5">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                  title={item.assignee.name}
                >
                  {item.assignee.name
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.assignee.name.split(' ')[0]}
                </span>
              </div>
            )}

            {item.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 text-sm ${
                  overdue
                    ? 'font-semibold text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(item.dueDate)}
                {overdue && <span className="text-xs">atrasado</span>}
              </span>
            )}

          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center border-l border-gray-100 px-3 opacity-60 transition-opacity group-hover:opacity-100 dark:border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(item.id);
          }}
          className={`rounded-lg p-2 transition-colors ${
            isPinned
              ? 'text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/30'
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
