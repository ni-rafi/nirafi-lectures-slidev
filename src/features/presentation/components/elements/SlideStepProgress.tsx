import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';
import { Check } from 'lucide-react';

interface SlideStepProgressProps {
  steps: Array<React.ReactNode | string>;
  activeStep: number;
  variant?: 'pill' | 'chevron' | 'minimal';
  className?: string;
}

export const SlideStepProgress: React.FC<SlideStepProgressProps> = ({
  steps,
  activeStep,
  variant = 'chevron',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClass = `w-full flex ${
    isBlog ? 'flex-col md:flex-row gap-3 my-6' : 'flex-row items-center justify-between gap-2 my-4'
  } select-none ${className}`;

  return (
    <div className={containerClass}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === activeStep;
        const isCompleted = stepNum < activeStep;
        const isFuture = stepNum > activeStep;

        let itemClass = '';
        let badgeClass = '';

        if (variant === 'chevron') {
          itemClass = `flex-1 flex items-center justify-center p-3 rounded-lg border text-center font-bold text-xs md:text-sm tracking-wide transition-all ${
            isActive
              ? 'bg-primary text-primary-foreground border-primary shadow-md'
              : isCompleted
              ? 'bg-primary/5 text-primary border-primary/20'
              : 'bg-muted/30 text-muted-foreground border-border/40'
          }`;
          badgeClass = `h-4.5 w-4.5 rounded-full flex items-center justify-center mr-2 text-[9px] font-mono font-extrabold ${
            isActive
              ? 'bg-primary-foreground text-primary'
              : isCompleted
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`;
        } else if (variant === 'pill') {
          itemClass = `flex items-center px-4 py-2 rounded-full border text-xs font-extrabold tracking-wider uppercase transition-all ${
            isActive
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : isCompleted
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-muted/40 text-muted-foreground border-border/40'
          }`;
          badgeClass = `h-4 w-4 rounded-full flex items-center justify-center mr-1.5 text-[8px] font-bold ${
            isActive
              ? 'bg-primary-foreground text-primary'
              : isCompleted
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`;
        } else {
          itemClass = `flex items-center text-xs md:text-sm font-bold transition-all ${
            isActive
              ? 'text-primary'
              : isCompleted
              ? 'text-primary/70'
              : 'text-muted-foreground'
          }`;
          badgeClass = `h-4 w-4 rounded-full flex items-center justify-center mr-1.5 text-[9px] border ${
            isActive
              ? 'border-primary bg-primary text-primary-foreground'
              : isCompleted
              ? 'border-primary/40 bg-primary/5 text-primary'
              : 'border-border bg-muted/40 text-muted-foreground'
          }`;
        }

        return (
          <React.Fragment key={idx}>
            <div className={`flex items-center ${isBlog ? 'w-full md:w-auto md:flex-1' : 'flex-1 justify-center'}`}>
              <div className={`w-full flex items-center justify-center ${itemClass}`}>
                <span className={badgeClass}>
                  {isCompleted ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : stepNum}
                </span>
                <span className="truncate">{step}</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <span className={`text-muted-foreground/40 font-bold select-none ${
                isBlog ? 'hidden md:inline-block px-1' : 'inline-block'
              }`}>
                →
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SlideStepProgress;
