import React from 'react';
import { SlideBullet } from './SlideBullet';

interface SlideListProps {
  title?: string;
  description?: string;
  items: Array<{
    title?: React.ReactNode;
    text: React.ReactNode;
    revealAt?: number | string;
    revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none';
    icon?: React.ReactNode;
  }>;
  variant?: 'default' | 'plain';
  className?: string;
}

export const SlideList: React.FC<SlideListProps> = ({
  title,
  description,
  items,
  variant = 'default',
  className = '',
}) => {
  let listClasses = '';
  if (variant === 'plain') {
    listClasses = `space-y-3 text-left ${className}`;
  } else {
    listClasses = `relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium space-y-3 text-left before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary ${className}`;
  }

  return (
    <ul className={listClasses}>
      {title && (
        <li className={`list-none mb-3 font-extrabold text-xs md:text-sm tracking-wide select-none ${
          variant === 'plain' ? 'text-primary' : 'text-primary border-b border-border/40 pb-1.5 uppercase'
        }`}>
          {title}
        </li>
      )}
      {description && (
        <li className="list-none mb-3 text-xs md:text-sm text-foreground/90 font-medium leading-relaxed select-text">
          {description}
        </li>
      )}
      {items.map((item, idx) => (
        <SlideBullet
          key={idx}
          title={item.title}
          text={item.text}
          revealAt={item.revealAt}
          revealPreset={item.revealPreset}
          icon={item.icon}
        />
      ))}
    </ul>
  );
};

export default SlideList;

