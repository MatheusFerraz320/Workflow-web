import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Trash2,
  MessageSquare,
  Send,
  Loader2,
  AlertTriangle,
  Bolt,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { useItemStore } from '@/stores/itemStore';
import { useBoardStore } from '@/stores/boardStore';
import { useAuthStore } from '@/stores/authStore';
import type { Priority, ItemStatus } from '@/types/item';

const priorityConfig: Record<Priority, { label: string; className: string; icon: typeof Bolt }> = {
  LOW: { label: 'Baixa', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: ArrowDown },
  MEDIUM: { label: 'Média', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: ArrowUp },
  HIGH: { label: 'Alta', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Bolt },
  URGENT: { label: 'Urgente', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
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
  const { currentItem, fetchItem, createComment, deleteComment, isLoading } = useItemStore();
  const { boards, fetchBoards } = useBoardStore();
  const user = useAuthStore((s) => s.user);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

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
  const author = item.assignee;

  async function handleCreateComment() {
    if (!commentText.trim() || !itemId) return;
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

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(`/boards/${boardId}`)}
        className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {board ? board.name : 'Voltar'}
      </button>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="p-5 pb-0 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-b2-100 text-sm font-bold text-b2-700 dark:bg-b2-900/30 dark:text-b2-400">
                {author ? getInitials(author.name) : '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {author ? author.name : 'Sem responsável'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {board?.name} · {formatDateTime(item.createdAt)}
                </p>
              </div>
            </div>
            <button className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-6">
          <h1 className="mt-4 text-xl font-bold leading-snug text-gray-900 dark:text-gray-100 sm:text-2xl">
            {item.title}
          </h1>

          {item.description && (
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              {item.description}
            </p>
          )}
        </div>

        <div className="px-5 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${priority.className}`}>
              <PriorityIcon className="h-3.5 w-3.5" />
              {priority.label}
            </span>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
              {status.label}
            </span>
            {item.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  overdue
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(item.dueDate)}
                {overdue && ' · atrasado'}
              </span>
            )}
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
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
            <Pencil className="h-4 w-4" />
            Editar
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </article>

      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="p-5 sm:p-6">
          <div className="flex gap-3">
            {user && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-b2-100 text-xs font-bold text-b2-700 dark:bg-b2-900/30 dark:text-b2-400">
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex-1">
              <textarea
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateComment();
                  }
                }}
                placeholder="Escreva um comentário..."
                rows={2}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleCreateComment}
                  disabled={!commentText.trim() || isSubmitting}
                  className="flex items-center gap-2 rounded-full bg-b2-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-b2-700 disabled:cursor-not-allowed disabled:opacity-50"
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

        {item.comments && item.comments.length > 0 ? (
          <div className="border-t border-gray-100 dark:border-gray-800">
            {item.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 border-b border-gray-50 p-5 last:border-b-0 sm:px-6 dark:border-gray-800/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {getInitials(comment.author.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDateTime(comment.createdAt)}
                    </span>
                    <div className="flex-1" />
                    {user?.id === comment.authorId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        title="Excluir comentário"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-gray-100 px-5 py-8 text-center dark:border-gray-800">
            <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Nenhum comentário ainda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
