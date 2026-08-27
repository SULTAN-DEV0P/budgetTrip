import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-amber-400/50';

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold',
  };

  const variantStyles = {
    primary: 'bg-amber-400 text-slate-950 hover:bg-amber-300 active:bg-amber-500 shadow-sm shadow-amber-950/20 font-semibold',
    gold: 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:brightness-105 active:brightness-95 font-semibold shadow-md',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-800/80 border border-slate-700/60',
    outline: 'bg-transparent text-slate-200 border border-slate-700 hover:bg-slate-800 hover:border-slate-600',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
