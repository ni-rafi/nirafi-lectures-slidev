import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideRenderer, { getSlideMetadata } from '../slides/SlideRenderer';
import { ClickStepsProvider } from '../../context/ClickStepsContext';
import { PresentationContext, ViewMode, Theme } from '../../context/PresentationContext';
import { useSlideTheme } from '../../context/SlideThemeContext';

interface BlogOrchestratorProps {
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  viewMode: ViewMode;
  theme: Theme;
  totalSlides: number;
  collapsedSections: Record<string, boolean>;
  setCollapsedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const BlogSlideCard: React.FC<{
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
}> = ({ slideNo, subject, lecture, session }) => {
  const meta = getSlideMetadata(slideNo, subject, lecture);

  let resolvedTheme: any = null;
  try {
    resolvedTheme = useSlideTheme().resolvedTheme;
  } catch (e) {
    // Context fallback
  }

  const containerStyle: React.CSSProperties & Record<string, string | number> = {
    '--slide-accent-hue': resolvedTheme ? resolvedTheme.accentHue.toString() : '220',
    '--slide-font-sans': resolvedTheme ? resolvedTheme.fontSans : 'Montserrat',
    '--slide-font-header': resolvedTheme ? resolvedTheme.fontHeader : 'Raleway',
  };

  return (
    <div
      id={`slide-card-${slideNo}`}
      style={containerStyle}
      className="w-full select-text py-2 text-foreground bg-transparent overflow-hidden flex flex-col gap-3"
    >
      {slideNo > 1 && meta.title && (
        <h3 className="text-lg font-bold text-primary tracking-tight select-none border-b border-border/20 pb-1 mt-4">
          {meta.title}
        </h3>
      )}
      <ClickStepsProvider currentClickOverride={999}>
        <SlideRenderer slideNo={slideNo} subject={subject} lecture={lecture} session={session} />
      </ClickStepsProvider>
    </div>
  );
};

export const BlogOrchestrator: React.FC<BlogOrchestratorProps> = ({
  subject,
  lecture,
  session,
  viewMode,
  theme,
  totalSlides,
  collapsedSections,
  setCollapsedSections,
}) => {
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

  return (
    <PresentationContext.Provider value={{ theme, viewMode, activeSubStep: 0 }}>
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 pt-8 pb-16 px-6 md:px-8 animate-in fade-in duration-300">
        {Object.entries(sections).map(([sectionName, slideNumbers]) => {
          const isCollapsed = !!collapsedSections[sectionName];
          const sectionSlug = sectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <div key={sectionName} className="flex flex-col gap-4">
              <button
                id={`section-${sectionSlug}`}
                onClick={() => toggleSection(sectionName)}
                className="flex items-center gap-2 text-left border-b pb-2 hover:text-primary transition-colors group/sec w-full cursor-pointer select-none"
              >
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground group-hover/sec:text-primary transition-transform duration-200 ${
                    isCollapsed ? '-rotate-90' : ''
                  }`}
                />
                <h2 className="text-base font-extrabold text-foreground group-hover/sec:text-primary">
                  {sectionName}
                </h2>
                <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full ml-1">
                  {slideNumbers.length} {slideNumbers.length === 1 ? 'slide' : 'slides'}
                </span>
              </button>

              {!isCollapsed && (
                <div className="flex flex-col gap-4 w-full">
                  {slideNumbers.map((num) => (
                    <BlogSlideCard
                      key={num}
                      slideNo={num}
                      subject={subject}
                      lecture={lecture}
                      session={session}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PresentationContext.Provider>
  );
};

export default BlogOrchestrator;
