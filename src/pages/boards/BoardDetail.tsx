import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, LayoutDashboard, Plus, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useBoardStore } from '@/stores/boardStore';
import { useItemStore } from '@/stores/itemStore';
import { useUsers } from '@/hooks/useUsers';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { ItemCard, CreateItemModal } from '@/components/boards/items';
import type { Board } from '@/types/board';
import type { Item, ItemStatus, Priority } from '@/types/item';

const columns: { status: ItemStatus; label: string; accentClass: string; dotColor: string }[] = [
  { status: 'TODO', label: 'Pendentes', accentClass: 'text-gray-600 dark:text-gray-400', dotColor: 'bg-gray-400' },
  { status: 'IN_PROGRESS', label: 'Em Progresso', accentClass: 'text-blue-600 dark:text-blue-400', dotColor: 'bg-blue-500' },
  { status: 'REVIEW', label: 'Revisão', accentClass: 'text-purple-600 dark:text-purple-400', dotColor: 'bg-purple-500' },
  { status: 'DONE', label: 'Concluído', accentClass: 'text-green-600 dark:text-green-400', dotColor: 'bg-green-500' },
];

const priorityOptions: { value: Priority | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
];

export function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, fetchBoards, isLoading: boardsLoading } = useBoardStore();
  const { itemsByBoard, fetchItemsByBoard, deleteItem, isLoading: itemsLoading } = useItemStore();
  const { users } = useUsers();
  const [board, setBoard] = useState<Board | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<ItemStatus>('TODO');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState<string | 'ALL'>('ALL');
  const [expandedSections, setExpandedSections] = useState<Record<ItemStatus, boolean>>({
    TODO: true,
    IN_PROGRESS: true,
    REVIEW: false,
    DONE: false,
  });
  const alertDialog = useAlertDialog();

  useEffect(() => {
    if (boards.length === 0) {
      fetchBoards();
    }
  }, [boards.length, fetchBoards]);

  useEffect(() => {
    if (boards.length > 0 && id) {
      const found = boards.find((b) => b.id === id) ?? null;
      setBoard(found);
      if (found) {
        fetchItemsByBoard(found.id);
      }
    }
  }, [boards, id, fetchItemsByBoard]);

  const uniqueAssignees = useMemo(() => {
    const map = new Map<string, string>();
    itemsByBoard.forEach((item) => {
      if (item.assignee) {
        map.set(item.assignee.id, item.assignee.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [itemsByBoard]);

  const filteredItems = useMemo(() => {
    return itemsByBoard.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === 'ALL' || item.priority === filterPriority;
      const matchAssignee = filterAssignee === 'ALL' || item.assigneeId === filterAssignee;
      return matchSearch && matchPriority && matchAssignee;
    });
  }, [itemsByBoard, search, filterPriority, filterAssignee]);

  const itemsByStatus = useMemo(() => {
    const acc: Record<ItemStatus, Item[]> = { TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: [] };
    filteredItems.forEach((item) => {
      acc[item.status].push(item);
    });
    return acc;
  }, [filteredItems]);

  function toggleSection(status: ItemStatus) {
    setExpandedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  }

  function openCreateForStatus(status: ItemStatus) {
    setCreateStatus(status);
    setCreateOpen(true);
  }

  async function handleDeleteItem(item: Item) {
    alertDialog.confirm({
      title: `Excluir item "${item.title}"?`,
      description: 'Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          await deleteItem(item.id);
          toast.success('Item excluído com sucesso!');
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erro ao excluir item';
          toast.error(message);
        }
      },
    });
  }

  const isLoading = boardsLoading || itemsLoading;

  if (isLoading && !board) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LayoutDashboard className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Board não encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="h-1.5 w-full" style={{ backgroundColor: board.color }} />
        <div className="p-6 sm:p-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: board.color }} />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{board.name}</h1>
              </div>
              {board.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {board.description}
                </p>
              )}
            </div>

            <button
              onClick={() => openCreateForStatus('TODO')}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Novo Item
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'ALL')}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value="ALL">Todos</option>
            {uniqueAssignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {columns.map((col) => {
          const items = itemsByStatus[col.status];
          const isExpanded = expandedSections[col.status];

          return (
            <div key={col.status} className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(col.status)}
                className="flex w-full items-center gap-3 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                )}

                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${col.dotColor}`} />

                <h2 className={`text-base font-bold ${col.accentClass}`}>{col.label}</h2>

                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {items.length}
                </span>

                <div className="flex-1" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCreateForStatus(col.status);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              </button>

              {/* Section Body */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-700/50">
                  {itemsLoading ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                        />
                      ))}
                    </div>
                  ) : items.length > 0 ? (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onClick={(i) => navigate(`/boards/${board.id}/items/${i.id}`)}
                          onEdit={(i) => navigate(`/boards/${board.id}/items/${i.id}/edit`)}
                          onDelete={handleDeleteItem}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <LayoutDashboard className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhum item aqui
                      </p>
                      <button
                        onClick={() => openCreateForStatus(col.status)}
                        className="mt-2 text-sm text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
                      >
                        Criar primeiro item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CreateItemModal
        open={createOpen}
        boardId={board.id}
        initialStatus={createStatus}
        users={users}
        onClose={() => setCreateOpen(false)}
      />

      <AlertDialog
        open={alertDialog.open}
        title={alertDialog.title}
        description={alertDialog.description}
        onConfirm={alertDialog.onConfirm}
        onCancel={alertDialog.cancel}
      />
    </div>
  );
}
