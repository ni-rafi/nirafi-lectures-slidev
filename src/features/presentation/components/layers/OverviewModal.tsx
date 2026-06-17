import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideContainer from '../SlideContainer';
import SlideRenderer, { getSlideMetadata } from '../slides/SlideRenderer';
import { ClickStepsProvider } from '../../context/ClickStepsContext';

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (slideNo: number) => void;
  totalSlides: number;
  activeSub: Subject;
  activeLec: Lecture;
  activeSession?: Session;
}

/**
 * OverviewModal provides a grid preview of all slides in the deck.
 * Supports quick slide jumping and keybind dismissal.
 */
export const OverviewModal: React.FC<OverviewModalProps> = ({
  isOpen,
  onClose,
  onSelectSlide,
  totalSlides,
  activeSub,
  activeLec,
  activeSession,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slides = Array.from({ length: totalSlides }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background/95 p-8 backdrop-blur-md overflow-y-auto select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-xl font-bold text-foreground">Slides Overview Grid</h2>
        <button
          onClick={onClose}
          className="rounded-full bg-accent/50 p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Close (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {slides.map((num) => {
          const thumb = getSlideMetadata(num, activeSub, activeLec);

          return (
            <div
              key={num}
              onClick={() => onSelectSlide(num)}
              className="group flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-4 transition-all duration-300 hover:border-primary/80 hover:shadow-lg cursor-pointer"
            >
              {/* Mini-Canvas frame */}
              <div className="relative flex aspect-[16/10] items-center justify-center rounded-lg bg-background border border-border/50 group-hover:bg-accent/30 group-hover:border-primary/50 transition-all duration-300 overflow-hidden select-none pointer-events-none">
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <SlideContainer scaleMode="fit" isThumbnail={true}>
                    <div className="flex-1 flex flex-col justify-center items-center w-full h-full">
                      <ClickStepsProvider currentClickOverride={0}>
                        <SlideRenderer slideNo={num} subject={activeSub} lecture={activeLec} session={activeSession} />
                      </ClickStepsProvider>
                    </div>
                  </SlideContainer>
                </div>
                <span className="absolute bottom-2 right-2 z-10 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                  Slide {num}
                </span>
              </div>
              
              {/* Details label */}
              <div className="flex flex-col">
                <span className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {thumb.title}
                </span>
                <span className="text-[10px] text-muted-foreground">{thumb.type}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewModal;
