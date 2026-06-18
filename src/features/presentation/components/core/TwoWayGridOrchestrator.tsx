import React, { useState, useMemo } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideRenderer, { getSlideMetadata } from '../slides/SlideRenderer';
import { ClickStepsProvider } from '../../context/ClickStepsContext';
import { PresentationContext, ViewMode, Theme } from '../../context/PresentationContext';
import { SimulationModal, ClickTracker } from './SimulationModal';
import { useSlideTheme } from '../../context/SlideThemeContext';

interface TwoWayGridOrchestratorProps {
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  viewMode: ViewMode;
  theme: Theme;
  totalSlides: number;
  onSelectSlide: (num: number) => void;
  currentSlide?: number;
}

const SlideCard: React.FC<{
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  onSelect: () => void;
  onPlaySimulation: () => void;
}> = ({ slideNo, subject, lecture, session, onSelect, onPlaySimulation }) => {
  const meta = getSlideMetadata(slideNo, subject, lecture);
  const [localTotalClicks, setLocalTotalClicks] = useState(0);

  let resolvedTheme: any = null;
  try {
    resolvedTheme = useSlideTheme().resolvedTheme;
  } catch (e) {
    // Context fallback
  }

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  let customBackgroundValue: string | undefined = undefined;

  if (resolvedTheme) {
    if (resolvedTheme.bgType === 'gradient') {
      customBackgroundValue = isDark
        ? `linear-gradient(135deg, oklch(0.18 0.04 ${resolvedTheme.accentHue}) 0%, oklch(0.12 0.02 ${resolvedTheme.accentHue}) 100%)`
        : `linear-gradient(135deg, oklch(0.95 0.05 ${resolvedTheme.accentHue}) 0%, oklch(0.99 0.01 ${resolvedTheme.accentHue}) 100%)`;
    } else if (resolvedTheme.bgType === 'custom' && resolvedTheme.customBgValue) {
      customBackgroundValue = resolvedTheme.customBgValue;
    }
  }

  const containerStyle: React.CSSProperties & Record<string, string | number> = {
    '--slide-accent-hue': resolvedTheme ? resolvedTheme.accentHue.toString() : '220',
    '--slide-radius': resolvedTheme ? `${resolvedTheme.borderRadius}px` : '0px',
    '--slide-font-sans': resolvedTheme ? resolvedTheme.fontSans : 'Montserrat',
    '--slide-font-header': resolvedTheme ? resolvedTheme.fontHeader : 'Raleway',
    '--slide-bg-type': resolvedTheme ? resolvedTheme.bgType : 'solid',
    '--slide-custom-bg': resolvedTheme ? resolvedTheme.customBgValue : '',
    '--slide-border-side': resolvedTheme ? resolvedTheme.borderSide : 'left',
    '--slide-header-size': resolvedTheme ? `${resolvedTheme.headerFontSize}px` : '30px',
  };

  if (customBackgroundValue) {
    containerStyle.background = customBackgroundValue;
    containerStyle['--background'] = customBackgroundValue;
  }

  return (
    <div className="relative group w-full bg-card rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow duration-300 animate-in fade-in duration-300">
      <ClickTracker
        slideNo={slideNo}
        subject={subject}
        lecture={lecture}
        session={session}
        onCountResolved={setLocalTotalClicks}
      />

      <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-3.5 rounded-t-2xl select-none">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-primary font-mono uppercase tracking-wider">Slide {slideNo} • {meta.type}</span>
          <h4 className="text-sm font-bold text-foreground leading-tight">{meta.title}</h4>
        </div>
        
        <div className="flex items-center gap-2">
          {localTotalClicks > 0 && (
            <button
              onClick={onPlaySimulation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer"
              title="Play step-by-step simulation"
            >
              <Play className="h-3.5 w-3.5 fill-primary" />
              <span>Play Steps</span>
            </button>
          )}

          <button
            onClick={onSelect}
            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Present from this slide"
          >
            <Play className="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
      
      <div 
        style={containerStyle}
        className="p-6 md:p-8 select-text w-full bg-background text-foreground rounded-b-2xl overflow-hidden flex flex-col justify-between"
        data-slide-canvas
      >
        <ClickStepsProvider currentClickOverride={999}>
          <SlideRenderer slideNo={slideNo} subject={subject} lecture={lecture} session={session} />
        </ClickStepsProvider>
      </div>
    </div>
  );
};

export const TwoWayGridOrchestrator: React.FC<TwoWayGridOrchestratorProps> = ({
  subject,
  lecture,
  session,
  viewMode,
  theme,
  totalSlides,
  onSelectSlide,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [activeSimulationSlide, setActiveSimulationSlide] = useState<number | null>(null);

  const slides = useMemo(() => Array.from({ length: totalSlides }, (_, i) => i + 1), [totalSlides]);

  const sections = useMemo(() => {
    const groups: Record<string, number[]> = {};
    slides.forEach((num) => {
      const meta = getSlideMetadata(num, subject, lecture);
      const sec = meta.section;
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(num);
    });
    return groups;
  }, [slides, subject, lecture]);

  const toggleSection = (sectionName: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  if (viewMode === 'scroll') {
    return (
      <PresentationContext.Provider value={{ theme, viewMode, activeSubStep: 0 }}>
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-8 pb-12 p-8 animate-in fade-in duration-300">
          {Object.entries(sections).map(([sectionName, slideNumbers]) => {
            const isCollapsed = !!collapsedSections[sectionName];
            return (
              <div key={sectionName} className="flex flex-col gap-4">
                <button
                  onClick={() => toggleSection(sectionName)}
                  className="flex items-center gap-2 text-left border-b pb-2 hover:text-primary transition-colors group/sec w-full cursor-pointer select-none"
                >
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground group-hover/sec:text-primary transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                  <span className="text-sm font-bold text-foreground group-hover/sec:text-primary">
                    {sectionName}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                    {slideNumbers.length} {slideNumbers.length === 1 ? 'slide' : 'slides'}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="flex flex-col gap-8 items-center w-full">
                    {slideNumbers.map((num) => (
                      <div key={num} className="w-full max-w-3xl">
                        <SlideCard
                          slideNo={num}
                          subject={subject}
                          lecture={lecture}
                          session={session}
                          onSelect={() => onSelectSlide(num)}
                          onPlaySimulation={() => setActiveSimulationSlide(num)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activeSimulationSlide !== null && (
          <SimulationModal
            slideNo={activeSimulationSlide}
            subject={subject}
            lecture={lecture}
            session={session}
            onClose={() => setActiveSimulationSlide(null)}
          />
        )}
      </PresentationContext.Provider>
    );
  }

  return null;
};

export default TwoWayGridOrchestrator;
