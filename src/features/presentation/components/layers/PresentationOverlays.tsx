import React from 'react';
import CameraOverlay from '../tools/CameraOverlay';
import PresentationTimer from '../tools/PresentationTimer';
import PresentationRecorder from '../tools/PresentationRecorder';
import ContextMenu from '../tools/ContextMenu';
import SettingsPopover from './SettingsPopover';
import OverviewModal from './OverviewModal';
import LaserPointer from './LaserPointer';
import type { Subject, Lecture, Session } from '@/config/lectures';

interface PresentationOverlaysProps {
  isProjectionView: boolean;
  isCameraOpen: boolean;
  isTimerOpen: boolean;
  isRecording: boolean;
  setIsRecording: (rec: boolean) => void;
  lectureId: string;
  durationMins: number;

  contextMenu: { x: number; y: number; isOpen: boolean } | null;
  setContextMenu: (menu: { x: number; y: number; isOpen: boolean } | null) => void;
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isLaserActive: boolean;
  onToggleLaser: () => void;
  isPenActive: boolean;
  onTogglePen: () => void;
  isEraser: boolean;
  onToggleEraser: () => void;
  isOverviewOpen: boolean;
  onToggleOverview: () => void;
  isPresenterView: boolean;
  onTogglePresenter: () => void;

  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
  onSelectSlide: (num: number) => void;
  activeSub: Subject;
  activeLec: Lecture;
  activeSession?: Session;

  isThemePlaygroundOpen: boolean;
  onToggleThemePlayground: () => void;
}

export const PresentationOverlays: React.FC<PresentationOverlaysProps> = ({
  isProjectionView,
  isCameraOpen,
  isTimerOpen,
  isRecording,
  setIsRecording,
  lectureId,
  durationMins,
  contextMenu,
  setContextMenu,
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  isDark,
  onToggleDark,
  isFullscreen,
  onToggleFullscreen,
  isLaserActive,
  onToggleLaser,
  isPenActive,
  onTogglePen,
  isEraser,
  onToggleEraser,
  isOverviewOpen,
  onToggleOverview,
  isPresenterView,
  onTogglePresenter,
  isSettingsOpen,
  onCloseSettings,
  settings,
  onSettingsChange,
  onSelectSlide,
  activeSub,
  activeLec,
  activeSession,
  onToggleThemePlayground,
}) => {
  if (isProjectionView) {
    return <LaserPointer active={isLaserActive} />;
  }

  return (
    <>
      <CameraOverlay isOpen={isCameraOpen} />
      <PresentationTimer durationMins={durationMins} isOpen={isTimerOpen} />
      <PresentationRecorder isRecording={isRecording} onRecordingChange={setIsRecording} lectureId={lectureId} />

      {contextMenu?.isOpen && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrev={onPrev}
          onNext={onNext}
          isDark={isDark}
          onToggleDark={onToggleDark}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          isLaser={isLaserActive}
          onToggleLaser={onToggleLaser}
          isPen={isPenActive}
          onTogglePen={onTogglePen}
          isEraser={isEraser}
          onToggleEraser={onToggleEraser}
          isOverview={isOverviewOpen}
          onToggleOverview={onToggleOverview}
          isPresenterView={isPresenterView}
          onTogglePresenter={onTogglePresenter}
        />
      )}

      {isSettingsOpen && (
        <SettingsPopover
          settings={settings}
          onSettingsChange={onSettingsChange}
          onClose={onCloseSettings}
          onOpenThemePlayground={onToggleThemePlayground}
        />
      )}

      <OverviewModal
        isOpen={isOverviewOpen}
        onClose={() => onToggleOverview()}
        totalSlides={totalSlides}
        onSelectSlide={onSelectSlide}
        activeSub={activeSub}
        activeLec={activeLec}
        activeSession={activeSession}
      />

      <LaserPointer active={isLaserActive} />
    </>
  );
};

export default PresentationOverlays;
