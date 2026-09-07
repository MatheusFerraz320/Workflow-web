import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  inputSize?: 'default' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, inputSize = 'default', className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
              'placeholder:text-gray-400',
              'transition-all duration-200',
              'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
              'dark:focus:border-brand-500 dark:focus:ring-brand-500/10',
              inputSize === 'lg' ? 'px-4 py-3.5 text-base' : 'px-4 py-2.5 text-sm',
              icon && 'pl-11',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
