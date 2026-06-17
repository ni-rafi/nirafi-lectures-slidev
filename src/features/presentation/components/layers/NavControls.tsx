import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Camera,
  Timer,
  Video,
  LayoutGrid,
  Sun,
  Moon,
  Presentation,
  SlidersHorizontal,
  PenTool,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DrawingDrawer from './DrawingDrawer';
import SlideNavigation from './SlideNavigation';
import { useNavShortcuts } from '../../hooks/useNavShortcuts';

interface NavControlsProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isCameraOpen: boolean;
  onToggleCamera: () => void;
  isTimerOpen: boolean;
  onToggleTimer: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  isOverviewOpen: boolean;
  onToggleOverview: () => void;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isPresenterView: boolean;
  onTogglePresenter: () => void;
  onNextSection?: () => void;
  onPrevSection?: () => void;
  onExit?: () => void;

  // Drawing Tools (Passed to DrawingDrawer)
  isPenActive: boolean;
  onPenActiveChange: (active: boolean) => void;
  penColor: string;
  onPenColorChange: (color: string) => void;
  penWidth: number;
  onPenWidthChange: (width: number) => void;
  activeTool: 'select' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle';
  onActiveToolChange: (tool: 'select' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle') => void;
  onClearDrawing: () => void;
}

/**
 * NavControls renders the unified presentation toolbar in the bottom-left corner.
 * Auto-hides in fullscreen mode, showing on hover over the bottom-left sensor area.
 * Hosts an expandable drawing drawer panel when pen mode is active.
 */
export const NavControls: React.FC<NavControlsProps> = ({
  current,
  total,
  onPrev,
  onNext,
  isFullscreen,
  onToggleFullscreen,
  isCameraOpen,
  onToggleCamera,
  isTimerOpen,
  onToggleTimer,
  isRecording,
  onToggleRecording,
  isOverviewOpen,
  onToggleOverview,
  isSettingsOpen,
  onToggleSettings,
  isDark,
  onToggleDark,
  isPresenterView,
  onTogglePresenter,
  onNextSection,
  onPrevSection,
  onExit,
  isPenActive,
  onPenActiveChange,
  penColor,
  onPenColorChange,
  penWidth,
  onPenWidthChange,
  activeTool,
  onActiveToolChange,
  onClearDrawing,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSensor, setIsHoveredSensor] = useState(false);

  // Bind keyboard navigation shortcuts
  useNavShortcuts({
    onNext,
    onPrev,
    onNextSection,
    onPrevSection,
    onToggleFullscreen,
    onToggleOverview,
    onToggleDark,
    onTogglePresenter,
  });



  const showToolbar = !isFullscreen || isHovered || isHoveredSensor;

  return (
    <>
      {/* Fullscreen hover sensor zone spanning the entire bottom width */}
      {isFullscreen && (
        <div
          className="fixed bottom-0 left-0 h-20 w-full z-[39]"
          onMouseEnter={() => setIsHoveredSensor(true)}
          onMouseLeave={() => setIsHoveredSensor(false)}
        />
      )}

      {/* Main floating container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-4 left-4 z-40 flex flex-col gap-2 items-start transition-all duration-300 ease-in-out ${
          showToolbar
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-[calc(100%+24px)] opacity-0 scale-95 pointer-events-none'
        }`}
        data-nav-controls
      >
        {/* Expanded drawing drawer panel */}
        {isPenActive && (
          <DrawingDrawer
            penColor={penColor}
            onPenColorChange={onPenColorChange}
            penWidth={penWidth}
            onPenWidthChange={onPenWidthChange}
            activeTool={activeTool}
            onActiveToolChange={onActiveToolChange}
            onClearDrawing={onClearDrawing}
          />
        )}

        {/* Main controls bar */}
        <div className="flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-background/95">
          <SlideNavigation
            current={current}
            total={total}
            onPrev={onPrev}
            onNext={onNext}
            onExit={onExit}
          />

          <div className="h-4 w-px bg-border mx-0.5" />

          {/* Toggle Quick Overview */}
          <Button
            variant={isOverviewOpen ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onToggleOverview}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="Overview (O)"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>

          {/* Toggle Drawing Mode Pen */}
          <Button
            variant={isPenActive ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onPenActiveChange(!isPenActive)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="Toggle Drawing Pen"
          >
            <PenTool className="h-4 w-4" />
          </Button>

          {/* Toggle Dark Mode */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="Toggle Dark Mode (D)"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Presenter Timer */}
          <Button
            variant={isTimerOpen ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onToggleTimer}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="Lecture Timer"
          >
            <Timer className="h-4 w-4" />
          </Button>

          {/* Camera Overlay */}
          <Button
            variant={isCameraOpen ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onToggleCamera}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="Camera Overlay"
          >
            <Camera className="h-4 w-4" />
          </Button>

          {/* Screen Recorder */}
          <Button
            variant={isRecording ? 'default' : 'ghost'}
            size="icon"
            onClick={onToggleRecording}
            className={`h-8 w-8 rounded-full ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            <Video className="h-4 w-4" />
          </Button>

          {/* Presenter View */}
          <Button
            variant={isPresenterView ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onTogglePresenter}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title={isPresenterView ? 'Exit Presenter View (P)' : 'Enter Presenter View (P)'}
          >
            <Presentation className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button
            variant={isSettingsOpen ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onToggleSettings}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="More Options"
            data-settings-btn
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-border mx-0.5" />

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default NavControls;
