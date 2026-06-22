import React from 'react';
import PageMetadata from './PageMetadata';
import { PresentationContext } from '../../context/PresentationContext';
import { ClickStepsProvider } from '../../context/ClickStepsContext';
import { useClickSteps } from '../../hooks/useClickSteps';
import { useClickStepsContext } from '../../context/ClickStepsContext';
import { useNavShortcuts } from '../../hooks/useNavShortcuts';
import SlideContainer from './SlideContainer';
import MorphingBackground from '../../../../shared/components/MorphingBackground';
import GlobalTop from '../layers/GlobalTop';
import SlideRenderer, { getSlideMetadata } from '../slides/SlideRenderer';
import DrawingBoard from '../layers/DrawingBoard';
import GlobalBottom from '../layers/GlobalBottom';
import PresenterLayout from '../layers/PresenterLayout';
import NavControls from '../layers/NavControls';
import PresentationOverlays from '../layers/PresentationOverlays';
import ThemePlaygroundPanel from '../tools/ThemePlaygroundPanel';
import { SPEAKER_NOTES } from '../../config/speakerNotes';
import { useSlideViewerOrchestrator } from '../../hooks/useSlideViewerOrchestrator';
import { storageKeys, clearLectureStorage } from '../../utils/presentationStorage';

interface PresentationModeViewProps {
  orchestrator: ReturnType<typeof useSlideViewerOrchestrator>;
}

interface PresentationModeContentProps {
  orchestrator: ReturnType<typeof useSlideViewerOrchestrator>;
  isThemePlaygroundOpen: boolean;
  setIsThemePlaygroundOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Presentational and overlay content component that lives inside the per-slide ClickStepsProvider.
 * useClickSteps and useClickStepsContext here read from the keyed provider,
 * so they always reflect the current slide's step state.
 */
const PresentationModeContent: React.FC<PresentationModeContentProps> = ({
  orchestrator,
  isThemePlaygroundOpen,
  setIsThemePlaygroundOpen,
}) => {
  const {
    activeSub,
    activeSession,
    activeLec,
    totalSlidesCount,
    activeSlide,
    viewMode,
    activeTheme,
    lectureId,
    viewerState,
    presenterFeatures,
    navigateWithTransition,
    changeSlideWithTransition,
    handleNextSection,
    handlePrevSection,
    handlePrevSlide,
    handleNextSlide,
    bgVariant,
    visibleSlideNumbers,
  } = orchestrator;

  const { currentClick, totalClicks } = useClickStepsContext();
  const clickSteps = useClickSteps(handlePrevSlide, handleNextSlide);
 
  // Cross-tab Presenter Navigation Sync via localStorage (Follower: only listens to updates)
  React.useEffect(() => {
    if (viewMode !== 'present' || !viewerState.isProjectionView) return;
    const activeSlideKey = storageKeys.activeSlide(lectureId || 'mock');
    const handleStorage = (e: StorageEvent) => {
      if (e.key === activeSlideKey && e.newValue !== null) {
        const nextSlide = parseInt(e.newValue, 10);
        if (!isNaN(nextSlide) && nextSlide !== activeSlide) {
          const direction = nextSlide < activeSlide ? 'backward' : 'forward';
          changeSlideWithTransition(nextSlide, direction);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [activeSlide, changeSlideWithTransition, viewMode, viewerState.isProjectionView, lectureId]);

  // Bind keyboard navigation shortcuts globally for standard and presenter views
  useNavShortcuts({
    onNext: clickSteps.handleNext,
    onPrev: clickSteps.handlePrev,
    onNextSection: handleNextSection,
    onPrevSection: handlePrevSection,
    onToggleFullscreen: viewerState.handleToggleFullscreen,
    onToggleOverview: () => presenterFeatures.setIsOverviewOpen(!presenterFeatures.isOverviewOpen),
    onToggleDark: presenterFeatures.handleToggleDark,
    onTogglePresenter: viewerState.handleTogglePresenter,
  });

  if (!activeSub || !activeLec) return null;

  const meta = getSlideMetadata(activeSlide, activeSub, activeLec);
  const isCoverPage = activeSlide === 1 || meta?.type === 'Thank You Slide';
  const currentNotes = SPEAKER_NOTES[activeSlide] || 'No presenter notes defined for this slide.';

  const mainSlideContent = (
    <PresentationContext.Provider value={{ theme: activeTheme, viewMode, activeSubStep: currentClick, slideNo: activeSlide }}>
      <div className="flex-1 w-full h-full relative" style={{ filter: presenterFeatures.filterStyle || undefined }}>
        <SlideContainer zoom={viewerState.isPresenterView ? 0.95 : 1} scaleMode={presenterFeatures.settings.scale}>
          <MorphingBackground variant={bgVariant} />
          
          <GlobalTop subjectName={activeSub.courseTitle} subjectCode={activeSub.courseCode} lectureTitle={activeLec.title} hide={isCoverPage} />
          <div className="flex-1 flex flex-col justify-center items-center px-4 pt-[20px] pb-[35px] text-center select-text relative z-10">
            <SlideRenderer slideNo={activeSlide} subject={activeSub} lecture={activeLec} session={activeSession} />
          </div>
          <DrawingBoard
            isActive={viewerState.isPenActive && !viewerState.isProjectionView && !viewerState.areDrawingsHidden}
            color={viewerState.penColor}
            brushWidth={viewerState.penWidth}
            activeTool={viewerState.activeTool}
            onActiveToolChange={viewerState.setActiveTool}
            lectureId={lectureId || 'mock'}
            slideNo={activeSlide}
            clearTrigger={viewerState.clearTrigger}
            areDrawingsHidden={viewerState.areDrawingsHidden}
          />
          <GlobalBottom current={visibleSlideNumbers.indexOf(activeSlide) + 1} total={totalSlidesCount} hide={isCoverPage} />
        </SlideContainer>
      </div>
    </PresentationContext.Provider>
  );

  const wrappedContent = viewerState.isPresenterView ? (
    <PresenterLayout
      currentSlide={activeSlide}
      totalSlides={totalSlidesCount}
      elapsed={viewerState.elapsed}
      timerRunning={viewerState.timerRunning}
      onToggleTimer={() => viewerState.setTimerRunning(!viewerState.timerRunning)}
      onResetTimer={() => viewerState.setElapsed(0)}
      currentNotes={currentNotes}
      activeSub={activeSub}
      activeLec={activeLec}
      activeSession={activeSession}
      currentClick={currentClick}
      totalClicks={totalClicks}
    >
      {mainSlideContent}
    </PresenterLayout>
  ) : (
    <div className="flex-1 h-full relative flex items-center justify-center overflow-hidden bg-background">
      {mainSlideContent}
    </div>
  );

  return (
    <>
      <PageMetadata title={activeLec.title} subjectCode={activeSub.courseCode} slideNo={activeSlide} />

      {wrappedContent}


      {isThemePlaygroundOpen && (
        <div className="h-full w-[380px] shrink-0 border-l border-border bg-background z-40 animate-in slide-in-from-right duration-300">
          <ThemePlaygroundPanel
            isOpen={isThemePlaygroundOpen}
            onClose={() => setIsThemePlaygroundOpen(false)}
            isInline={true}
          />
        </div>
      )}

      {!viewerState.isProjectionView && (
        <NavControls
          current={activeSlide}
          total={totalSlidesCount}
          onPrev={clickSteps.handlePrev}
          onNext={clickSteps.handleNext}
          isFullscreen={viewerState.isFullscreen}
          onToggleFullscreen={viewerState.handleToggleFullscreen}
          isCameraOpen={viewerState.isCameraOpen}
          onToggleCamera={() => viewerState.setIsCameraOpen(!viewerState.isCameraOpen)}
          isTimerOpen={viewerState.isTimerOpen}
          onToggleTimer={() => viewerState.setIsTimerOpen(!viewerState.isTimerOpen)}
          isRecording={viewerState.isRecording}
          onToggleRecording={() => viewerState.setIsRecording(!viewerState.isRecording)}
          isOverviewOpen={presenterFeatures.isOverviewOpen}
          onToggleOverview={() => presenterFeatures.setIsOverviewOpen(!presenterFeatures.isOverviewOpen)}
          isSettingsOpen={presenterFeatures.isSettingsOpen}
          onToggleSettings={() => presenterFeatures.setIsSettingsOpen(!presenterFeatures.isSettingsOpen)}
          isDark={presenterFeatures.isDark}
          onToggleDark={presenterFeatures.handleToggleDark}
          isPresenterView={viewerState.isPresenterView}
          onTogglePresenter={viewerState.handleTogglePresenter}
          isPenActive={viewerState.isPenActive}
          onPenActiveChange={viewerState.setIsPenActive}
          penColor={viewerState.penColor}
          onPenColorChange={viewerState.setPenColor}
          penWidth={viewerState.penWidth}
          onPenWidthChange={viewerState.setPenWidth}
          activeTool={viewerState.activeTool}
          onActiveToolChange={viewerState.setActiveTool}
          onClearDrawing={() => viewerState.setClearTrigger((c) => c + 1)}
          areDrawingsHidden={viewerState.areDrawingsHidden}
          onToggleDrawingsHidden={viewerState.handleToggleDrawingsHidden}
          onNextSection={handleNextSection}
          onPrevSection={handlePrevSection}
          onExit={() => {
            viewerState.closeProjectionWindow();
            if (lectureId) {
              clearLectureStorage(lectureId);
            }
            navigateWithTransition(`/${activeSub.id}/${activeSession?.id}/${activeLec.id}?slide=${activeSlide}`);
          }}
          isThemePlaygroundOpen={isThemePlaygroundOpen}
          onToggleThemePlayground={() => setIsThemePlaygroundOpen(!isThemePlaygroundOpen)}
        />
      )}

      <PresentationOverlays
        isProjectionView={viewerState.isProjectionView}
        isCameraOpen={viewerState.isCameraOpen}
        isTimerOpen={viewerState.isTimerOpen}
        isRecording={viewerState.isRecording}
        setIsRecording={viewerState.setIsRecording}
        lectureId={lectureId || 'mock'}
        durationMins={activeLec.durationMins}
        contextMenu={presenterFeatures.contextMenu}
        setContextMenu={presenterFeatures.setContextMenu}
        currentSlide={activeSlide}
        totalSlides={totalSlidesCount}
        onPrev={clickSteps.handlePrev}
        onNext={clickSteps.handleNext}
        isDark={presenterFeatures.isDark}
        onToggleDark={presenterFeatures.handleToggleDark}
        isFullscreen={viewerState.isFullscreen}
        onToggleFullscreen={viewerState.handleToggleFullscreen}
        isLaserActive={presenterFeatures.isLaserActive}
        onToggleLaser={() => presenterFeatures.setIsLaserActive(!presenterFeatures.isLaserActive)}
        isPenActive={viewerState.isPenActive}
        onTogglePen={() => viewerState.setIsPenActive(!viewerState.isPenActive)}
        isEraser={viewerState.isEraser}
        onToggleEraser={() => viewerState.setIsEraser(!viewerState.isEraser)}
        isOverviewOpen={presenterFeatures.isOverviewOpen}
        onToggleOverview={() => presenterFeatures.setIsOverviewOpen(!presenterFeatures.isOverviewOpen)}
        isPresenterView={viewerState.isPresenterView}
        onTogglePresenter={viewerState.handleTogglePresenter}
        isSettingsOpen={presenterFeatures.isSettingsOpen}
        onCloseSettings={() => presenterFeatures.setIsSettingsOpen(false)}
        settings={presenterFeatures.settings}
        onSettingsChange={presenterFeatures.handleSettingsChange}
        onSelectSlide={(num) => {
          changeSlideWithTransition(num);
          presenterFeatures.setIsOverviewOpen(false);
        }}
        activeSub={activeSub}
        activeLec={activeLec}
        activeSession={activeSession}
        isThemePlaygroundOpen={isThemePlaygroundOpen}
        onToggleThemePlayground={() => setIsThemePlaygroundOpen(!isThemePlaygroundOpen)}
      />
    </>
  );
};

/**
 * PresentationModeInner keeps the outer container element stable (meaning it does not
 * unmount during slide change) while recreating the per-slide ClickStepsProvider context.
 */
const PresentationModeInner: React.FC<PresentationModeViewProps> = ({ orchestrator }) => {
  const [isThemePlaygroundOpen, setIsThemePlaygroundOpen] = React.useState(false);
  const { activeSlide, slideDirectionRef, viewerState, presenterFeatures } = orchestrator;

  const content = (
    <ClickStepsProvider
      key={activeSlide}
      slideNo={activeSlide}
      initialClick={slideDirectionRef.current === 'backward' ? 999 : 0}
    >
      <PresentationModeContent
        orchestrator={orchestrator}
        isThemePlaygroundOpen={isThemePlaygroundOpen}
        setIsThemePlaygroundOpen={setIsThemePlaygroundOpen}
      />
    </ClickStepsProvider>
  );

  return (
    <div
      ref={viewerState.outerRef}
      onContextMenu={viewerState.isProjectionView ? undefined : presenterFeatures.handleContextMenu}
      className="relative flex h-screen w-screen flex-row overflow-hidden bg-background"
      data-slide-viewer
    >
      {content}
    </div>
  );
};

/**
 * Main wrapper view for presentation mode slides.
 */
export const PresentationModeView: React.FC<PresentationModeViewProps> = ({ orchestrator }) => {
  return <PresentationModeInner orchestrator={orchestrator} />;
};

export default PresentationModeView;
