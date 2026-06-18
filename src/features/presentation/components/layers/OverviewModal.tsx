import React, { useEffect, useState, useMemo } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideContainer from '../core/SlideContainer';
import SlideRenderer, { getSlideMetadata, getBgVariant } from '../slides/SlideRenderer';
import { ClickStepsProvider } from '../../context/ClickStepsContext';
import { MorphingBackground } from '@/shared/components';

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
 * OverviewModal provides a grid preview of all slides in the deck,
 * organized into collapsible, PowerPoint-style sections.
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
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

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

  const slides = useMemo(() => Array.from({ length: totalSlides }, (_, i) => i + 1), [totalSlides]);

  const sections = useMemo(() => {
    const groups: Record<string, { num: number; meta: ReturnType<typeof getSlideMetadata> }[]> = {};
    slides.forEach((num) => {
      const meta = getSlideMetadata(num, activeSub, activeLec);
      const sec = meta.section;
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push({ num, meta });
    });
    return groups;
  }, [slides, activeSub, activeLec]);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isOpen) return null;

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

      {/* Sections List */}
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-8 pb-12">
        {Object.entries(sections).map(([sectionName, items]) => {
          const isCollapsed = !!collapsedSections[sectionName];
          return (
            <div key={sectionName} className="flex flex-col gap-4">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionName)}
                className="flex items-center gap-2 text-left border-b pb-2 hover:text-primary transition-colors group/sec w-full cursor-pointer"
              >
                <ChevronDown className={`h-4 w-4 text-muted-foreground group-hover/sec:text-primary transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                <span className="text-sm font-bold text-foreground group-hover/sec:text-primary">
                  {sectionName}
                </span>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'slide' : 'slides'}
                </span>
              </button>

              {/* Section Slides Grid */}
              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {items.map(({ num, meta }) => (
                    <div
                      key={num}
                      onClick={() => onSelectSlide(num)}
                      className="group flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-4 transition-all duration-300 hover:border-primary/80 hover:shadow-lg cursor-pointer"
                    >
                      {/* Mini-Canvas frame */}
                      <div className="relative flex aspect-[16/10] items-center justify-center rounded-lg bg-background border border-border/50 group-hover:bg-accent/30 group-hover:border-primary/50 transition-all duration-300 overflow-hidden select-none pointer-events-none">
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                          <SlideContainer scaleMode="fit" isThumbnail={true}>
                            <MorphingBackground variant={getBgVariant(meta.type)} />
                            <div className="flex-1 flex flex-col justify-center items-center w-full h-full relative z-10">
                              <ClickStepsProvider currentClickOverride={999}>
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
                          {meta.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{meta.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewModal;
