import { useEffect, useState } from 'react';
import { X, Calendar, User, Pencil, Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useItemStore } from '@/stores/itemStore';
import type { Item, Priority, ItemStatus } from '@/types/item';

interface ItemDetailModalProps {
  open: boolean;
  itemId: string | null;
  onClose: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: { label: 'Baixa', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  MEDIUM: { label: 'Média', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  HIGH: { label: 'Alta', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  URGENT: { label: 'Urgente', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const statusConfig: Record<ItemStatus, { label: string; className: string }> = {
  TODO: { label: 'A Fazer', className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  IN_PROGRESS: { label: 'Em Progresso', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  REVIEW: { label: 'Revisão', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  DONE: { label: 'Concluído', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ItemDetailModal({ open, itemId, onClose, onEdit, onDelete }: ItemDetailModalProps) {
  const { currentItem, fetchItem, isLoading } = useItemStore();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (open && itemId) {
      fetchItem(itemId).then(() => {
        const state = useItemStore.getState();
        setItem(state.currentItem);
      });
    }
  }, [open, itemId, fetchItem]);

  useEffect(() => {
    if (currentItem) {
      setItem(currentItem);
    }
  }, [currentItem]);

  if (!open || !itemId) return null;

  if (isLoading || !item) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div
          className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-b2-600 border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  const priority = priorityConfig[item.priority];
  const status = statusConfig[item.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="flex-1 pr-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {item.title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priority.className}`}>
            {priority.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
          {item.dueDate && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(item.dueDate)}
            </span>
          )}
        </div>

        {item.description && (
          <div className="mb-4">
            <h3 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{item.description}</p>
          </div>
        )}

        {item.assignee && (
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.assignee.name}</span>
          </div>
        )}

        {item.subtasks && item.subtasks.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Subtarefas ({item.subtasks.filter((s) => s.completed).length}/{item.subtasks.length})
            </h3>
            <div className="space-y-1.5">
              {item.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  {subtask.completed ? (
                    <CheckSquare className="h-4 w-4 text-green-500" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  )}
                  <span
                    className={`text-sm ${
                      subtask.completed
                        ? 'text-gray-400 line-through dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            type="button"
            onClick={() => {
              onEdit(item);
            }}
            className="w-auto bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            type="button"
            onClick={() => {
              onDelete(item);
            }}
            className="w-auto bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
