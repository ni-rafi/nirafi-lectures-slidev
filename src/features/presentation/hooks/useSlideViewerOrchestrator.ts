import { useState, useMemo, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useParams, useNavigate, NavigateOptions, useLocation } from 'react-router-dom';
import { SUBJECTS } from '@/config/lectures';
import { getSlideMetadata, getLectureSlideCount, getBgVariant } from '../components/slides/SlideRenderer';
import { useSlideViewerState } from './useSlideViewerState';
import { usePresenterFeatures } from './usePresenterFeatures';
import { useClickSteps } from './useClickSteps';
import { ViewMode, Theme } from '../context/PresentationContext';


export const useSlideViewerOrchestrator = () => {
  const { subjectId, sessionId, lectureId, slideNo } = useParams<Record<string, string>>();
  const navigate = useNavigate();
  const currentSlideInt = slideNo ? parseInt(slideNo, 10) : 1;

  const activeSub = SUBJECTS.find((sub) => sub.id === subjectId);
  const activeSession = activeSub?.sessions.find((sess) => sess.id === sessionId);
  const activeLec = activeSession?.lectures.find((lec) => lec.id === lectureId);

  // Dynamic total slides count derived from active lecture deck configuration
  const totalSlidesCount = activeLec ? getLectureSlideCount(activeLec.id) : 10;

  // Active slide local state for synchronous rendering transitions
  const [activeSlide, setActiveSlide] = useState(currentSlideInt);

  // Initial background resolution
  const initialMeta = activeLec && activeSub ? getSlideMetadata(currentSlideInt, activeSub, activeLec) : null;
  const [bgVariant, setBgVariant] = useState<'default' | 'calculation' | 'gallery' | 'cover'>(
    initialMeta ? getBgVariant(initialMeta.type) : 'default'
  );

  // Sync route URL parameter slideNo changes into local state (e.g. browser history back/forward)
  useEffect(() => {
    if (slideNo !== undefined) {
      const parsed = parseInt(slideNo, 10);
      if (!isNaN(parsed) && parsed !== activeSlide) {
        setActiveSlide(parsed);
        const meta = activeSub && activeLec ? getSlideMetadata(parsed, activeSub, activeLec) : null;
        if (meta) {
          setBgVariant(getBgVariant(meta.type));
        }
      }
    }
  }, [slideNo]);

  // Sync browser back/forward buttons (popstate events) with view transitions
  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart) {
        const parsed = parseInt(lastPart, 10);
        if (!isNaN(parsed) && parsed !== activeSlide) {
          const meta = activeSub && activeLec ? getSlideMetadata(parsed, activeSub, activeLec) : null;
          const nextBgVariant = meta ? getBgVariant(meta.type) : 'default';

          if (document.startViewTransition) {
            document.startViewTransition(() => {
              flushSync(() => {
                setActiveSlide(parsed);
                setBgVariant(nextBgVariant);
              });
            });
          } else {
            setActiveSlide(parsed);
            setBgVariant(nextBgVariant);
          }
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSlide, activeSub, activeLec]);

  const changeSlideWithTransition = useCallback((nextSlide: number) => {
    const meta = activeSub && activeLec ? getSlideMetadata(nextSlide, activeSub, activeLec) : null;
    const nextBgVariant = meta ? getBgVariant(meta.type) : 'default';

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setActiveSlide(nextSlide);
          setBgVariant(nextBgVariant);
        });
      });
    } else {
      setActiveSlide(nextSlide);
      setBgVariant(nextBgVariant);
    }
    // Update the URL in the address bar without triggering React Router route navigation
    window.history.pushState(null, '', `/${subjectId}/${sessionId}/${lectureId}/${nextSlide}`);
  }, [subjectId, sessionId, lectureId, activeSub, activeLec]);

  const { pathname } = useLocation();
  const isBlogMode = pathname.endsWith('/blog');

  // Determine active viewMode and theme based on presentation states
  const isPresenting = slideNo !== undefined;
  const viewMode: ViewMode = isPresenting ? 'present' : (isBlogMode ? 'blog' : 'scroll');

  const viewerState = useSlideViewerState({ subjectId, sessionId, lectureId, currentSlideInt: activeSlide });

  const presenterFeatures = usePresenterFeatures({
    subjectId,
    sessionId,
    lectureId,
    currentSlideInt: activeSlide,
    onSlideChange: changeSlideWithTransition,
    viewMode,
  });

  // Group slide numbers by section
  const sections = useMemo(() => {
    const groups: Record<string, number[]> = {};
    if (!activeSub || !activeLec) return groups;
    for (let i = 1; i <= totalSlidesCount; i++) {
      const meta = getSlideMetadata(i, activeSub, activeLec);
      const sec = meta.section;
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(i);
    }
    return groups;
  }, [totalSlidesCount, activeSub, activeLec]);

  const navigateWithTransition = useCallback((path: string, options?: NavigateOptions) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate(path, options);
        });
      });
    } else {
      navigate(path, options);
    }
  }, [navigate]);

  const handleNextSection = useCallback(() => {
    if (!activeSub || !activeLec) return;
    const currentMeta = getSlideMetadata(activeSlide, activeSub, activeLec);
    const sectionNames = Object.keys(sections);
    const currentSecIndex = sectionNames.indexOf(currentMeta.section);
    if (currentSecIndex !== -1 && currentSecIndex < sectionNames.length - 1) {
      const nextSectionName = sectionNames[currentSecIndex + 1];
      if (nextSectionName) {
        const nextSectionSlides = sections[nextSectionName];
        if (nextSectionSlides && nextSectionSlides.length > 0) {
          const targetSlide = nextSectionSlides[0];
          if (targetSlide !== undefined) {
            changeSlideWithTransition(targetSlide);
          }
        }
      }
    }
  }, [activeSlide, activeSub, activeLec, sections, changeSlideWithTransition]);

  const handlePrevSection = useCallback(() => {
    if (!activeSub || !activeLec) return;
    const currentMeta = getSlideMetadata(activeSlide, activeSub, activeLec);
    const sectionNames = Object.keys(sections);
    const currentSecIndex = sectionNames.indexOf(currentMeta.section);
    if (currentSecIndex > 0) {
      const prevSectionName = sectionNames[currentSecIndex - 1];
      if (prevSectionName) {
        const prevSectionSlides = sections[prevSectionName];
        if (prevSectionSlides && prevSectionSlides.length > 0) {
          const targetSlide = prevSectionSlides[0];
          if (targetSlide !== undefined) {
            changeSlideWithTransition(targetSlide);
          }
        }
      }
    }
  }, [activeSlide, activeSub, activeLec, sections, changeSlideWithTransition]);

  const handlePrevSlide = useCallback(() => {
    if (activeSlide > 1) {
      changeSlideWithTransition(activeSlide - 1);
    }
  }, [activeSlide, changeSlideWithTransition]);

  const handleNextSlide = useCallback(() => {
    if (activeSlide < totalSlidesCount) {
      changeSlideWithTransition(activeSlide + 1);
    }
  }, [activeSlide, totalSlidesCount, changeSlideWithTransition]);

  const clickSteps = useClickSteps(handlePrevSlide, handleNextSlide);

  const activeTheme: Theme = viewerState.isProjectionView ? 'projection' : (presenterFeatures.isDark ? 'dark' : 'light');

  const notFound = !activeSub || !activeLec;

  return {
    subjectId,
    sessionId,
    lectureId,
    slideNo,
    activeSub,
    activeSession,
    activeLec,
    totalSlidesCount,
    activeSlide,
    setActiveSlide,
    viewMode,
    activeTheme,
    sections,
    viewerState,
    presenterFeatures,
    clickSteps,
    notFound,
    bgVariant,
    navigateWithTransition,
    changeSlideWithTransition,
    handleNextSection,
    handlePrevSection,
    handlePrevSlide,
    handleNextSlide,
  };
};

export default useSlideViewerOrchestrator;
