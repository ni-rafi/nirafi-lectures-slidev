import React from 'react';

interface SlideBadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'warning' | 'error' | 'success' | 'info';
  className?: string;
}

export const SlideBadge: React.FC<SlideBadgeProps> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20 dark:border-primary/30',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    default: 'bg-muted text-muted-foreground border-border/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border select-none ${colorMap[variant]} ${className}`}
    >
      {label}
    </span>
  );
};

export default SlideBadge;
