import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Loader2, Users, Pin, Layers } from 'lucide-react';
import { useMyWorkStore } from '@/stores/myWorkStore';
import { useBoardStore } from '@/stores/boardStore';
import { WorkColumn } from '@/components/my-work/WorkColumn';
import type { Item, ItemStatus } from '@/types/item';
import { cn } from '@/lib/utils';

const columns: { status: ItemStatus; label: string; dotColor: string; headerBg: string; headerText: string }[] = [
  { status: 'TODO', label: 'Pendentes', dotColor: 'bg-gray-500', headerBg: 'bg-gray-50 dark:bg-gray-800', headerText: 'text-gray-700 dark:text-gray-300' },
  { status: 'IN_PROGRESS', label: 'Em Progresso', dotColor: 'bg-blue-500', headerBg: 'bg-blue-50 dark:bg-blue-950/30', headerText: 'text-blue-700 dark:text-blue-300' },
  { status: 'REVIEW', label: 'Revisão', dotColor: 'bg-purple-500', headerBg: 'bg-purple-50 dark:bg-purple-950/30', headerText: 'text-purple-700 dark:text-purple-300' },
  { status: 'DONE', label: 'Concluído', dotColor: 'bg-green-500', headerBg: 'bg-green-50 dark:bg-green-950/30', headerText: 'text-green-700 dark:text-green-300' },
];

const filterTabs = [
  { value: 'all' as const, label: 'Todos', icon: Layers },
  { value: 'assigned' as const, label: 'Atribuídos', icon: Users },
  { value: 'pinned' as const, label: 'Fixados', icon: Pin },
];

export function MyWork() {
  const navigate = useNavigate();
  const { assignedItems, pinnedItemIds, isLoading, filter, fetchMyWork, setFilter, togglePin } = useMyWorkStore();
  const { boards, fetchBoards } = useBoardStore();

  useEffect(() => {
    fetchMyWork();
    if (boards.length === 0) {
      fetchBoards();
    }
  }, [fetchMyWork, fetchBoards, boards.length]);

  const displayItems = useMemo(() => {
    const pinnedSet = new Set(pinnedItemIds);

    switch (filter) {
      case 'assigned':
        return assignedItems;
      case 'pinned':
        return assignedItems.filter((item) => pinnedSet.has(item.id));
      case 'all':
      default: {
        const merged = new Map<string, Item>();
        assignedItems.forEach((item) => merged.set(item.id, item));
        return Array.from(merged.values());
      }
    }
  }, [assignedItems, pinnedItemIds, filter]);

  const itemsByStatus = useMemo(() => {
    const acc: Record<ItemStatus, Item[]> = { TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: [] };
    displayItems.forEach((item) => {
      acc[item.status].push(item);
    });
    return acc;
  }, [displayItems]);

  function handleClickItem(item: Item) {
    navigate(`/boards/${item.boardId}/items/${item.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-b2-50 text-b2-600 dark:bg-b2-500/10 dark:text-b2-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Meu Trabalho</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Itens atribuídos a você e itens que você fixou
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-b2-600 text-white shadow-lg shadow-b2-600/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.value === 'pinned' && pinnedItemIds.length > 0 && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
                  )}
                >
                  {pinnedItemIds.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
        </div>
      ) : displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 dark:border-gray-700">
          <Briefcase className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-base font-medium text-gray-500 dark:text-gray-400">
            {filter === 'pinned'
              ? 'Nenhum item fixado'
              : filter === 'assigned'
                ? 'Nenhum item atribuído a você'
                : 'Nenhum item para exibir'}
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            {filter === 'pinned'
              ? 'Fixe itens dos boards para acompanhá-los aqui'
              : 'Quando itens forem atribuídos a você, eles aparecerão aqui'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {columns.map((col) => (
            <WorkColumn
              key={col.status}
              status={col.status}
              label={col.label}
              dotColor={col.dotColor}
              headerBg={col.headerBg}
              headerText={col.headerText}
              items={itemsByStatus[col.status]}
              boards={boards}
              pinnedItemIds={pinnedItemIds}
              onTogglePin={togglePin}
              onClickItem={handleClickItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
