import React from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  X,
} from 'lucide-react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, className, hover = false, padding = 'md', ...props }: CardProps) {
  const paddingMap = {
    none: '',
    sm: 'p-3 sm:p-3.5',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  return (
    <div
      className={cn(
        'card animate-fade-in',
        paddingMap[padding],
        hover && 'card-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color: 'orange' | 'green' | 'blue' | 'red' | 'yellow';
  className?: string;
}

const colorMap = {
  orange: {
    iconColor: '#ea580c',
    iconBg: 'rgba(234, 88, 12, 0.1)',
  },
  green: {
    iconColor: '#16a34a',
    iconBg: 'rgba(22, 163, 74, 0.1)',
  },
  blue: {
    iconColor: '#2563eb',
    iconBg: 'rgba(37, 99, 235, 0.1)',
  },
  red: {
    iconColor: '#dc2626',
    iconBg: 'rgba(220, 38, 38, 0.1)',
  },
  yellow: {
    iconColor: '#d97706',
    iconBg: 'rgba(217, 119, 6, 0.1)',
  },
};

export function SummaryCard({ title, value, subtitle, icon, trend, color, className }: SummaryCardProps) {
  const c = colorMap[color] || colorMap.orange;

  return (
    <div
      className={cn('card p-4 sm:p-4.5 relative overflow-hidden', className)}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: c.iconBg, color: c.iconColor }}
        >
          {icon}
        </div>
      </div>

      <div>
        <p className="text-lg sm:text-xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-slate-100 whitespace-nowrap">
          {value}
        </p>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-semibold px-1 py-0.5 rounded flex-shrink-0 leading-none',
                trend.value >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
              )}
            >
              {trend.value >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(trend.value)}%
            </span>
          )}
          {subtitle && (
            <span className="truncate font-normal text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
  className?: string;
}

const badgeVariants = {
  default: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
};

export function Badge({ children, variant = 'default', dot = true, className }: BadgeProps) {
  const v = badgeVariants[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
        v.bg,
        v.border,
        v.text,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', v.dot)} />}
      <span>{children}</span>
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[32px]',
    md: 'text-xs sm:text-sm px-3.5 py-2 min-h-[38px]',
    lg: 'text-sm sm:text-base px-4 py-2.5 min-h-[44px]',
  };

  const variants = {
    primary: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-xs',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700',
    outline: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-3 py-2 rounded-lg text-sm transition-colors min-h-[38px]',
          'border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
          'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600',
          error ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
      {helper && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-3 py-2 rounded-lg text-sm transition-colors min-h-[38px] cursor-pointer',
          'border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
          'border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export function Alert({ type, title, message, action, className }: AlertProps) {
  const styles = {
    info: {
      wrapper: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60',
      title: 'text-blue-900 dark:text-blue-200',
      icon: <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />,
    },
    success: {
      wrapper: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60',
      title: 'text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
    },
    warning: {
      wrapper: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60',
      title: 'text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />,
    },
    danger: {
      wrapper: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60',
      title: 'text-rose-900 dark:text-rose-200',
      icon: <AlertOctagon size={18} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />,
    },
  };

  const s = styles[type];

  return (
    <div
      className={cn('flex items-start sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border', s.wrapper, className)}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="mt-0.5 sm:mt-0">{s.icon}</div>
        <div className="min-w-0">
          <p className={cn('text-xs sm:text-sm font-semibold leading-tight', s.title)}>{title}</p>
          <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-300 leading-normal">{message}</p>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const widthMap = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'w-full rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl animate-scale-up',
          widthMap[maxWidth]
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            {description && <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400 font-normal">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
