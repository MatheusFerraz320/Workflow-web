import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AlertDialog({
  open,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full max-w-sm mx-4 overflow-hidden rounded-2xl border bg-white shadow-2xl',
          'border-gray-200 dark:border-gray-700 dark:bg-gray-900',
          'animate-in fade-in zoom-in-95 duration-200',
        )}
      >
        <div className="p-6 text-center">
          <div
            className={cn(
              'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
              variant === 'danger'
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-gray-100 dark:bg-gray-800',
            )}
          >
            {variant === 'danger' ? (
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <button
            onClick={onCancel}
            disabled={loading}
            className={cn(
              'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
              'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              'disabled:opacity-50',
            )}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors',
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                : 'bg-b2-600 hover:bg-b2-700 active:bg-b2-800',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {loading ? 'Excluindo...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
