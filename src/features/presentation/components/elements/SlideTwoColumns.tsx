import React, { useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import { PresentationContext } from '../../context/PresentationContext';

export type SlideTwoColumnsRatio = '1:1' | '2:1' | '1:2';
export type SlideTwoColumnsAlign = 'start' | 'center' | 'end' | 'stretch';

export interface SlideTwoColumnsProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: SlideTwoColumnsRatio;
  align?: SlideTwoColumnsAlign;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
}

export const SlideTwoColumns: React.FC<SlideTwoColumnsProps> = ({
  left,
  right,
  ratio = '1:1',
  align = 'center',
  gap = 'md',
  className = '',
  leftClassName = '',
  rightClassName = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  // Align items classes
  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  // Gap size mapping
  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6 md:gap-8',
    lg: 'gap-8 md:gap-12',
    xl: 'gap-10 md:gap-16',
  };

  // Layout grid definitions
  let gridLayoutClass = '';
  let leftSpanClass = '';
  let rightSpanClass = '';

  if (ratio === '1:1') {
    gridLayoutClass = 'grid-cols-1 md:grid-cols-2';
    leftSpanClass = 'col-span-1';
    rightSpanClass = 'col-span-1';
  } else if (ratio === '2:1') {
    gridLayoutClass = 'grid-cols-1 md:grid-cols-3';
    leftSpanClass = 'col-span-1 md:col-span-2';
    rightSpanClass = 'col-span-1';
  } else if (ratio === '1:2') {
    gridLayoutClass = 'grid-cols-1 md:grid-cols-3';
    leftSpanClass = 'col-span-1';
    rightSpanClass = 'col-span-1 md:col-span-2';
  }

  // Under blog mode, ensure columns stack nicely
  const containerClass = isBlog
    ? twMerge('grid grid-cols-1 gap-6 my-6', className)
    : twMerge(`grid ${gridLayoutClass} ${alignMap[align]} ${gapMap[gap]} w-full h-full my-4`, className);

  return (
    <div className={containerClass}>
      <div className={`w-full ${isBlog ? '' : leftSpanClass} ${leftClassName}`}>
        {left}
      </div>
      <div className={`w-full ${isBlog ? '' : rightSpanClass} ${rightClassName}`}>
        {right}
      </div>
    </div>
  );
};

export default SlideTwoColumns;
