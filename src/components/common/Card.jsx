import React from 'react';
import clsx from 'clsx';

export function Card({
  children,
  variant = 'default',
  selected = false,
  onClick,
  className = '',
  ...props
}) {
  const isClickable = !!onClick;

  const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';

  const variantStyles = {
    default: 'bg-slate-900/90 border border-slate-800/80 text-slate-100 shadow-sm',
    surface: 'bg-slate-900 border border-slate-800 text-slate-100',
    flat: 'bg-slate-950/60 border border-slate-800/50 text-slate-200',
    highlight: 'bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 text-slate-100',
  };

  const interactiveStyles = isClickable
    ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-800/60 active:scale-[0.99]'
    : '';

  const selectedStyles = selected
    ? '!border-amber-400 !bg-slate-800/90 ring-1 ring-amber-400/50'
    : '';

  return (
    <div
      onClick={onClick}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        interactiveStyles,
        selectedStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
