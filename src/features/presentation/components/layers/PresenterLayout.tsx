import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import SlideContainer from '../SlideContainer';
import SlideRenderer from '../slides/SlideRenderer';
import { ClickStepsProvider, ClickStepsContext, useClickStepsContext } from '../../context/ClickStepsContext';

interface PresenterLayoutProps {
  currentSlide: number;
  totalSlides: number;
  elapsed: number;
  timerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  currentNotes: string;
  activeSub: any;
  activeLec: any;
  activeSession: any;
  currentClick: number;
  totalClicks: number;
  children: React.ReactNode;
}

export const PresenterLayout: React.FC<PresenterLayoutProps> = ({
  currentSlide,
  totalSlides,
  elapsed,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  currentNotes,
  activeSub,
  activeLec,
  activeSession,
  currentClick,
  totalClicks,
  children,
}) => {
  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const parentContext = useClickStepsContext();
  const customContextValue = React.useMemo(() => {
    return {
      ...parentContext,
      currentClick,
    };
  }, [parentContext, currentClick]);

  return (
    <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-muted/10 min-h-0 select-none">
      {/* Left Column: Interactive Main Slide */}
      <div className="lg:col-span-8 flex flex-col bg-background border rounded-2xl shadow-lg overflow-hidden relative min-h-0">
        <ClickStepsContext.Provider value={customContextValue}>
          {children}
        </ClickStepsContext.Provider>
      </div>

      {/* Right Column: Speaker Controls & Previews */}
      <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
        {/* Header: Slide progress & Timer */}
        <div className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-muted-foreground">Slide Progress</span>
            <span className="text-sm font-bold font-mono">Slide {currentSlide} / {totalSlides}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-1.5 shadow-inner">
            <span className="font-mono text-sm font-bold tracking-wider">{formatTime(elapsed)}</span>
            <div className="flex gap-1 border-l pl-2">
              <button
                onClick={onToggleTimer}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={onResetTimer}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Slide Preview (Top half of Right column) */}
        <div className="flex-1 flex flex-col min-h-0 bg-background border rounded-2xl p-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 pt-1">
            {currentClick < totalClicks ? 'Next Reveal Step' : 'Next Slide'}
          </span>
          <div className="flex-1 min-h-0 relative">
            {currentClick < totalClicks ? (
              <div className="relative border rounded-xl bg-background/50 p-2 overflow-hidden flex items-center justify-center h-full w-full opacity-80 shadow-inner">
                <SlideContainer zoom={0.8}>
                  <div className="flex-1 flex flex-col justify-center items-center scale-90 select-none pointer-events-none">
                    <ClickStepsProvider currentClickOverride={currentClick + 1}>
                      <SlideRenderer slideNo={currentSlide} subject={activeSub} lecture={activeLec} session={activeSession} />
                    </ClickStepsProvider>
                  </div>
                </SlideContainer>
              </div>
            ) : currentSlide < totalSlides ? (
              <div className="relative border rounded-xl bg-background/50 p-2 overflow-hidden flex items-center justify-center h-full w-full opacity-80 shadow-inner">
                <SlideContainer zoom={0.8}>
                  <div className="flex-1 flex flex-col justify-center items-center scale-90 select-none pointer-events-none">
                    <ClickStepsProvider currentClickOverride={0}>
                      <SlideRenderer slideNo={currentSlide + 1} subject={activeSub} lecture={activeLec} session={activeSession} />
                    </ClickStepsProvider>
                  </div>
                </SlideContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full border rounded-xl bg-muted/20 text-xs text-muted-foreground font-semibold">
                End of slide deck
              </div>
            )}
          </div>
        </div>

        {/* Speaker Notes (Bottom half of Right column) */}
        <div className="flex-1 min-h-0">
          <div className="flex flex-col h-full border rounded-xl bg-card p-4 overflow-y-auto shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Speaker Notes</span>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap select-text">{currentNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenterLayout;
