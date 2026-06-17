import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECTS } from '@/config/lectures';
import { SPEAKER_NOTES } from '../config/speakerNotes';
import SlideContainer from './SlideContainer';
import GlobalTop from './layers/GlobalTop';
import GlobalBottom from './layers/GlobalBottom';
import NavControls from './layers/NavControls';
import PageMetadata from './PageMetadata';
import { useClickSteps } from '../hooks/useClickSteps';
import DrawingBoard from './layers/DrawingBoard';
import SlideRenderer from './slides/SlideRenderer';
import { usePresenterFeatures } from '../hooks/usePresenterFeatures';
import PresenterLayout from './layers/PresenterLayout';
import PresentationOverlays from './layers/PresentationOverlays';
import { useSlideViewerState } from '../hooks/useSlideViewerState';

export const SlideViewer: React.FC = () => {
  const { subjectId, sessionId, lectureId, slideNo } = useParams<Record<string, string>>();
  const navigate = useNavigate();
  const currentSlideInt = slideNo ? parseInt(slideNo, 10) : 1;

  const activeSub = SUBJECTS.find((sub) => sub.id === subjectId);
  const activeSession = activeSub?.sessions.find((sess) => sess.id === sessionId);
  const activeLec = activeSession?.lectures.find((lec) => lec.id === lectureId);
  const totalSlidesCount = 10;

  const {
    outerRef, isFullscreen, isPenActive, setIsPenActive, penColor, setPenColor,
    penWidth, setPenWidth, isEraser, setIsEraser, clearTrigger, setClearTrigger,
    isCameraOpen, setIsCameraOpen, isTimerOpen, setIsTimerOpen, isRecording,
    setIsRecording, isPresenterView, elapsed, setElapsed, timerRunning,
    setTimerRunning, isProjectionView, handleToggleFullscreen, handleTogglePresenter,
  } = useSlideViewerState({ subjectId, sessionId, lectureId, currentSlideInt });

  const {
    settings, contextMenu, setContextMenu, isOverviewOpen, setIsOverviewOpen,
    isSettingsOpen, setIsSettingsOpen, isLaserActive, setIsLaserActive, isDark,
    handleToggleDark, handleSettingsChange, handleContextMenu, filterStyle,
  } = usePresenterFeatures({ subjectId, sessionId, lectureId, currentSlideInt });

  if (!activeSub || !activeLec) {
    return <div className="flex h-64 items-center justify-center text-sm text-destructive">Lecture deck not found.</div>;
  }

  const handlePrevSlide = () => {
    if (currentSlideInt > 1) {
      navigate(`/${subjectId}/${sessionId}/${lectureId}/${currentSlideInt - 1}`, { state: { clicks: 'max' } });
    }
  };

  const handleNextSlide = () => {
    if (currentSlideInt < totalSlidesCount) {
      navigate(`/${subjectId}/${sessionId}/${lectureId}/${currentSlideInt + 1}`);
    }
  };

  const { handlePrev, handleNext, currentClick, totalClicks } = useClickSteps(handlePrevSlide, handleNextSlide);

  const isCoverPage = currentSlideInt === 1;
  const currentNotes = SPEAKER_NOTES[currentSlideInt] || 'No presenter notes defined for this slide.';

  const mainSlideContent = (
    <div className="flex-1 w-full h-full relative" style={{ filter: filterStyle || undefined }}>
      <SlideContainer zoom={isPresenterView ? 0.95 : 1} scaleMode={settings.scale}>
        <GlobalTop subjectName={activeSub.title} subjectCode={activeSub.code} lectureTitle={activeLec.title} hide={isCoverPage} />
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-10 text-center select-text">
          <SlideRenderer slideNo={currentSlideInt} subject={activeSub} lecture={activeLec} session={activeSession} />
        </div>
        <DrawingBoard
          isActive={isPenActive && !isProjectionView} color={penColor} brushWidth={penWidth} isEraser={isEraser}
          lectureId={lectureId || 'mock'} slideNo={currentSlideInt} clearTrigger={clearTrigger}
        />
        <GlobalBottom current={currentSlideInt} total={totalSlidesCount} hide={isCoverPage} />
      </SlideContainer>
    </div>
  );

  return (
    <div
      ref={outerRef}
      onContextMenu={isProjectionView ? undefined : handleContextMenu}
      className="relative flex h-screen w-full flex-col items-center justify-center bg-background"
      data-slide-viewer
    >
      <PageMetadata title={activeLec.title} subjectCode={activeSub.code} slideNo={currentSlideInt} />

      {isPresenterView && !isProjectionView ? (
        <PresenterLayout
          currentSlide={currentSlideInt}
          totalSlides={totalSlidesCount}
          elapsed={elapsed}
          timerRunning={timerRunning}
          onToggleTimer={() => setTimerRunning(!timerRunning)}
          onResetTimer={() => setElapsed(0)}
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
        <div className="flex-1 w-full h-full relative">{mainSlideContent}</div>
      )}

      {!isProjectionView && (
        <NavControls
          current={currentSlideInt} total={totalSlidesCount} onPrev={handlePrev} onNext={handleNext}
          isFullscreen={isFullscreen} onToggleFullscreen={handleToggleFullscreen}
          isCameraOpen={isCameraOpen} onToggleCamera={() => setIsCameraOpen(!isCameraOpen)}
          isTimerOpen={isTimerOpen} onToggleTimer={() => setIsTimerOpen(!isTimerOpen)}
          isRecording={isRecording} onToggleRecording={() => setIsRecording(!isRecording)}
          isOverviewOpen={isOverviewOpen} onToggleOverview={() => setIsOverviewOpen(!isOverviewOpen)}
          isSettingsOpen={isSettingsOpen} onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          isDark={isDark} onToggleDark={handleToggleDark} isPresenterView={isPresenterView} onTogglePresenter={handleTogglePresenter}
          isPenActive={isPenActive} onPenActiveChange={setIsPenActive} penColor={penColor} onPenColorChange={setPenColor}
          penWidth={penWidth} onPenWidthChange={setPenWidth} isEraser={isEraser} onEraserChange={setIsEraser}
          onClearDrawing={() => setClearTrigger((c) => c + 1)}
        />
      )}

      <PresentationOverlays
        isProjectionView={isProjectionView}
        isCameraOpen={isCameraOpen}
        isTimerOpen={isTimerOpen}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        lectureId={lectureId || 'mock'}
        durationMins={activeLec.durationMins}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        currentSlide={currentSlideInt}
        totalSlides={totalSlidesCount}
        onPrev={handlePrev}
        onNext={handleNext}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isLaserActive={isLaserActive}
        onToggleLaser={() => setIsLaserActive(!isLaserActive)}
        isPenActive={isPenActive}
        onTogglePen={() => setIsPenActive(!isPenActive)}
        isEraser={isEraser}
        onToggleEraser={() => setIsEraser(!isEraser)}
        isOverviewOpen={isOverviewOpen}
        onToggleOverview={() => setIsOverviewOpen(!isOverviewOpen)}
        isPresenterView={isPresenterView}
        onTogglePresenter={handleTogglePresenter}
        isSettingsOpen={isSettingsOpen}
        onCloseSettings={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onSelectSlide={(num) => {
          navigate(`/${subjectId}/${sessionId}/${lectureId}/${num}`);
          setIsOverviewOpen(false);
        }}
        activeSub={activeSub}
        activeLec={activeLec}
        activeSession={activeSession}
      />
    </div>
  );
};

export default SlideViewer;
