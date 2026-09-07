import { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  loading?: boolean;
  size?: 'default' | 'lg';
}

export function Button({ children, loading, size = 'default', className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl font-semibold',
        'bg-gradient-to-r from-brand-600 to-brand-700 text-white',
        'shadow-lg shadow-brand-600/25',
        'transition-all duration-200',
        'hover:from-brand-700 hover:to-brand-800 hover:shadow-xl hover:shadow-brand-600/30',
        'active:scale-[0.98]',
        'focus:ring-4 focus:ring-brand-500/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100',
        size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2.5 text-sm',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
}
