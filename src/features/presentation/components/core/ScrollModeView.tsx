import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PageMetadata from './PageMetadata';
import TwoWayGridOrchestrator from './TwoWayGridOrchestrator';
import BlogOrchestrator from './BlogOrchestrator';
import { useSlideViewerOrchestrator } from '../../hooks/useSlideViewerOrchestrator';
import ThemePlaygroundPanel from '../tools/ThemePlaygroundPanel';
import OnThisPage from '../layers/OnThisPage';
import ScrollModeHeader from './ScrollModeHeader';

interface ScrollModeViewProps {
  orchestrator: ReturnType<typeof useSlideViewerOrchestrator>;
}

export const ScrollModeView: React.FC<ScrollModeViewProps> = ({ orchestrator }) => {
  const [isThemePlaygroundOpen, setIsThemePlaygroundOpen] = React.useState(false);
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const slideParam = searchParams.get('slide');
    if (slideParam) {
      const slideNum = parseInt(slideParam, 10);
      if (!isNaN(slideNum)) {
        const timer = setTimeout(() => {
          const el = document.getElementById(`slide-card-${slideNum}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams]);

  const {
    activeSub,
    activeSession,
    activeLec,
    activeSlide,
    activeTheme,
    subjectId,
    sessionId,
    lectureId,
    navigateWithTransition,
    visibleSlideNumbers,
  } = orchestrator;

  if (!activeSub || !activeLec) return null;

  return (
    <div className="relative flex h-screen w-full flex-col bg-background overflow-hidden animate-in fade-in duration-300">
      <PageMetadata title={activeLec.title} subjectCode={activeSub.courseCode} slideNo={activeSlide} />

      <ScrollModeHeader
        orchestrator={orchestrator}
        setIsThemePlaygroundOpen={setIsThemePlaygroundOpen}
        scrollContainerRef={scrollContainerRef}
        collapsedSections={collapsedSections}
        setCollapsedSections={setCollapsedSections}
      />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
          {orchestrator.viewMode === 'blog' ? (
            <BlogOrchestrator
              subject={activeSub}
              lecture={activeLec}
              session={activeSession}
              viewMode="blog"
              theme={activeTheme}
              visibleSlideNumbers={visibleSlideNumbers}
              collapsedSections={collapsedSections}
              setCollapsedSections={setCollapsedSections}
            />
          ) : (
            <TwoWayGridOrchestrator
              subject={activeSub}
              lecture={activeLec}
              session={activeSession}
              viewMode="scroll"
              theme={activeTheme}
              visibleSlideNumbers={visibleSlideNumbers}
              onSelectSlide={(num) => {
                navigateWithTransition(`/${subjectId}/${sessionId}/${lectureId}/${num}`);
              }}
              currentSlide={activeSlide}
              collapsedSections={collapsedSections}
              setCollapsedSections={setCollapsedSections}
            />
          )}
        </main>
        <aside className="hidden xl:block w-72 shrink-0 border-l border-border bg-card/30 p-6 flex flex-col min-h-0 overflow-hidden">
          <OnThisPage
            subject={activeSub}
            lecture={activeLec}
            session={activeSession}
            visibleSlideNumbers={visibleSlideNumbers}
            activeSlide={activeSlide}
            scrollContainerRef={scrollContainerRef}
            collapsedSections={collapsedSections}
            setCollapsedSections={setCollapsedSections}
            viewMode={orchestrator.viewMode}
          />
        </aside>
      </div>

      <ThemePlaygroundPanel
        isOpen={isThemePlaygroundOpen}
        onClose={() => setIsThemePlaygroundOpen(false)}
      />
    </div>
  );
};

export default ScrollModeView;
