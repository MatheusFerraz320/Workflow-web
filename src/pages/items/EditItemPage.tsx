import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  CalendarDays,
  UserIcon,
  Bolt,
  CircleDot,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { useItemStore } from '@/stores/itemStore';
import { useBoardStore } from '@/stores/boardStore';
import { useUsers } from '@/hooks/useUsers';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Select } from '@/components/ui/Select';
import type { Priority, ItemStatus } from '@/types/item';

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

export function EditItemPage() {
  const { boardId, itemId } = useParams<{ boardId: string; itemId: string }>();
  const navigate = useNavigate();
  const { currentItem, fetchItem, updateItem, isLoading } = useItemStore();
  const { boards, fetchBoards } = useBoardStore();
  const { users } = useUsers();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<ItemStatus>('TODO');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (boards.length === 0) fetchBoards();
  }, [boards.length, fetchBoards]);

  useEffect(() => {
    if (itemId) fetchItem(itemId);
  }, [itemId, fetchItem]);

  useEffect(() => {
    const item = currentItem?.id === itemId ? currentItem : null;
    if (item && !loaded) {
      setTitle(item.title);
      setDescription(item.description ?? '');
      setPriority(item.priority);
      setStatus(item.status);
      setAssigneeId(item.assigneeId ?? '');
      setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '');
      setLoaded(true);
    }
  }, [currentItem, itemId, loaded]);

  if (isLoading && !loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  const item = currentItem?.id === itemId ? currentItem : null;

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Item não encontrado</p>
        <button
          onClick={() => navigate(`/boards/${boardId}`)}
          className="mt-4 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Voltar ao board
        </button>
      </div>
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    setIsSaving(true);
    try {
      await updateItem(item!.id, {
        title: title.trim(),
        description: description || undefined,
        priority,
        status,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      toast.success('Item atualizado com sucesso!');
      navigate(`/boards/${boardId}/items/${itemId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar item');
    } finally {
      setIsSaving(false);
    }
  }

  const userOptions = [
    { value: '', label: 'Nenhum' },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => navigate(`/boards/${boardId}/items/${itemId}`)}
        className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {board ? board.name : 'Voltar'}
      </button>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar Item</h1>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    placeholder="Título do item"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrição
                  </label>
                  <RichTextEditor
                    content={description}
                    onChange={setDescription}
                    placeholder="Descreva o item..."
                  />
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Properties sidebar */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Propriedades</h2>

            <div className="space-y-4">
              <Select
                label="Status"
                icon={<CircleDot className="h-4 w-4" />}
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                options={statusOptions}
              />

              <Select
                label="Prioridade"
                icon={<Bolt className="h-4 w-4" />}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                options={priorityOptions}
              />

              <Select
                label="Responsável"
                icon={<UserIcon className="h-4 w-4" />}
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                options={userOptions}
              />

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CalendarDays className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  Vencimento
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
              <button
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </button>
              <button
                onClick={() => navigate(`/boards/${boardId}/items/${itemId}`)}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
