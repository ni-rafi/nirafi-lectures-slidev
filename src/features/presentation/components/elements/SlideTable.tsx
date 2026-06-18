import React, { useContext } from 'react';
import { ClickReveal } from './ClickReveal';
import { SlideElementProps } from './SlideParagraph';
import { PresentationContext } from '../../context/PresentationContext';

interface SlideTableProps extends SlideElementProps {
  headers: Array<string | { label: string; align?: 'left' | 'center' | 'right' }>;
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

  const containerClass = isBlog
    ? `border border-border/50 rounded-xl overflow-hidden w-full text-left text-xs bg-transparent ${className}`
    : `border rounded-xl overflow-hidden w-full text-left text-xs bg-card shadow-sm transition-all duration-300 hover:shadow-md ${className}`;

  const content = (
    <div className={containerClass}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${isBlog ? 'bg-muted/20' : 'bg-muted'} text-foreground border-b font-bold`}>
            {headers.map((h, idx) => {
              const label = typeof h === 'string' ? h : h.label;
              const align = typeof h === 'string' ? 'left' : (h.align || 'left');
              const alignClass = align === 'right' ? 'text-right' : (align === 'center' ? 'text-center' : 'text-left');
              const borderClass = bordered && idx < headers.length - 1 ? 'border-r border-border/80' : '';
              return (
                <th key={idx} className={`p-3 ${alignClass} ${borderClass}`}>
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
                  const h = headers[cellIdx];
                  const align = typeof h === 'string' ? 'left' : (h?.align || 'left');
                  const alignClass = align === 'right' ? 'text-right' : (align === 'center' ? 'text-center' : 'text-left');
                  
                  const isMono = typeof cell === 'string' && (
                    cell.match(/^[\d\.\$\-\+\,\%\/]+$/) || 
                    cell.includes('m³') || 
                    cell.includes('kg') || 
                    cell.includes('mm')
                  );
                  const cellFontClass = isMono ? 'font-mono' : '';
                  const cellBorderClass = bordered && cellIdx < row.length - 1 ? 'border-r border-border/80' : '';
                  return (
                    <td key={cellIdx} className={`p-3 ${alignClass} ${cellFontClass} ${cellBorderClass}`}>
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
