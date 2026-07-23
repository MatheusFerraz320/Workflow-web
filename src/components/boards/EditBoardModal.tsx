import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useBoardStore } from '@/stores/boardStore';
import { toast } from 'sonner';
import type { Board } from '@/types/board';

const colorOptions = [
  { value: '#6C63FF', label: 'Roxo' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#22c55e', label: 'Verde' },
  { value: '#f59e0b', label: 'Amarelo' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#ef4444', label: 'Vermelho' },
];

interface EditBoardModalProps {
  open: boolean;
  board: Board | null;
  onClose: () => void;
}

export function EditBoardModal({ open, board, onClose }: EditBoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6C63FF');
  const [loading, setLoading] = useState(false);
  const updateBoard = useBoardStore((s) => s.updateBoard);

  useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description ?? '');
      setColor(board.color);
    }
  }, [board]);

  if (!open || !board) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await updateBoard(board!.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      });
      toast.success('Quadro atualizado com sucesso!');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar board';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Editar Board</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="board-name"
            label="Nome"
            placeholder="Ex: Tráfego Pago"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              placeholder="Opcional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-b2-500 focus:ring-2 focus:ring-b2-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-b2-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor</label>
            <div className="flex gap-2">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === opt.value
                      ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: opt.value }}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} className="w-auto bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="w-auto px-6">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
