import { useState, useEffect, useCallback, useRef } from 'react';
import type { Subject, Lecture } from '@/config/lectures';
import { getSlideMetadata, getBgVariant } from '../components/slides/SlideRenderer';
import { isProjectionView, storageKeys, setStorageItem, clearLectureStorage } from '../utils/presentationStorage';

export const useSlideNavigation = (
  subjectId: string | undefined,
  sessionId: string | undefined,
  lectureId: string | undefined,
  slideNo: string | undefined,
  activeSub: Subject | undefined,
  activeLec: Lecture | undefined,
  isLoadingDeck: boolean,
  applyTransitionStyle: (nextSlideNum: number, direction: 'forward' | 'backward') => void,
  startSafeTransition: (updateFn: () => void) => void
) => {
  const currentSlideInt = slideNo ? parseInt(slideNo, 10) : 1;
  const slideDirectionRef = useRef<'forward' | 'backward'>('forward');

  // Active slide local state for synchronous rendering transitions
  const [activeSlide, setActiveSlide] = useState(currentSlideInt);

  // Initial background resolution
  const initialMeta = !isLoadingDeck && activeLec && activeSub ? getSlideMetadata(currentSlideInt, activeSub, activeLec) : null;
  const [bgVariant, setBgVariant] = useState<'default' | 'calculation' | 'gallery' | 'cover'>(
    initialMeta ? getBgVariant(initialMeta.type) : 'default'
  );

  // Sync background variant when activeSlide or isLoadingDeck changes
  useEffect(() => {
    if (!isLoadingDeck && activeLec && activeSub) {
      const meta = getSlideMetadata(activeSlide, activeSub, activeLec);
      if (meta) {
        setBgVariant(getBgVariant(meta.type));
      }
    }
  }, [isLoadingDeck, activeSlide, activeLec, activeSub]);

  // Sync route URL parameter slideNo changes into local state (e.g. browser history back/forward)
  useEffect(() => {
    if (slideNo !== undefined) {
      const parsed = parseInt(slideNo, 10);
      if (!isNaN(parsed) && parsed !== activeSlide) {
        setActiveSlide(parsed);
        const meta = !isLoadingDeck && activeSub && activeLec ? getSlideMetadata(parsed, activeSub, activeLec) : null;
        if (meta) {
          setBgVariant(getBgVariant(meta.type));
        }
      }
    }
  }, [slideNo, isLoadingDeck]);

  // Synchronize initial active slide to localStorage on mount for the leader
  // and clear previous states. Also clean up on exit (unmount).
  useEffect(() => {
    if (!isProjectionView() && lectureId) {
      clearLectureStorage(lectureId);
      const activeSlideKey = storageKeys.activeSlide(lectureId);
      setStorageItem(activeSlideKey, activeSlide);
    }

    return () => {
      if (!isProjectionView() && lectureId) {
        clearLectureStorage(lectureId);
      }
    };
  }, [lectureId]);

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
          const direction = parsed > activeSlide ? 'forward' : 'backward';

          applyTransitionStyle(parsed, direction);
          slideDirectionRef.current = direction;

          startSafeTransition(() => {
            setActiveSlide(parsed);
            setBgVariant(nextBgVariant);
          });
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSlide, activeSub, activeLec, startSafeTransition, applyTransitionStyle]);

  const changeSlideWithTransition = useCallback((nextSlide: number, direction: 'forward' | 'backward' = 'forward') => {
    const meta = activeSub && activeLec ? getSlideMetadata(nextSlide, activeSub, activeLec) : null;
    const nextBgVariant = meta ? getBgVariant(meta.type) : 'default';

    applyTransitionStyle(nextSlide, direction);
    slideDirectionRef.current = direction;

    if (!isProjectionView()) {
      const activeSlideKey = storageKeys.activeSlide(lectureId || 'mock');
      const clickStepKey = storageKeys.clickStep(lectureId || 'mock', nextSlide);
      const targetInitialClick = direction === 'backward' ? 999 : 0;
      setStorageItem(clickStepKey, targetInitialClick);
      setStorageItem(activeSlideKey, nextSlide);
    }

    startSafeTransition(() => {
      setActiveSlide(nextSlide);
      setBgVariant(nextBgVariant);
    });
    window.history.pushState(null, '', `/${subjectId}/${sessionId}/${lectureId}/${nextSlide}`);
  }, [subjectId, sessionId, lectureId, activeSub, activeLec, startSafeTransition, applyTransitionStyle]);

  return {
    activeSlide,
    setActiveSlide,
    bgVariant,
    slideDirectionRef,
    changeSlideWithTransition,
  };
};
