import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Presentation,
  Grid,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  PenTool,
  Eraser,
  MousePointer2,
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isLaser: boolean;
  onToggleLaser: () => void;
  isPen: boolean;
  onTogglePen: () => void;
  isEraser: boolean;
  onToggleEraser: () => void;
  isOverview: boolean;
  onToggleOverview: () => void;
  isPresenterView: boolean;
  onTogglePresenter: () => void;
}

/**
 * ContextMenu renders a floating right-click context menu containing presenter controls.
 * It automatically positions itself inside the screen boundary limits.
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  isDark,
  onToggleDark,
  isFullscreen,
  onToggleFullscreen,
  isLaser,
  onToggleLaser,
  isPen,
  onTogglePen,
  isEraser,
  onToggleEraser,
  isOverview,
  onToggleOverview,
  isPresenterView,
  onTogglePresenter,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Monitor clicks and Escape key outside menu to trigger close callbacks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust coordinates if menu goes beyond viewport boundary limits
  let adjustedX = x;
  let adjustedY = y;
  const menuWidth = 220;
  const menuHeight = 360;

  if (x + menuWidth > window.innerWidth) {
    adjustedX = window.innerWidth - menuWidth - 10;
  }
  if (y + menuHeight > window.innerHeight) {
    adjustedY = window.innerHeight - menuHeight - 10;
  }



  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] flex w-[220px] flex-col rounded-lg border border-border/80 bg-background/95 p-1 text-sm shadow-2xl backdrop-blur-md select-none animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
    >
      {/* Slide Navigation */}
      <button
        type="button"
        disabled={currentSlide >= totalSlides}
        onClick={() => handleAction(onNext)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <span className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4" /> Next Slide
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">Space</span>
      </button>

      <button
        type="button"
        disabled={currentSlide <= 1}
        onClick={() => handleAction(onPrev)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <span className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Previous Slide
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">Left</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

      {/* Drawing / Pointer Tools */}
      <button
        type="button"
        onClick={() => handleAction(onToggleLaser)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
          isLaser ? 'bg-accent/60 text-primary font-medium' : 'text-foreground hover:bg-accent'
        }`}
      >
        <span className="flex items-center gap-2">
          <MousePointer2 className="h-4 w-4 text-red-500 animate-pulse" /> Laser Pointer
        </span>
        {isLaser && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
      </button>

      <button
        type="button"
        onClick={() => handleAction(onTogglePen)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
          isPen && !isEraser ? 'bg-accent/60 text-primary font-medium' : 'text-foreground hover:bg-accent'
        }`}
      >
        <span className="flex items-center gap-2">
          <PenTool className="h-4 w-4" /> Draw Pen
        </span>
        {isPen && !isEraser && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </button>

      <button
        type="button"
        onClick={() => handleAction(onToggleEraser)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
          isEraser ? 'bg-accent/60 text-primary font-medium' : 'text-foreground hover:bg-accent'
        }`}
      >
        <span className="flex items-center gap-2">
          <Eraser className="h-4 w-4" /> Eraser Mode
        </span>
        {isEraser && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </button>

      <div className="my-1 h-px bg-border/60" />

      {/* View Toggles & Actions */}
      <button
        type="button"
        onClick={() => handleAction(onToggleOverview)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
          isOverview ? 'bg-accent/60 text-primary font-medium' : 'text-foreground hover:bg-accent'
        }`}
      >
        <span className="flex items-center gap-2">
          <Grid className="h-4 w-4" /> Quick Overview
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">O</span>
      </button>

      <button
        type="button"
        onClick={() => handleAction(onTogglePresenter)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
          isPresenterView ? 'bg-accent/60 text-primary font-medium' : 'text-foreground hover:bg-accent'
        }`}
      >
        <span className="flex items-center gap-2">
          <Presentation className="h-4 w-4" /> Presenter Mode
        </span>
        {isPresenterView && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </button>

      <div className="my-1 h-px bg-border/60" />

      {/* Theme & Display Options */}
      <button
        type="button"
        onClick={() => handleAction(onToggleDark)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-foreground transition-colors hover:bg-accent"
      >
        <span className="flex items-center gap-2">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">D</span>
      </button>

      <button
        type="button"
        onClick={() => handleAction(onToggleFullscreen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-foreground transition-colors hover:bg-accent"
      >
        <span className="flex items-center gap-2">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </span>
      </button>
    </div>
  );
};

export default ContextMenu;
