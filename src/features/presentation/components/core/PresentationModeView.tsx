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
import { SPEAKER_NOTES } from '../../config/speakerNotes';
import { useSlideViewerOrchestrator } from '../../hooks/useSlideViewerOrchestrator';

interface PresentationModeViewProps {
  orchestrator: ReturnType<typeof useSlideViewerOrchestrator>;
}

export const PresentationModeView: React.FC<PresentationModeViewProps> = ({ orchestrator }) => {
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
          
          <GlobalTop subjectName={activeSub.title} subjectCode={activeSub.code} lectureTitle={activeLec.title} hide={isCoverPage} />
          <div className="flex-1 flex flex-col justify-center items-center px-12 py-10 text-center select-text relative z-10">
            <SlideRenderer slideNo={activeSlide} subject={activeSub} lecture={activeLec} session={activeSession} />
          </div>
          <DrawingBoard
            isActive={viewerState.isPenActive && !viewerState.isProjectionView}
            color={viewerState.penColor}
            brushWidth={viewerState.penWidth}
            activeTool={viewerState.activeTool}
            onActiveToolChange={viewerState.setActiveTool}
            lectureId={lectureId || 'mock'}
            slideNo={activeSlide}
            clearTrigger={viewerState.clearTrigger}
          />
          <GlobalBottom current={activeSlide} total={totalSlidesCount} hide={isCoverPage} />
        </SlideContainer>
      </div>
    </PresentationContext.Provider>
  );

  return (
    <div
      ref={viewerState.outerRef}
      onContextMenu={viewerState.isProjectionView ? undefined : presenterFeatures.handleContextMenu}
      className="relative flex h-screen w-full flex-col items-center justify-center bg-background"
      data-slide-viewer
    >
      <PageMetadata title={activeLec.title} subjectCode={activeSub.code} slideNo={activeSlide} />

      {viewerState.isPresenterView && !viewerState.isProjectionView ? (
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
      ) : (
        <div className="flex-1 w-full h-full relative">{mainSlideContent}</div>
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
          onNextSection={handleNextSection}
          onPrevSection={handlePrevSection}
          onExit={() => navigateWithTransition(`/${activeSub.id}/${activeSession?.id}/${activeLec.id}`)}
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
      />
    </div>
  );
};

export default PresentationModeView;
