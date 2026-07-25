import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, LayoutDashboard, Plus, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useBoardStore } from '@/stores/boardStore';
import { useItemStore } from '@/stores/itemStore';
import { useUsers } from '@/hooks/useUsers';
import { ItemCard, CreateItemModal, EditItemModal } from '@/components/boards/items';
import type { Board } from '@/types/board';
import type { Item, ItemStatus, Priority } from '@/types/item';

const columns: { status: ItemStatus; label: string; dotColor: string; headerBg: string; headerText: string }[] = [
  { status: 'TODO', label: 'Pendentes', dotColor: 'bg-gray-500', headerBg: 'bg-gray-50 dark:bg-gray-800', headerText: 'text-gray-700 dark:text-gray-300' },
  { status: 'IN_PROGRESS', label: 'Em Progresso', dotColor: 'bg-blue-500', headerBg: 'bg-blue-50 dark:bg-blue-950/30', headerText: 'text-blue-700 dark:text-blue-300' },
  { status: 'REVIEW', label: 'Revisão', dotColor: 'bg-purple-500', headerBg: 'bg-purple-50 dark:bg-purple-950/30', headerText: 'text-purple-700 dark:text-purple-300' },
  { status: 'DONE', label: 'Concluído', dotColor: 'bg-green-500', headerBg: 'bg-green-50 dark:bg-green-950/30', headerText: 'text-green-700 dark:text-green-300' },
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
  const [editItem, setEditItem] = useState<Item | null>(null);

  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState<string | 'ALL'>('ALL');
  const [expandedSections, setExpandedSections] = useState<Record<ItemStatus, boolean>>({
    TODO: true,
    IN_PROGRESS: true,
    REVIEW: false,
    DONE: false,
  });

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
    if (!confirm(`Deseja excluir o item "${item.title}"?`)) return;
    try {
      await deleteItem(item.id);
      toast.success('Item excluído com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir item';
      toast.error(message);
    }
  }

  const isLoading = boardsLoading || itemsLoading;

  if (isLoading && !board) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
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
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: board.color }} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{board.name}</h1>
          </div>
          <button
            onClick={() => openCreateForStatus('TODO')}
            className="flex items-center gap-2 rounded-lg bg-b2-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-b2-700"
          >
            <Plus className="h-4 w-4" />
            Novo Item
          </button>
        </div>
        {board.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{board.description}</p>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'ALL')}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Prioridade: {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="ALL">Responsável: Todos</option>
            {uniqueAssignees.map((a) => (
              <option key={a.id} value={a.id}>
                Responsável: {a.name.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {columns.map((col) => {
          const items = itemsByStatus[col.status];
          const isExpanded = expandedSections[col.status];

          return (
            <div
              key={col.status}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
            >
              <button
                onClick={() => toggleSection(col.status)}
                className={`flex w-full items-center gap-3 px-5 py-4 transition-colors hover:brightness-95 ${col.headerBg}`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
                )}

                <span className={`h-3 w-3 shrink-0 rounded-full ${col.dotColor}`} />

                <h2 className={`text-lg font-bold ${col.headerText}`}>{col.label}</h2>

                <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {items.length}
                </span>

                <div className="flex-1" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCreateForStatus(col.status);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-white dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700/50">
                  {itemsLoading ? (
                    <div className="space-y-2 py-2">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 rounded-lg bg-gray-100 dark:bg-gray-700/50 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : items.length > 0 ? (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onClick={(i) => navigate(`/boards/${board.id}/items/${i.id}`)}
                          onEdit={setEditItem}
                          onDelete={handleDeleteItem}
                        />
                      ))}
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
        })}
      </div>

      <CreateItemModal
        open={createOpen}
        boardId={board.id}
        initialStatus={createStatus}
        users={users}
        onClose={() => setCreateOpen(false)}
      />

      <EditItemModal
        open={!!editItem}
        item={editItem}
        users={users}
        onClose={() => setEditItem(null)}
      />
    </div>
  );
}
