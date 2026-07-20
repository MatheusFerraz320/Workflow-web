import { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({ children, loading, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
        'bg-b2-600 text-sm font-medium text-white',
        'hover:bg-b2-700 transition-colors',
        'focus:ring-2 focus:ring-b2-500/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}


