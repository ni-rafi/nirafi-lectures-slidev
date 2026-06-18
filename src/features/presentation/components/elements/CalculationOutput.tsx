import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface CalculationOutputProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  className?: string;
}

export const CalculationOutput: React.FC<CalculationOutputProps> = ({
  title,
  value,
  unit = '',
  subtitle,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  return (
    <div className={`flex flex-col items-center justify-center h-full p-6 border rounded-xl transition-all ${
      isBlog ? 'bg-transparent border-border/50 shadow-none' : 'bg-card border-border/60 shadow-xs hover:shadow-md'
    } ${className}`}>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 select-none">
        {title}
      </span>
      <span className="text-2xl sm:text-3xl font-extrabold text-primary select-all">
        {value} {unit}
      </span>
      {subtitle && (
        <span className="text-[10px] text-muted-foreground/80 mt-1 select-none">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default CalculationOutput;
