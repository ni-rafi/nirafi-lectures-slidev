import React from 'react';
import { ClickReveal } from './ClickReveal';
import { SlideElementProps } from './SlideParagraph';
import { useSlideTheme } from '../../context/SlideThemeContext';

interface SlideBulletProps extends SlideElementProps {
  title?: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SlideBullet: React.FC<SlideBulletProps> = ({
  title,
  text,
  children,
  revealAt,
  revealPreset,
  icon,
  className = '',
}) => {
  let theme;
  try {
    theme = useSlideTheme();
  } catch (e) {
    theme = { resolvedTheme: { bulletStyle: 'dot' as const } };
  }

  const renderBulletMarker = () => {
    const style = theme?.resolvedTheme?.bulletStyle || 'dot';
    switch (style) {
      case 'square':
        return <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />;
      case 'check':
        return (
          <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'chevron':
        return (
          <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        );
      case 'arrow':
        return (
          <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        );
      case 'dash':
        return <span className="mt-1.5 shrink-0 text-primary font-bold">—</span>;
      case 'dot':
      default:
        return <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />;
    }
  };

  const content = (
    <li className={`text-xs md:text-sm leading-relaxed text-muted-foreground select-text list-none flex items-start gap-2 ${className}`}>
      {icon ? (
        <span className="mt-1 shrink-0 text-primary">{icon}</span>
      ) : (
        renderBulletMarker()
      )}
      <div>
        {title && <span className="font-bold text-foreground mr-1.5">{title}</span>}
        {text || children}
      </div>
    </li>
  );

  if (revealAt !== undefined) {
    return <ClickReveal at={revealAt} preset={revealPreset}>{content}</ClickReveal>;
  }

  return content;
};

export default SlideBullet;
