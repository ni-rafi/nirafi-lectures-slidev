import React from 'react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideConcepts from './SlideConcepts';

export interface SlideProps {
  subject: Subject;
  lecture: Lecture;
  session?: Session;
  slideNo: number;
}

interface SlideRendererProps {
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
}

import { TransitionType } from '../../types/schema';

export interface SlideMetadata {
  title: string;
  type: string;
  section: string;
  transition?: TransitionType;
  transitionDuration?: number;
  quizId?: string;
  quizVisibilityMode?: 'stealth' | 'placeholder';
}

// Resolved decks cache
const RESOLVED_DECKS: Record<string, {
  slides: Record<number, React.ComponentType<SlideProps>>;
  slideMetadata: Record<number, SlideMetadata>;
}> = {};

export const registerResolvedDeck = (
  lectureId: string,
  deck: {
    slides: Record<number, React.ComponentType<SlideProps>>;
    slideMetadata: Record<number, SlideMetadata>;
  }
) => {
  RESOLVED_DECKS[lectureId] = deck;
};

// Glob map of all dynamic lecture loaders
const DECK_LOADERS = import.meta.glob<{
  slides: Record<number, React.ComponentType<SlideProps>>;
  slideMetadata: Record<number, SlideMetadata>;
}>('/src/subjects/*/lectures/*/*/lecture.tsx');

// Eager glob map of metadata files to resolve quiz visibility modes synchronously
const metadataModules = import.meta.glob<{
  metadata: Lecture & { quizzes?: Record<string, 'stealth' | 'placeholder'> };
}>('/src/subjects/*/lectures/*/*/metadata.ts', { eager: true });

/**
 * Dynamically resolves and loads a lecture deck on demand.
 */
export const loadLectureDeck = async (
  subjectId: string,
  sessionId: string,
  lectureId: string
): Promise<{
  slides: Record<number, React.ComponentType<SlideProps>>;
  slideMetadata: Record<number, SlideMetadata>;
}> => {
  // Look up matching loader path key
  const targetKey = Object.keys(DECK_LOADERS).find((path) => {
    const includesSubjectAndSession = path.includes(`/subjects/${subjectId}/`) && path.includes(`/${sessionId}/`);
    if (!includesSubjectAndSession) return false;

    // Matches e.g. "/lecture-1-concrete/lecture.tsx" or "/course-outline/lecture.tsx" ending with lectureId
    const regex = new RegExp(`\\/(?:lecture-|course-)?(?:\\d+-)?${lectureId}\\/lecture\\.tsx$`);
    return regex.test(path);
  });

  if (targetKey && DECK_LOADERS[targetKey]) {
    const module = await DECK_LOADERS[targetKey]();
    RESOLVED_DECKS[lectureId] = module;
    return module;
  }

  throw new Error(`Slide deck loader not found for subject: ${subjectId}, session: ${sessionId}, lecture: ${lectureId}`);
};

const EMPTY_FALLBACK: {
  slides: Record<number, React.ComponentType<SlideProps>>;
  slideMetadata: Record<number, SlideMetadata>;
} = {
  slides: {},
  slideMetadata: {},
};

export const getLectureDeck = (lectureId: string) => {
  return RESOLVED_DECKS[lectureId] || EMPTY_FALLBACK;
};

/**
 * Returns background variant layout based on slide type metadata.
 */
export const getBgVariant = (type: string): 'default' | 'calculation' | 'gallery' | 'cover' => {
  const t = type.toLowerCase();
  if (t.includes('cover') || t.includes('title')) return 'cover';
  if (t.includes('sandbox') || t.includes('calculation') || t.includes('calculator') || t.includes('formula')) return 'calculation';
  if (t.includes('spreadsheet') || t.includes('table') || t.includes('grid') || t.includes('quiz') || t.includes('gallery')) return 'gallery';
  return 'default';
};

/**
 * Returns slide metadata (title, type, and section) dynamically based on active lecture deck configurations.
 */
export const getSlideMetadata = (
  slideNo: number,
  subject: Subject,
  lecture: Lecture
): SlideMetadata => {
  const deck = getLectureDeck(lecture.id);
  const meta = deck.slideMetadata[slideNo];
  if (!meta) {
    return {
      title: `Slide ${slideNo}`,
      type: 'Concept Details',
      section: 'Introduction',
    };
  }

  return {
    title: typeof meta.title === 'function' ? (meta.title as unknown as (l: Lecture) => string)(lecture) : meta.title,
    type: typeof meta.type === 'function' ? (meta.type as unknown as (s: Subject) => string)(subject) : meta.type,
    section: meta.section,
    transition: meta.transition,
    transitionDuration: meta.transitionDuration,
    quizId: meta.quizId,
    quizVisibilityMode: meta.quizVisibilityMode,
  };
};

/**
 * Resolves the quiz visibility mode ('stealth' | 'placeholder') by its unique quizId.
 */
export const getQuizVisibilityMode = (quizId: string): 'stealth' | 'placeholder' => {
  for (const module of Object.values(metadataModules)) {
    if (module.metadata?.quizzes && module.metadata.quizzes[quizId]) {
      return module.metadata.quizzes[quizId];
    }
  }
  return 'placeholder';
};

/**
 * Returns total number of slides for a given lecture.
 */
export const getLectureSlideCount = (lectureId: string): number => {
  const deck = getLectureDeck(lectureId);
  return Object.keys(deck.slides).length;
};

/**
 * SlideRenderer dynamically returns the slide component matching the active slide number.
 * Decouples rendering imports from presentation container components.
 */
export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slideNo,
  subject,
  lecture,
  session,
}) => {
  const deck = getLectureDeck(lecture.id);
  const SlideComponent = deck.slides[slideNo];
  if (!SlideComponent) {
    return <SlideConcepts slideNo={slideNo} />;
  }

  return <SlideComponent slideNo={slideNo} subject={subject} lecture={lecture} session={session} />;
};

export default SlideRenderer;
