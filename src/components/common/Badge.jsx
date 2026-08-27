import React from 'react';
import clsx from 'clsx';

export function Badge({
  children,
  variant = 'default',
  icon: Icon,
  selected = false,
  onClick,
  className = '',
}) {
  const isClickable = !!onClick;

  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 select-none';

  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    gold: 'bg-amber-400/10 text-amber-300 border border-amber-400/30',
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    danger: 'bg-red-500/10 text-red-300 border border-red-500/30',
    subtle: 'bg-slate-900/60 text-slate-400 border border-slate-800',
  };

  const selectedStyles = selected
    ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold shadow-sm'
    : isClickable
    ? 'hover:bg-slate-700/80 hover:text-white cursor-pointer'
    : '';

  return (
    <span
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={clsx(
        baseStyles,
        !selected && variantStyles[variant],
        selectedStyles,
        className
      )}
    >
      {Icon && <Icon className={clsx('w-3.5 h-3.5 shrink-0', selected ? 'text-slate-950' : 'text-current')} />}
      {children}
    </span>
  );
}
