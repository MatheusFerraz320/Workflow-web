import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { WorkItemCard } from './WorkItemCard';
import type { Item, ItemStatus } from '@/types/item';
import type { Board } from '@/types/board';

interface WorkColumnProps {
  status: ItemStatus;
  label: string;
  dotColor: string;
  headerBg: string;
  headerText: string;
  items: Item[];
  boards: Board[];
  pinnedItemIds: string[];
  onTogglePin: (itemId: string) => void;
  onClickItem: (item: Item) => void;
}

export function WorkColumn({
  status,
  label,
  dotColor,
  headerBg,
  headerText,
  items,
  boards,
  pinnedItemIds,
  onTogglePin,
  onClickItem,
}: WorkColumnProps) {
  const [expanded, setExpanded] = useState(status !== 'DONE');

  const boardMap = new Map(boards.map((b) => [b.id, b]));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center gap-3 px-5 py-4 transition-colors hover:brightness-95 ${headerBg}`}
      >
        {expanded ? (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
        )}

        <span className={`h-3 w-3 shrink-0 rounded-full ${dotColor}`} />

        <h2 className={`text-lg font-bold ${headerText}`}>{label}</h2>

        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {items.length}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700/50">
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item) => {
                const board = boardMap.get(item.boardId);
                return (
                  <WorkItemCard
                    key={item.id}
                    item={item}
                    boardName={board?.name}
                    boardColor={board?.color}
                    isPinned={pinnedItemIds.includes(item.id)}
                    onTogglePin={onTogglePin}
                    onClick={onClickItem}
                  />
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              Nenhum item nesta seção
            </p>
          )}
        </div>
      )}
    </div>
  );
}
