import React from 'react';
import { cn } from '@/lib/utils';

export interface DimensionPaperColumn {
  colNum: 1 | 2 | 3 | 4;
  name: string;
  value: React.ReactNode;
  isActive?: boolean;
}

interface DimensionPaperGridProps {
  columns: DimensionPaperColumn[];
  className?: string;
}

export const DimensionPaperGrid: React.FC<DimensionPaperGridProps> = ({
  columns,
  className = '',
}) => {
  const colCount = columns.length;

  // Dynamically map grid columns configuration
  let gridColsClass = 'grid-cols-4';
  if (colCount === 1) gridColsClass = 'grid-cols-1';
  else if (colCount === 2) gridColsClass = 'grid-cols-2';
  else if (colCount === 3) gridColsClass = 'grid-cols-3';

  return (
    <div
      className={cn(
        "grid border border-border/60 rounded-xl overflow-hidden bg-background shadow-xs select-none w-full",
        gridColsClass,
        className
      )}
    >
      {columns.map((col) => {
        const { colNum, name, value, isActive = false } = col;
        return (
          <div
            key={colNum}
            className={cn(
              "flex flex-col border-r border-border/40 last:border-r-0 transition-all duration-350",
              isActive ? "bg-primary/10" : "opacity-65"
            )}
          >
            <div
              className={cn(
                "p-2 text-center text-[9px] font-extrabold uppercase border-b border-border/40",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground bg-muted/20"
              )}
            >
              {name}
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[85px] p-3 text-foreground/80">
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DimensionPaperGrid;
