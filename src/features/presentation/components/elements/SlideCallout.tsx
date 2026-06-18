import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';
import { Info, AlertTriangle, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

interface SlideCalloutProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'info' | 'warning' | 'success' | 'danger' | 'note';
  icon?: React.ReactNode;
  className?: string;
}

export const SlideCallout: React.FC<SlideCalloutProps> = ({
  children,
  title,
  variant = 'note',
  icon,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const defaultIcon = () => {
    switch (variant) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'danger':
        return <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />;
      case 'note':
      default:
        return <BookOpen className="h-4 w-4 text-primary shrink-0" />;
    }
  };

  const styleMap = {
    info: 'border-blue-500 text-blue-900 dark:text-blue-200 bg-blue-500/5',
    warning: 'border-amber-500 text-amber-900 dark:text-amber-200 bg-amber-500/5',
    success: 'border-emerald-500 text-emerald-900 dark:text-emerald-200 bg-emerald-500/5',
    danger: 'border-red-500 text-red-900 dark:text-red-200 bg-red-500/5',
    note: 'border-primary text-foreground bg-primary/5',
  };

  const borderClass = isBlog 
    ? `bg-transparent border border-border/40 rounded-xl p-4 md:p-5 flex gap-3 items-start text-foreground ${className}` 
    : `rounded-r-xl border-l-[5px] p-4 md:p-5 flex gap-3 items-start shadow-sm ${styleMap[variant]} ${className}`;

  return (
    <div className={borderClass}>
      <div className="mt-0.5 select-none">
        {icon !== undefined ? icon : defaultIcon()}
      </div>
      <div className="flex-1 flex flex-col text-left select-text">
        {title && (
          <span className="font-extrabold text-xs md:text-sm tracking-wide uppercase mb-1 text-foreground">
            {title}
          </span>
        )}
        <div className="text-xs md:text-sm text-foreground/90 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideCallout;
