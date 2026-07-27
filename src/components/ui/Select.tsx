import { type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  icon,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
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
        <select
          id={id}
          className={cn(
            'w-full appearance-none rounded-xl border border-gray-200 bg-white text-gray-900',
            'transition-all duration-200',
            'focus:border-b2-500 focus:ring-4 focus:ring-b2-500/10 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
            'dark:focus:border-b2-500 dark:focus:ring-b2-500/10',
            'px-4 py-2.5 pr-10 text-sm',
            icon && 'pl-11',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
