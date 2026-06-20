import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, NavigateOptions, useLocation } from 'react-router-dom';
import { SUBJECTS } from '@/config/lectures';
import { useUserContext } from '@/context/UserContext';
import { getSlideMetadata, getLectureSlideCount, getLectureDeck, loadLectureDeck } from '../components/slides/SlideRenderer';
import { useSlideViewerState } from './useSlideViewerState';
import { usePresenterFeatures } from './usePresenterFeatures';
import { ViewMode, Theme } from '../context/PresentationContext';
import { DEFAULT_SETTINGS } from '../components/layers/SettingsPopover';
import { useSlideTransitions } from './useSlideTransitions';
import { useQuizSubscriptions } from './useQuizSubscriptions';
import { useSlideNavigation } from './useSlideNavigation';

export const useSlideViewerOrchestrator = () => {
  const { subjectId, sessionId, lectureId, slideNo } = useParams<Record<string, string>>();
  const navigate = useNavigate();

  // Settings ref to access settings without causing dependency re-evaluation circular loops
  const settingsRef = useRef(DEFAULT_SETTINGS);

  const activeSub = SUBJECTS.find((sub) => sub.id === subjectId);
  const activeSession = activeSub?.sessions.find((sess) => sess.id === sessionId);
  const activeLec = activeSession?.lectures.find((lec) => lec.id === lectureId);

  const { userProfile } = useUserContext();
  const isAdmin = userProfile?.role === 'admin';

  const [isLoadingDeck, setIsLoadingDeck] = useState(true);
  const [deckError, setDeckError] = useState<string | null>(null);

  // Dynamically resolve and load slide deck assets
  useEffect(() => {
    if (!activeLec || !subjectId || !sessionId) {
      setIsLoadingDeck(false);
      return;
    }

    setIsLoadingDeck(true);
    setDeckError(null);

    loadLectureDeck(subjectId, sessionId, activeLec.id)
      .then(() => {
        setIsLoadingDeck(false);
      })
      .catch((err) => {
        console.error('Failed to load lecture deck:', err);
        setDeckError(String(err));
        setIsLoadingDeck(false);
      });
  }, [subjectId, sessionId, activeLec?.id]);

  const rawTotalSlidesCount = useMemo(() => {
    if (isLoadingDeck || !activeLec) return 0;
    return getLectureSlideCount(activeLec.id);
  }, [activeLec, isLoadingDeck]);

  // Manage dynamic transitions
  const { startSafeTransition, applyTransitionStyle } = useSlideTransitions(activeSub, activeLec, settingsRef);

  // Manage slide navigation and history synchronization
  const {
    activeSlide,
    setActiveSlide,
    bgVariant,
    slideDirectionRef,
    changeSlideWithTransition,
  } = useSlideNavigation(
    subjectId,
    sessionId,
    lectureId,
    slideNo,
    activeSub,
    activeLec,
    isLoadingDeck,
    applyTransitionStyle,
    startSafeTransition
  );

  // Manage quiz subscriptions
  const quizStates = useQuizSubscriptions(activeSub, activeLec, isLoadingDeck);

  const visibleSlideNumbers = useMemo(() => {
    const list: number[] = [];
    if (isLoadingDeck || !activeSub || !activeLec) return list;
    const deck = getLectureDeck(activeLec.id);

    for (let i = 1; i <= rawTotalSlidesCount; i++) {
      const meta = deck.slideMetadata[i];
      if (meta && meta.quizId && meta.quizVisibilityMode === 'stealth' && !isAdmin) {
        const qState = quizStates[meta.quizId];
        const isLive = qState?.status === 'active' || qState?.status === 'closed';
        if (!isLive) {
          continue;
        }
      }
      list.push(i);
    }
    return list;
  }, [rawTotalSlidesCount, activeSub, activeLec, quizStates, isAdmin, isLoadingDeck]);

  const totalSlidesCount = visibleSlideNumbers.length;

  const currentMeta = useMemo(() => {
    if (isLoadingDeck || !activeLec || !activeSub) return null;
    return getSlideMetadata(activeSlide, activeSub, activeLec);
  }, [activeSlide, activeSub, activeLec, isLoadingDeck]);

  const quizId = currentMeta?.quizId || null;
  const activeQuizState = quizId ? quizStates[quizId] || null : null;

  const { pathname } = useLocation();
  const isBlogMode = pathname.endsWith('/blog');

  // Determine active viewMode and theme based on presentation states
  const isPresenting = slideNo !== undefined;
  const viewMode: ViewMode = isPresenting ? 'present' : (isBlogMode ? 'blog' : 'scroll');

  const viewerState = useSlideViewerState({ subjectId, sessionId, lectureId, currentSlideInt: activeSlide });

  const presenterFeatures = usePresenterFeatures();

  // Sync settings state to ref for transition callbacks
  useEffect(() => {
    if (presenterFeatures?.settings) {
      settingsRef.current = presenterFeatures.settings;
    }
  }, [presenterFeatures?.settings]);

  // Group slide numbers by section
  const sections = useMemo(() => {
    const groups: Record<string, number[]> = {};
    if (isLoadingDeck || !activeSub || !activeLec) return groups;
    visibleSlideNumbers.forEach((i) => {
      const meta = getSlideMetadata(i, activeSub, activeLec);
      const sec = meta.section;
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(i);
    });
    return groups;
  }, [visibleSlideNumbers, activeSub, activeLec, isLoadingDeck]);

  // Redirect to nearest valid slide if the current URL slide is hidden/stealthed
  useEffect(() => {
    if (isLoadingDeck) return;
    if (visibleSlideNumbers.length > 0 && !visibleSlideNumbers.includes(activeSlide)) {
      const closest = visibleSlideNumbers.find((num) => num > activeSlide) || visibleSlideNumbers[visibleSlideNumbers.length - 1] || 1;
      changeSlideWithTransition(closest, 'forward');
    }
  }, [visibleSlideNumbers, activeSlide, changeSlideWithTransition, isLoadingDeck]);

  const navigateWithTransition = useCallback((path: string, options?: NavigateOptions) => {
    startSafeTransition(() => navigate(path, options));
  }, [navigate, startSafeTransition]);

  const handleNextSection = useCallback(() => {
    if (activeQuizState?.status === 'active') {
      alert('Cannot advance slide while the live quiz is actively collecting responses. Please close the quiz first.');
      return;
    }
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
  }, [activeSlide, activeSub, activeLec, sections, changeSlideWithTransition, activeQuizState]);

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
    const currentIndex = visibleSlideNumbers.indexOf(activeSlide);
    if (currentIndex > 0) {
      const prevSlideNum = visibleSlideNumbers[currentIndex - 1]!;
      changeSlideWithTransition(prevSlideNum, 'backward');
    }
  }, [activeSlide, visibleSlideNumbers, changeSlideWithTransition]);

  const handleNextSlide = useCallback(() => {
    if (activeQuizState?.status === 'active') {
      alert('Cannot advance slide while the live quiz is actively collecting responses. Please close the quiz first.');
      return;
    }
    const currentIndex = visibleSlideNumbers.indexOf(activeSlide);
    if (currentIndex !== -1 && currentIndex < visibleSlideNumbers.length - 1) {
      const nextSlideNum = visibleSlideNumbers[currentIndex + 1]!;
      changeSlideWithTransition(nextSlideNum, 'forward');
    }
  }, [activeSlide, visibleSlideNumbers, changeSlideWithTransition, activeQuizState]);

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
    notFound,
    bgVariant,
    slideDirectionRef,
    navigateWithTransition,
    changeSlideWithTransition,
    handleNextSection,
    handlePrevSection,
    handlePrevSlide,
    handleNextSlide,
    visibleSlideNumbers,
    isLoadingDeck,
    deckError,
  };
};

export default useSlideViewerOrchestrator;
