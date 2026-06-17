import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SUBJECTS } from '@/config/lectures';
import SlideContainer from './SlideContainer';
import GlobalTop from './layers/GlobalTop';
import GlobalBottom from './layers/GlobalBottom';
import NavControls from './layers/NavControls';
import PageMetadata from './PageMetadata';
import { useClickStepsContext } from '../context/ClickStepsContext';
import { useClickSteps } from '../hooks/useClickSteps';
import ClickRevealGroup from './ClickRevealGroup';
import Draggable from './Draggable';
import DraggableArrow from './DraggableArrow';
import DrawingBoard from './layers/DrawingBoard';
import DrawingToolbar from './layers/DrawingToolbar';

/**
 * SlideViewer manages interactive slide deck presentation navigation,
 * fullscreen operations, head metadata synchronization, and layouts.
 */
export const SlideViewer: React.FC = () => {
  const { subjectId, sessionId, lectureId, slideNo } = useParams<{
    subjectId: string;
    sessionId: string;
    lectureId: string;
    slideNo: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const outerRef = useRef<HTMLDivElement | null>(null);
  const currentSlideInt = slideNo ? parseInt(slideNo, 10) : 1;

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drawing & annotation board states
  const [isPenActive, setIsPenActive] = useState(false);
  const [penColor, setPenColor] = useState('#ef4444');
  const [penWidth, setPenWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Retrieve subject & lecture metadata
  const activeSub = SUBJECTS.find((sub) => sub.id === subjectId);
  const activeSession = activeSub?.sessions.find((sess) => sess.id === sessionId);
  const activeLec = activeSession?.lectures.find((lec) => lec.id === lectureId);

  const totalSlidesCount = 10; // Fixed slides count for navigation jump

  // Access slide click steps context
  const { resetClicks, totalClicks, setClick } = useClickStepsContext();

  // Reset clicks registry when active page shifts
  useEffect(() => {
    resetClicks();
  }, [slideNo, lectureId, resetClicks]);

  // Handle backward transition to start fully revealed
  const isBackward = location.state?.clicks === 'max';
  useEffect(() => {
    if (isBackward && totalClicks > 0) {
      setClick(totalClicks);
    }
  }, [isBackward, totalClicks, setClick]);

  // Fullscreen event listener sync
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  if (!activeSub || !activeLec) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-destructive">
        Lecture deck not found.
      </div>
    );
  }

  // Slide changing handlers (boundaries)
  const handlePrevSlide = () => {
    if (currentSlideInt > 1) {
      navigate(`/${subjectId}/${sessionId}/${lectureId}/${currentSlideInt - 1}`, {
        state: { clicks: 'max' },
      });
    }
  };

  const handleNextSlide = () => {
    if (currentSlideInt < totalSlidesCount) {
      navigate(`/${subjectId}/${sessionId}/${lectureId}/${currentSlideInt + 1}`);
    }
  };

  // Bind click steps progression hooks
  const { handlePrev, handleNext } = useClickSteps(handlePrevSlide, handleNextSlide);

  const handleToggleFullscreen = async () => {
    if (!outerRef.current) {
      return;
    }
    try {
      if (!document.fullscreenElement) {
        await outerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Failed to switch fullscreen mode:', err);
    }
  };

  const isCoverPage = currentSlideInt === 1;

  // Slide layouts renderer helper
  const renderSlideContent = () => {
    if (isCoverPage) {
      return (
        <div className="flex flex-col gap-3 animate-fade-in">
          <span className="text-[10px] tracking-widest text-primary uppercase font-mono font-bold">
            {activeSub.code} Lecture Series
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight max-w-2xl text-foreground">
            {activeLec.title}
          </h2>
          <p className="text-xs text-muted-foreground/90 max-w-md mx-auto">
            {activeLec.description}
          </p>
          <div className="mt-4 text-[10px] font-semibold text-muted-foreground font-mono">
            Session: {activeSession?.label}
          </div>
        </div>
      );
    }

    if (currentSlideInt === 3) {
      // Interactive Draggable sandbox elements slide layout
      return (
        <div className="relative w-full h-full flex flex-col justify-start text-left px-8 py-10">
          <div className="max-w-md flex flex-col gap-1.5 mb-2">
            <h3 className="text-xl font-bold text-foreground">
              Slide 3: Interactive Positioning Elements
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Draggable widgets let presenters draw overlays, arrange structural diagrams, or nudge labels dynamically inside the canvas sandbox.
            </p>
          </div>

          {/* Draggable demonstration cards */}
          <DraggableArrow initialPos={{ x: 80, y: 220, w: 180, h: 40 }} />
          
          <Draggable
            initialPos={{ x: 400, y: 160, w: 220, h: 100 }}
            className="p-4 border bg-amber-500/10 border-amber-500/30 text-amber-500 rounded-xl text-xs flex flex-col justify-center items-center shadow-md select-none"
          >
            <span className="font-bold text-[10px] uppercase font-mono tracking-wider mb-1">
              Draggable Box Widget
            </span>
            <span className="text-center leading-normal text-muted-foreground">
              Grab me to slide, or double-click to select and nudge with Arrow keys!
            </span>
          </Draggable>
        </div>
      );
    }

    // Default concept layout slide
    return (
      <div className="flex flex-col gap-4 animate-fade-in w-full text-left max-w-xl">
        <h3 className="text-xl font-bold text-foreground">
          Slide {currentSlideInt}: Core Concepts
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>
        
        {/* Sequential animations checklist */}
        <ClickRevealGroup
          preset="up"
          className="list-disc pl-5 text-xs text-muted-foreground/90 flex flex-col gap-1.5"
        >
          <li>Volumetric estimation equations in meters</li>
          <li>Allowance parameters for wastage coefficients</li>
          <li>Interactive formulas testing</li>
        </ClickRevealGroup>
      </div>
    );
  };

  return (
    <div
      ref={outerRef}
      className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-background"
      data-slide-viewer
    >
      {/* Page Title & Head Sync */}
      <PageMetadata
        title={activeLec.title}
        subjectCode={activeSub.code}
        slideNo={currentSlideInt}
      />

      {/* Sandboxed Slide Canvas wrapper */}
      <SlideContainer zoom={1}>
        {/* Persistent Top Header banner */}
        <GlobalTop
          subjectName={activeSub.title}
          subjectCode={activeSub.code}
          lectureTitle={activeLec.title}
          hide={isCoverPage}
        />

        {/* Dynamic Slide Layout rendering based on active index */}
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-10 text-center select-text">
          {renderSlideContent()}
        </div>

        {/* Transparent drawing overlay sheet */}
        <DrawingBoard
          isActive={isPenActive}
          color={penColor}
          brushWidth={penWidth}
          isEraser={isEraser}
          lectureId={lectureId || 'mock'}
          slideNo={currentSlideInt}
          clearTrigger={clearTrigger}
        />

        {/* Persistent Bottom Footer & numbering */}
        <GlobalBottom
          current={currentSlideInt}
          total={totalSlidesCount}
          hide={isCoverPage}
        />
      </SlideContainer>

      {/* Floating Presenter Toolbar Controls */}
      <NavControls
        current={currentSlideInt}
        total={totalSlidesCount}
        onPrev={handlePrev}
        onNext={handleNext}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Floating Drawing Panel Adjuster */}
      <DrawingToolbar
        isActive={isPenActive}
        onActiveChange={setIsPenActive}
        color={penColor}
        onColorChange={setPenColor}
        brushWidth={penWidth}
        onBrushWidthChange={setPenWidth}
        isEraser={isEraser}
        onEraserChange={setIsEraser}
        onClear={() => setClearTrigger((c) => c + 1)}
      />
    </div>
  );
};

export default SlideViewer;
