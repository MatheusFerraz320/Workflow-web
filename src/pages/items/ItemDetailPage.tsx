import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  AlignLeft,
  Send,
  Loader2,
  AlertTriangle,
  Bolt,
  ArrowUp,
  ArrowDown,
  CircleDot,
  User as UserIcon,
  CalendarDays,
  Flag,
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useItemStore } from '@/stores/itemStore';
import { useBoardStore } from '@/stores/boardStore';
import { useAuthStore } from '@/stores/authStore';
import { useUsers } from '@/hooks/useUsers';
import { Select } from '@/components/ui/Select';
import { EditItemModal } from '@/components/boards/items';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import type { Priority, ItemStatus } from '@/types/item';

const priorityConfig: Record<Priority, { label: string; icon: typeof Bolt }> = {
  LOW: { label: 'Baixa', icon: ArrowDown },
  MEDIUM: { label: 'Média', icon: ArrowUp },
  HIGH: { label: 'Alta', icon: Bolt },
  URGENT: { label: 'Urgente', icon: AlertTriangle },
};

const statusConfig: Record<ItemStatus, { label: string; dot: string; bgClass: string }> = {
  TODO: { label: 'A Fazer', dot: 'bg-gray-500', bgClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  IN_PROGRESS: { label: 'Em Progresso', dot: 'bg-blue-500', bgClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' },
  REVIEW: { label: 'Revisão', dot: 'bg-purple-500', bgClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' },
  DONE: { label: 'Concluído', dot: 'bg-green-500', bgClass: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' },
};

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

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function ItemDetailPage() {
  const { boardId, itemId } = useParams<{ boardId: string; itemId: string }>();
  const navigate = useNavigate();
  const { currentItem, fetchItem, createComment, deleteComment, updateItem, deleteItem, isLoading } = useItemStore();
  const { boards, fetchBoards } = useBoardStore();
  const user = useAuthStore((s) => s.user);
  const { users } = useUsers();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (boards.length === 0) {
      fetchBoards();
    }
  }, [boards.length, fetchBoards]);

  useEffect(() => {
    if (itemId) {
      fetchItem(itemId);
    }
  }, [itemId, fetchItem]);

  const item = currentItem?.id === itemId ? currentItem : null;

  if (isLoading && !item) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-b2-600 dark:text-b2-400" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Item não encontrado</p>
        <button
          onClick={() => navigate(`/boards/${boardId}`)}
          className="mt-4 text-sm text-b2-600 hover:text-b2-700 dark:text-b2-400"
        >
          Voltar ao board
        </button>
      </div>
    );
  }

  const priority = priorityConfig[item.priority];
  const status = statusConfig[item.status];
  const PriorityIcon = priority.icon;
  const overdue = item.dueDate && isOverdue(item.dueDate) && item.status !== 'DONE';
  const commentCount = item.comments?.length ?? 0;

  const assigneeOptions = [
    { value: '', label: 'Nenhum' },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  async function handleCreateComment() {
    const stripped = commentText.replace(/<[^>]*>/g, '').trim();
    if (!stripped || !itemId) return;
    setIsSubmitting(true);
    try {
      await createComment({ content: commentText.trim(), itemId });
      setCommentText('');
      toast.success('Comentário enviado!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar comentário';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Deseja excluir este comentário?')) return;
    try {
      await deleteComment(commentId);
      toast.success('Comentário excluído!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir comentário';
      toast.error(message);
    }
  }

  async function handleFieldUpdate(field: string, value: string | undefined) {
    if (!item) return;
    try {
      await updateItem(item.id, { [field]: value });
      toast.success('Item atualizado!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar item');
    }
  }

  async function handleDeleteItem() {
    if (!confirm(`Deseja excluir o item "${item.title}"?`)) return;
    try {
      await deleteItem(item.id);
      toast.success('Item excluído!');
      navigate(`/boards/${boardId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir item');
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb + Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate(`/boards/${boardId}`)}
            className="flex items-center gap-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {board?.name ?? 'Board'}
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
            {item.title}
          </span>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setEditModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Pencil className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  Editar item
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  Adicionar comentário
                </button>
                <div className="border-t border-gray-100 dark:border-gray-800" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleDeleteItem();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir item
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left — Content */}
        <div className="min-w-0 flex-1 space-y-5">
          {/* Title + Type Badge */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-b2-50 px-2.5 py-1 text-xs font-semibold text-b2-700 dark:bg-b2-950/30 dark:text-b2-400">
                <FileText className="h-3.5 w-3.5" />
                Tarefa
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bgClass}`}>
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              {item.title}
            </h1>
          </div>

          {/* Context Section */}
          {item.description && (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-800">
                <AlignLeft className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Contexto
                </h3>
              </div>
              <div className="px-5 py-4">
                <RichTextEditor
                  content={item.description}
                  editable={false}
                />
              </div>
            </div>

            <div className="mx-5 mt-4 flex items-center gap-1 border-t border-gray-100 pt-3 sm:mx-6 dark:border-gray-800">
              <button
                onClick={() => commentInputRef.current?.focus()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <MessageSquare className="h-4 w-4" />
                Comentar{commentCount > 0 && ` (${commentCount})`}
              </button>
              <button
                onClick={() => navigate(`/boards/${boardId}/items/${itemId}/edit`)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>

            {/* Comment Input */}
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="flex gap-3">
                {user && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-b2-100 text-xs font-bold text-b2-700 dark:bg-b2-900/30 dark:text-b2-400">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1">
                  <RichTextEditor
                    content={commentText}
                    onChange={setCommentText}
                    placeholder="Adicione uma atualização..."
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleCreateComment}
                      disabled={!commentText.replace(/<[^>]*>/g, '').trim() || isSubmitting}
                      className="flex items-center gap-2 rounded-lg bg-b2-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-b2-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {item.comments && item.comments.length > 0 ? (
              <div className="px-5 py-4">
                {item.comments.map((comment, index) => (
                  <div key={comment.id} className="relative flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        {getInitials(comment.author.name)}
                      </div>
                      {index < (item.comments?.length ?? 0) - 1 && (
                        <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>

                    {/* Comment content */}
                    <div className={`min-w-0 flex-1 pb-5 ${index === (item.comments?.length ?? 0) - 1 ? 'pb-0' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {comment.author.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(comment.createdAt)}
                        </span>
                        {user?.id === comment.authorId && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="ml-auto rounded p-1 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            title="Excluir comentário"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div
                        className="tiptap mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Nenhum comentário ainda
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Seja o primeiro a comentar
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — Properties Sidebar */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <Flag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Propriedades
              </h3>
            </div>

            <div className="space-y-4 p-5">
              <Select
                id="detail-status"
                label="Status"
                icon={<CircleDot className="h-4 w-4" />}
                value={item.status}
                onChange={(e) => handleFieldUpdate('status', e.target.value)}
                options={statusOptions}
              />

              <Select
                id="detail-assignee"
                label="Responsável"
                icon={<UserIcon className="h-4 w-4" />}
                value={item.assigneeId ?? ''}
                onChange={(e) => handleFieldUpdate('assigneeId', e.target.value || undefined)}
                options={assigneeOptions}
              />

              <Select
                id="detail-priority"
                label="Prioridade"
                icon={<PriorityIcon className="h-4 w-4" />}
                value={item.priority}
                onChange={(e) => handleFieldUpdate('priority', e.target.value)}
                options={priorityOptions}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vencimento
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <input
                    type="date"
                    value={item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFieldUpdate('dueDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 transition-all duration-200 focus:border-b2-500 focus:ring-4 focus:ring-b2-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-b2-500 dark:focus:ring-b2-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Criado em</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Atualizado em</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {formatDateTime(item.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <EditItemModal
        open={editModalOpen}
        item={item}
        users={users}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
