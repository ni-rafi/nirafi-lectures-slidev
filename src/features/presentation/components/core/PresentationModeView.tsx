import React from 'react';
import PageMetadata from './PageMetadata';
import { PresentationContext } from '../../context/PresentationContext';
import SlideContainer from './SlideContainer';
import MorphingBackground from '../../../../shared/components/MorphingBackground';
import GlobalTop from '../layers/GlobalTop';
import SlideRenderer from '../slides/SlideRenderer';
import DrawingBoard from '../layers/DrawingBoard';
import GlobalBottom from '../layers/GlobalBottom';
import PresenterLayout from '../layers/PresenterLayout';
import NavControls from '../layers/NavControls';
import PresentationOverlays from '../layers/PresentationOverlays';
import ThemePlaygroundPanel from '../tools/ThemePlaygroundPanel';
import { SPEAKER_NOTES } from '../../config/speakerNotes';
import { useSlideViewerOrchestrator } from '../../hooks/useSlideViewerOrchestrator';

interface PresentationModeViewProps {
  orchestrator: ReturnType<typeof useSlideViewerOrchestrator>;
}

export const PresentationModeView: React.FC<PresentationModeViewProps> = ({ orchestrator }) => {
  const [isThemePlaygroundOpen, setIsThemePlaygroundOpen] = React.useState(false);
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
    clickSteps,
    navigateWithTransition,
    changeSlideWithTransition,
    handleNextSection,
    handlePrevSection,
    bgVariant,
  } = orchestrator;

  if (!activeSub || !activeLec) return null;

  const isCoverPage = activeSlide === 1;
  const currentNotes = SPEAKER_NOTES[activeSlide] || 'No presenter notes defined for this slide.';

  const mainSlideContent = (
    <PresentationContext.Provider value={{ theme: activeTheme, viewMode, activeSubStep: clickSteps.currentClick }}>
      <div className="flex-1 w-full h-full relative" style={{ filter: presenterFeatures.filterStyle || undefined }}>
        <SlideContainer zoom={viewerState.isPresenterView ? 0.95 : 1} scaleMode={presenterFeatures.settings.scale}>
          <MorphingBackground variant={bgVariant} />
          
          <GlobalTop subjectName={activeSub.courseTitle} subjectCode={activeSub.courseCode} lectureTitle={activeLec.title} hide={isCoverPage} />
          <div className="flex-1 flex flex-col justify-center items-center px-4 pt-[20px] pb-[22px] text-center select-text relative z-10">
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
          <GlobalBottom current={activeSlide} total={totalSlidesCount} hide={isCoverPage} />
        </SlideContainer>
      </div>
    </PresentationContext.Provider>
  );

  if (viewerState.isPresenterView) {
    return (
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
        currentClick={clickSteps.currentClick}
        totalClicks={clickSteps.totalClicks}
      >
        {mainSlideContent}
      </PresenterLayout>
    );
  }

  return (
    <div
      ref={viewerState.outerRef}
      onContextMenu={viewerState.isProjectionView ? undefined : presenterFeatures.handleContextMenu}
      className="relative flex h-screen w-screen flex-row overflow-hidden bg-background"
      data-slide-viewer
    >
      <PageMetadata title={activeLec.title} subjectCode={activeSub.courseCode} slideNo={activeSlide} />

      <div className="flex-1 h-full relative flex items-center justify-center overflow-hidden bg-background">
        {mainSlideContent}
      </div>

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
          onExit={() => navigateWithTransition(`/${activeSub.id}/${activeSession?.id}/${activeLec.id}`)}
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
    </div>
  );
};

export default PresentationModeView;
