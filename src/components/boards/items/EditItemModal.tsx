import { useState, useEffect } from 'react';
import {
  X,
  Pencil,
  Type,
  AlignLeft,
  Flag,
  CircleDot,
  User,
  CalendarDays,
  Save,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useItemStore } from '@/stores/itemStore';
import { toast } from 'sonner';
import type { Item, Priority, ItemStatus, UpdateItemDto } from '@/types/item';
import type { User as UserType } from '@/types/user';

interface EditItemModalProps {
  open: boolean;
  item: Item | null;
  users?: UserType[];
  onClose: () => void;
}

const priorityOptions = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
];

const statusOptions = [
  { value: 'TODO', label: 'A Fazer' },
  { value: 'IN_PROGRESS', label: 'Em Progresso' },
  { value: 'REVIEW', label: 'Revisão' },
  { value: 'DONE', label: 'Concluído' },
];

export function EditItemModal({ open, item, users = [], onClose }: EditItemModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<ItemStatus>('TODO');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const updateItem = useItemStore((s) => s.updateItem);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description ?? '');
      setPriority(item.priority);
      setStatus(item.status);
      setAssigneeId(item.assigneeId ?? '');
      setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '');
    }
  }, [item]);

  if (!open || !item) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const dto: UpdateItemDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      };
      await updateItem(item!.id, dto);
      toast.success('Item atualizado com sucesso!');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar item';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const assigneeOptions = [
    { value: '', label: 'Nenhum' },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-50 text-b2-600 dark:bg-b2-500/10 dark:text-b2-400">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Editar Item
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Atualize as informações do item
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-6">
          {/* Título */}
          <Input
            id="item-title"
            label="Título"
            icon={<Type className="h-4 w-4" />}
            placeholder="Ex: Implementar login"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="item-description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Descrição
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-4 text-gray-400 dark:text-gray-500">
                <AlignLeft className="h-4 w-4" />
              </span>
              <textarea
                id="item-description"
                placeholder="Descreva o item em detalhes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-b2-500 focus:ring-4 focus:ring-b2-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-b2-500 dark:focus:ring-b2-500/10"
              />
            </div>
          </div>

          {/* Prioridade + Status */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="item-priority"
              label="Prioridade"
              icon={<Flag className="h-4 w-4" />}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              options={priorityOptions}
            />
            <Select
              id="item-status"
              label="Status"
              icon={<CircleDot className="h-4 w-4" />}
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              options={statusOptions}
            />
          </div>

          {/* Responsável */}
          {users.length > 0 && (
            <Select
              id="item-assignee"
              label="Responsável"
              icon={<User className="h-4 w-4" />}
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              options={assigneeOptions}
            />
          )}

          {/* Data de vencimento */}
          <Input
            id="item-dueDate"
            label="Data de vencimento"
            type="date"
            icon={<CalendarDays className="h-4 w-4" />}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <Button
              type="button"
              onClick={onClose}
              size="lg"
              className="w-auto bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading} size="lg" className="w-auto px-8">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
