import React from 'react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideConcepts from './SlideConcepts';

// Import all constructed lecture slide decks
import * as ConcreteLecture from '@/lectures/quantity-surveying/session-2026/lecture-1-concrete/lecture';
import * as BrickworkLecture from '@/lectures/quantity-surveying/session-2026/lecture-2-brickwork/lecture';
import * as SteelLecture from '@/lectures/quantity-surveying/session-2026/lecture-3-steel/lecture';
import * as SlidevIntroLecture from '@/lectures/web-development/session-2026/lecture-1-slidev-intro/lecture';
import * as EngineeringMechanicsOutline from '@/lectures/engineering-mechanics/session-2024/course-outline/lecture';

interface SlideRendererProps {
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
}

export interface SlideMetadata {
  title: string;
  type: string;
  section: string;
}

// Master registry of active lecture decks
const LECTURE_DECKS: Record<string, {
  slides: Record<number, React.ComponentType<any>>;
  slideMetadata: Record<number, { title: string; type: string; section: string }>;
}> = {
  'concrete': ConcreteLecture,
  'brickwork': BrickworkLecture,
  'steel': SteelLecture,
  'slidev_intro': SlidevIntroLecture,
  'course-outline': EngineeringMechanicsOutline,
};

const getLectureDeck = (lectureId: string) => {
  return LECTURE_DECKS[lectureId] || SlidevIntroLecture;
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
    title: typeof meta.title === 'function' ? (meta.title as any)(lecture) : meta.title,
    type: typeof meta.type === 'function' ? (meta.type as any)(subject) : meta.type,
    section: meta.section,
  };
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
