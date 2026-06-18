import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useClickStepsContext } from '../context/ClickStepsContext';

interface UseSlideViewerStateProps {
  subjectId?: string;
  sessionId?: string;
  lectureId?: string;
  currentSlideInt: number;
}
interface ScreenDetailItem {
  isPrimary: boolean;
  availLeft: number;
  availTop: number;
  availWidth: number;
  availHeight: number;
}

interface ScreenDetails {
  screens: ScreenDetailItem[];
  currentScreen: ScreenDetailItem;
}

export const useSlideViewerState = ({
  subjectId,
  sessionId,
  lectureId,
  currentSlideInt,
}: UseSlideViewerStateProps) => {
  const location = useLocation();
  const outerRef = useRef<HTMLDivElement | null>(null);
  const projectionWindowRef = useRef<Window | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);
  const [penColor, setPenColor] = useState('#ef4444');
  const [penWidth, setPenWidth] = useState(3);
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle'>('pencil');
  const isEraser = activeTool === 'eraser';
  const setIsEraser = (eraser: boolean) => {
    setActiveTool(eraser ? 'eraser' : 'pencil');
  };
  const [clearTrigger, setClearTrigger] = useState(0);

  const [areDrawingsHidden, setAreDrawingsHidden] = useState(false);
  const hiddenKey = `cee_drawings_hidden_${lectureId || 'mock'}`;

  // Load initial visibility state
  useEffect(() => {
    const saved = localStorage.getItem(hiddenKey);
    setAreDrawingsHidden(saved === 'true');
  }, [hiddenKey]);

  // Sync visibility changes across windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === hiddenKey) {
        setAreDrawingsHidden(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [hiddenKey]);

  const handleToggleDrawingsHidden = () => {
    const nextVal = !areDrawingsHidden;
    setAreDrawingsHidden(nextVal);
    localStorage.setItem(hiddenKey, String(nextVal));
  };

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [isPresenterView, setIsPresenterView] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const isProjectionView = new URLSearchParams(location.search).get('projection') === 'true';

  const { resetClicks, totalClicks, setClick } = useClickStepsContext();

  const prevSlideRef = useRef(currentSlideInt);
  const shouldSetMaxClicksRef = useRef(false);

  useEffect(() => {
    if (currentSlideInt < prevSlideRef.current) {
      shouldSetMaxClicksRef.current = true;
    } else {
      shouldSetMaxClicksRef.current = false;
    }
    prevSlideRef.current = currentSlideInt;
    resetClicks();
  }, [currentSlideInt, lectureId, resetClicks]);

  useEffect(() => {
    if ((shouldSetMaxClicksRef.current || location.state?.clicks === 'max') && totalClicks > 0) {
      setClick(totalClicks);
      shouldSetMaxClicksRef.current = false;
    }
  }, [totalClicks, location.state?.clicks, setClick]);

  useEffect(() => {
    if (!isPresenterView || !timerRunning) return;
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isPresenterView, timerRunning]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Projection View auto-fullscreen effect
  useEffect(() => {
    if (!isProjectionView) return;
    const enterFS = async () => {
      try {
        if (!document.fullscreenElement && outerRef.current) {
          await outerRef.current.requestFullscreen();
        }
      } catch (err) {
        console.warn('Auto-fullscreen request failed:', err);
      }
    };
    enterFS();
    const clickFS = () => { enterFS(); window.removeEventListener('click', clickFS); };
    window.addEventListener('click', clickFS);
    return () => window.removeEventListener('click', clickFS);
  }, [isProjectionView]);

  // Synchronize closing the projection window to deactivate presenter view
  useEffect(() => {
    const channel = new BroadcastChannel('slidev-navigation');
    channel.onmessage = (e) => {
      if (e.data?.action === 'projection-closed') {
        setIsPresenterView(false);
      }
    };
    return () => channel.close();
  }, []);

  // When projection view window is closed or unloaded, broadcast close event
  useEffect(() => {
    if (!isProjectionView) return;
    
    const handleUnload = () => {
      const channel = new BroadcastChannel('slidev-navigation');
      channel.postMessage({ action: 'projection-closed' });
      channel.close();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isProjectionView]);

  // Clean up popup window ref if main tab unmounts
  useEffect(() => {
    return () => {
      if (projectionWindowRef.current && !projectionWindowRef.current.closed) {
        projectionWindowRef.current.close();
      }
    };
  }, []);

  const handleToggleFullscreen = async () => {
    if (!outerRef.current) return;
    try {
      if (!document.fullscreenElement) await outerRef.current.requestFullscreen();
      else await document.exitFullscreen();
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  const handleTogglePresenter = async () => {
    if (isPresenterView) {
      setIsPresenterView(false);
      if (projectionWindowRef.current && !projectionWindowRef.current.closed) {
        projectionWindowRef.current.close();
      }
      return;
    }

    setIsPresenterView(true);
    let screenDetails: ScreenDetails | null = null;
    try {
      if ('getScreenDetails' in window) {
        screenDetails = await (window as unknown as { getScreenDetails: () => Promise<ScreenDetails> }).getScreenDetails();
      }
    } catch (err) {
      console.warn('Screen details lookup failed:', err);
    }

    const url = `/${subjectId}/${sessionId}/${lectureId}/${currentSlideInt}?projection=true`;
    const name = 'PresenterProjectionWindow';
    const secondary = screenDetails?.screens?.find((s) => !s.isPrimary || s !== screenDetails?.currentScreen);

    if (secondary) {
      const { availLeft, availTop, availWidth, availHeight } = secondary;
      projectionWindowRef.current = window.open(
        url, name, `left=${availLeft},top=${availTop},width=${availWidth},height=${availHeight},menubar=no,toolbar=no,location=no,status=no`
      );
    } else {
      projectionWindowRef.current = window.open(url, name, 'width=1024,height=768,menubar=no,toolbar=no,location=no,status=no');
    }
  };

  return {
    outerRef,
    isFullscreen,
    isPenActive,
    setIsPenActive,
    penColor,
    setPenColor,
    penWidth,
    setPenWidth,
    isEraser,
    setIsEraser,
    activeTool,
    setActiveTool,
    clearTrigger,
    setClearTrigger,
    areDrawingsHidden,
    handleToggleDrawingsHidden,
    isCameraOpen,
    setIsCameraOpen,
    isTimerOpen,
    setIsTimerOpen,
    isRecording,
    setIsRecording,
    isPresenterView,
    setIsPresenterView,
    elapsed,
    setElapsed,
    timerRunning,
    setTimerRunning,
    isProjectionView,
    handleToggleFullscreen,
    handleTogglePresenter,
  };
};

export default useSlideViewerState;
