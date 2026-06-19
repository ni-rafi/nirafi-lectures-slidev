import React, { useContext, useId, useState, useEffect } from 'react';
import { ClickReveal } from './ClickReveal';
import { SlideElementProps } from './SlideParagraph';
import { PresentationContext } from '../../context/PresentationContext';
import { useClickStepsContext } from '../../context/ClickStepsContext';

interface SlideTableProps extends SlideElementProps {
  headers: Array<
    | string
    | {
        label: string;
        align?: 'left' | 'center' | 'right';
        revealAt?: number | string;
      }
  >;
  rows: Array<Array<React.ReactNode>>;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}

export const SlideTable: React.FC<SlideTableProps> = ({
  headers,
  rows,
  striped = false,
  bordered = true,
  hoverable = true,
  revealAt,
  revealPreset,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const { currentClick, registerClick, deregisterClick } = useClickStepsContext();
  const [columnSteps, setColumnSteps] = useState<Record<number, number>>({});
  const tableId = useId();

  const revealKeys = JSON.stringify(
    headers.map((h) => (typeof h === 'string' ? '' : `${h.revealAt ?? ''}`))
  );

  useEffect(() => {
    const stepsMap: Record<number, number> = {};
    headers.forEach((h, colIdx) => {
      if (typeof h !== 'string' && h.revealAt !== undefined) {
        const step = registerClick(`${tableId}-col-${colIdx}`, h.revealAt);
        stepsMap[colIdx] = step;
      }
    });
    setColumnSteps(stepsMap);

    return () => {
      headers.forEach((h, colIdx) => {
        if (typeof h !== 'string' && h.revealAt !== undefined) {
          deregisterClick(`${tableId}-col-${colIdx}`);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId, revealKeys, registerClick, deregisterClick]);

  const isColVisible = (colIdx: number): boolean => {
    const h = headers[colIdx];
    if (!h) {
      return false;
    }
    if (typeof h === 'string' || h.revealAt === undefined) {
      return true;
    }
    const step = columnSteps[colIdx];
    if (step === undefined) {
      return false; // Hide initially to prevent flash
    }
    return currentClick >= step;
  };

  const lastVisibleColIdx = headers.reduce((acc, _, idx) => {
    return isColVisible(idx) ? idx : acc;
  }, -1);

  const getColClasses = (colIdx: number): string => {
    if (isBlog) return 'p-3';
    const visible = isColVisible(colIdx);
    return visible
      ? 'py-2 px-3 opacity-100 max-w-[300px] transition-all duration-500 ease-in-out'
      : 'p-0 opacity-0 max-w-0 border-r-0 border-l-0 pointer-events-none overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out';
  };

  const firstVisibleColIdx = headers.findIndex((_, idx) => isColVisible(idx));

  const containerClass = isBlog
    ? `border border-border/50 rounded-xl overflow-visible w-full text-left text-xs bg-transparent ${className}`
    : `border rounded-xl overflow-visible w-full text-left text-xs bg-card shadow-sm transition-all duration-300 hover:shadow-md ${className}`;

  const content = (
    <div className={containerClass}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${isBlog ? 'bg-muted/20' : 'bg-muted'} text-foreground border-b font-bold`}>
            {headers.map((h, idx) => {
              const visible = isColVisible(idx);
              const label = typeof h === 'string' ? h : h.label;
              const align = typeof h === 'string' ? 'left' : (h.align || 'left');
              const alignClass = align === 'right' ? 'text-right' : (align === 'center' ? 'text-center' : 'text-left');
              const borderClass = bordered && visible && idx < lastVisibleColIdx ? 'border-r border-border/80' : 'border-r-0';
              const animClass = getColClasses(idx);
              const isFirstVisible = idx === firstVisibleColIdx;
              const isLastVisible = idx === lastVisibleColIdx;
              const cornerClass = isFirstVisible ? 'rounded-tl-xl' : (isLastVisible ? 'rounded-tr-xl' : '');
              return (
                <th key={idx} className={`${alignClass} ${borderClass} ${animClass} ${cornerClass}`}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => {
            const isLastRow = rowIdx === rows.length - 1;
            const borderClass = bordered && !isLastRow ? 'border-b border-border/80' : '';
            const stripedClass = striped && rowIdx % 2 === 1 ? 'bg-muted/30' : '';
            const hoverClass = hoverable ? 'hover:bg-muted/10 transition-colors' : '';
            return (
              <tr key={rowIdx} className={`${borderClass} ${stripedClass} ${hoverClass} text-muted-foreground`}>
                {row.map((cell, cellIdx) => {
                  const visible = isColVisible(cellIdx);
                  const h = headers[cellIdx];
                  const align = !h || typeof h === 'string' ? 'left' : (h.align || 'left');
                  const alignClass = align === 'right' ? 'text-right' : (align === 'center' ? 'text-center' : 'text-left');
                  
                  const isMono = typeof cell === 'string' && (
                    cell.match(/^[\d\.\$\-\+\,\%\/]+$/) || 
                    cell.includes('m³') || 
                    cell.includes('kg') || 
                    cell.includes('mm')
                  );
                  const cellFontClass = isMono ? 'font-mono' : '';
                  const cellBorderClass = bordered && visible && cellIdx < lastVisibleColIdx ? 'border-r border-border/80' : 'border-r-0';
                  const animClass = getColClasses(cellIdx);
                  return (
                    <td key={cellIdx} className={`${alignClass} ${cellFontClass} ${cellBorderClass} ${animClass}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (revealAt !== undefined) {
    return <ClickReveal at={revealAt} preset={revealPreset}>{content}</ClickReveal>;
  }

  return content;
};

export default SlideTable;
