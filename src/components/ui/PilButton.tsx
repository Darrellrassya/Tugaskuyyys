import React from 'react';
import { cn } from '../../lib/utils';

export interface PilButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'next';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const PilButton = React.forwardRef<HTMLButtonElement, PilButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full';

    const sizeStyles = {
      sm: 'px-4 py-1.5 text-xs font-mono font-medium',
      md: 'px-6 py-2.5 text-sm font-mono font-medium',
      lg: 'px-8 py-3.5 text-base font-mono font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-map-kuning text-arsip hover:brightness-105 active:scale-[0.98] shadow-sm font-bold border border-yellow-400',
      secondary:
        'border-2 border-tinta/40 text-tinta bg-transparent hover:border-tinta hover:bg-tinta/10 active:scale-[0.98]',
      danger:
        'bg-map-merah text-white hover:brightness-110 active:scale-[0.98] shadow-sm',
      ghost:
        'text-tinta/80 hover:text-tinta hover:bg-tinta/10 active:scale-[0.98]',
      next:
        'bg-map-kuning text-arsip font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-black/10',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PilButton.displayName = 'PilButton';
