import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useSlideViewerOrchestrator from '../../hooks/useSlideViewerOrchestrator';
import ScrollModeView from './ScrollModeView';
import PresentationModeView from './PresentationModeView';
import PrintView from './PrintView';
import { SlideThemeProvider } from '../../context/SlideThemeContext';

/**
 * SlideViewer manages the slide deck viewing lifecycle,
 * orchestrating the transition between scrollable 2D grid mode and presentation mode.
 */
export const SlideViewer: React.FC = () => {
  const orchestrator = useSlideViewerOrchestrator();
  const [searchParams] = useSearchParams();

  if (orchestrator.isLoadingDeck) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground transition-all duration-300">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/10 duration-1000" />
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
        <div className="mt-4 flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-semibold tracking-wide animate-pulse">Initializing Slide Deck</span>
          <span className="text-xs text-muted-foreground">Loading presentation assets and modules...</span>
        </div>
      </div>
    );
  }

  if (orchestrator.notFound) {
    return <div className="flex h-64 items-center justify-center text-sm text-destructive">Lecture deck not found.</div>;
  }

  return (
    <SlideThemeProvider
      subjectId={orchestrator.subjectId!}
      lectureId={orchestrator.lectureId!}
    >
      {searchParams.get('print') === 'true' ? (
        <PrintView
          subject={orchestrator.activeSub!}
          lecture={orchestrator.activeLec!}
          session={orchestrator.activeSession}
          includeAnnotations={searchParams.get('annotations') === 'true'}
        />
      ) : (orchestrator.viewMode === 'scroll' || orchestrator.viewMode === 'blog') ? (
        <ScrollModeView orchestrator={orchestrator} />
      ) : (
        <PresentationModeView orchestrator={orchestrator} />
      )}
    </SlideThemeProvider>
  );
};

export default SlideViewer;
