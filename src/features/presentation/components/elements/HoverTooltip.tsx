import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';

interface HoverTooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  className?: string;
  tooltipClassName?: string;
  syncKey?: string;
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({
  trigger,
  content,
  title,
  className = '',
  tooltipClassName = '',
  syncKey,
}) => {
  const fallbackId = React.useId();
  const activeSyncKey = syncKey || `tooltip-${fallbackId.replace(/:/g, '')}`;
  const [isVisible, setIsVisible] = useUrlSyncedState<boolean>(activeSyncKey, false);

  const triggerRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateCoords();
      // Track window actions to keep tooltip aligned
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
      return () => {
        window.removeEventListener('scroll', updateCoords, true);
        window.removeEventListener('resize', updateCoords);
      };
    }
  }, [isVisible]);

  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    const updateTarget = () => {
      setPortalTarget(document.fullscreenElement || document.body);
    };
    updateTarget();
    document.addEventListener('fullscreenchange', updateTarget);
    return () => {
      document.removeEventListener('fullscreenchange', updateTarget);
    };
  }, []);

  const tooltipStyle: React.CSSProperties = coords ? {
    position: 'fixed',
    left: `${coords.left + coords.width / 2}px`,
    top: `${coords.top}px`,
    transform: 'translate(-50%, -100%)',
    marginTop: '-8px',
    zIndex: 9999,
  } : {};

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span ref={triggerRef} className="cursor-pointer">{trigger}</span>
      {isVisible && coords && portalTarget && createPortal(
        <div
          style={tooltipStyle}
          className={`w-64 bg-card border border-border/85 text-xs text-muted-foreground leading-normal p-3 rounded-lg shadow-lg select-none pointer-events-none animate-in fade-in zoom-in-95 duration-150 break-words whitespace-normal ${tooltipClassName}`}
        >
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card" />
          {title && (
            <strong className="block text-primary font-mono text-[10px] mb-1 uppercase tracking-wider">
              {title}
            </strong>
          )}
          <span className="block text-xs text-foreground/90 font-medium leading-relaxed">
            {content}
          </span>
        </div>,
        portalTarget
      )}
    </div>
  );
};

export default HoverTooltip;
