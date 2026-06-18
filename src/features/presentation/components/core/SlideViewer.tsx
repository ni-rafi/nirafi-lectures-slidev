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
      ) : orchestrator.viewMode === 'scroll' ? (
        <ScrollModeView orchestrator={orchestrator} />
      ) : (
        <PresentationModeView orchestrator={orchestrator} />
      )}
    </SlideThemeProvider>
  );
};

export default SlideViewer;
