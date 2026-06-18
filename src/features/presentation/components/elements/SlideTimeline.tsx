import React, { useContext, useEffect, useState, useId } from 'react';
import { ClickReveal } from './ClickReveal';
import { PresentationContext } from '../../context/PresentationContext';
import { useClickStepsContext } from '../../context/ClickStepsContext';

interface TimelineItem {
  date: string;
  title: string;
  text: React.ReactNode;
  icon?: React.ReactNode;
}

interface SlideTimelineProps {
  items: TimelineItem[];
  revealMode?: 'each-click' | 'all-click' | 'none';
  revealAt?: number | string;
  revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none';
  className?: string;
}

export const SlideTimeline: React.FC<SlideTimelineProps> = ({
  items,
  revealMode = 'none',
  revealAt,
  revealPreset = 'fade-in',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';
  const { registerClick, deregisterClick } = useClickStepsContext();
  const id = useId();
  const [listStep, setListStep] = useState<number | null>(null);

  useEffect(() => {
    if (!isBlog && revealMode === 'all-click') {
      const step = registerClick(id, revealAt ?? '+1');
      setListStep(step);
      return () => {
        deregisterClick(id);
      };
    }
  }, [id, revealMode, revealAt, registerClick, deregisterClick, isBlog]);

  return (
    <div className={`relative border-l border-border/80 pl-6 ml-3 space-y-8 text-left ${className}`}>
      {items.map((item, idx) => {
        let itemRevealAt: number | string | undefined = undefined;

        if (!isBlog) {
          if (revealMode === 'each-click') {
            itemRevealAt = idx === 0 ? (revealAt ?? '+1') : '+1';
          } else if (revealMode === 'all-click') {
            itemRevealAt = listStep ?? undefined;
          }
        }

        const bulletElement = (
          <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow-sm select-none">
            {item.icon ? (
              <span className="text-[8px] flex items-center justify-center">{item.icon}</span>
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </div>
        );

        const contentElement = (
          <div className="relative">
            {bulletElement}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-1 select-text">
              <span className="text-[10px] md:text-xs font-extrabold text-primary uppercase tracking-widest">
                {item.date}
              </span>
              <span className="text-xs md:text-sm font-extrabold text-foreground">
                {item.title}
              </span>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground leading-relaxed select-text">
              {item.text}
            </div>
          </div>
        );

        if (itemRevealAt !== undefined) {
          return (
            <div key={idx} className="relative">
              <ClickReveal at={itemRevealAt} preset={revealPreset}>
                {contentElement}
              </ClickReveal>
            </div>
          );
        }

        return (
          <div key={idx} className="relative">
            {contentElement}
          </div>
        );
      })}
    </div>
  );
};

export default SlideTimeline;
