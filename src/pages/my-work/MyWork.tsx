import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Loader2, Users, Pin, Layers, CircleCheck, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { useMyWorkStore } from '@/stores/myWorkStore';
import { WorkListItem } from '@/components/my-work/WorkListItem';
import type { Item, ItemStatus } from '@/types/item';
import { cn } from '@/lib/utils';

const filterTabs = [
  { value: 'all' as const, label: 'Todos', icon: Layers },
  { value: 'assigned' as const, label: 'Atribuídos', icon: Users },
  { value: 'pinned' as const, label: 'Fixados', icon: Pin },
];

const statusSummaryConfig: {
  status: ItemStatus;
  label: string;
  icon: typeof Clock;
  bgClass: string;
  textClass: string;
  dotClass: string;
}[] = [
  {
    status: 'TODO',
    label: 'Pendentes',
    icon: Clock,
    bgClass: 'bg-gray-50 dark:bg-gray-800/60',
    textClass: 'text-gray-600 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
  {
    status: 'IN_PROGRESS',
    label: 'Em Progresso',
    icon: Eye,
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    textClass: 'text-blue-600 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  {
    status: 'REVIEW',
    label: 'Revisão',
    icon: CircleCheck,
    bgClass: 'bg-purple-50 dark:bg-purple-950/30',
    textClass: 'text-purple-600 dark:text-purple-400',
    dotClass: 'bg-purple-500',
  },
  {
    status: 'DONE',
    label: 'Concluído',
    icon: CheckCircle2,
    bgClass: 'bg-green-50 dark:bg-green-950/30',
    textClass: 'text-green-600 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
];

const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function MyWork() {
  const navigate = useNavigate();
  const { assignedItems, pinnedItemIds, isLoading, filter, fetchMyWork, setFilter, togglePin } = useMyWorkStore();

  useEffect(() => {
    fetchMyWork();
  }, [fetchMyWork]);

  const displayItems = useMemo(() => {
    const pinnedSet = new Set(pinnedItemIds);

    let items: Item[];
    switch (filter) {
      case 'assigned':
        items = assignedItems;
        break;
      case 'pinned':
        items = assignedItems.filter((item) => pinnedSet.has(item.id));
        break;
      case 'all':
      default: {
        const merged = new Map<string, Item>();
        assignedItems.forEach((item) => merged.set(item.id, item));
        items = Array.from(merged.values());
        break;
      }
    }

    return [...items].sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;

      if (a.dueDate && b.dueDate)
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [assignedItems, pinnedItemIds, filter]);

  const statusCounts = useMemo(() => {
    const counts: Record<ItemStatus, number> = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, DONE: 0 };
    assignedItems.forEach((item) => {
      counts[item.status]++;
    });
    return counts;
  }, [assignedItems]);

  function handleClickItem(item: Item) {
    navigate(`/boards/${item.boardId}/items/${item.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
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
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
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
          <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
        </div>
      ) : assignedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 dark:border-gray-700">
          <Briefcase className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-base font-medium text-gray-500 dark:text-gray-400">
            Nenhum item atribuído a você
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Quando itens forem atribuídos a você, eles aparecerão aqui
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statusSummaryConfig.map((cfg) => {
              const Icon = cfg.icon;
              const count = statusCounts[cfg.status];
              return (
                <div
                  key={cfg.status}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700',
                    cfg.bgClass,
                  )}
                >
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', cfg.bgClass)}>
                    <Icon className={cn('h-5 w-5', cfg.textClass)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                    <p className={cn('text-xs font-medium', cfg.textClass)}>{cfg.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flat List */}
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 dark:border-gray-700">
              <Briefcase className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                {filter === 'pinned' ? 'Nenhum item fixado' : 'Nenhum item para exibir'}
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                {filter === 'pinned'
                  ? 'Fixe itens dos boards para acompanhá-los aqui'
                  : 'Tente ajustar os filtros'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayItems.map((item) => (
                <WorkListItem
                  key={item.id}
                  item={item}
                  isPinned={pinnedItemIds.includes(item.id)}
                  onTogglePin={togglePin}
                  onClick={handleClickItem}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
