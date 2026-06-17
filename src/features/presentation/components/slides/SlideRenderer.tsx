import React from 'react';
import type { Subject, Lecture, Session } from '@/config/lectures';
import SlideCover from './SlideCover';
import SlideConcepts from './SlideConcepts';
import SlideDraggable from './SlideDraggable';
import SlideCodeHighlighting from './SlideCodeHighlighting';
import SlideMonacoSandbox from './SlideMonacoSandbox';
import SlideMathRendering from './SlideMathRendering';
import SlideMermaidFlowchart from './SlideMermaidFlowchart';
import SlideIconShowcase from './SlideIconShowcase';

interface SlideRendererProps {
  slideNo: number;
  subject: Subject;
  lecture: Lecture;
  session?: Session;
}

export interface SlideMetadata {
  title: string;
  type: string;
}

/**
 * Returns slide metadata (title and type) dynamically based on slide number and lecture context.
 */
export const getSlideMetadata = (
  slideNo: number,
  subject: Subject,
  lecture: Lecture
): SlideMetadata => {
  if (slideNo === 1) {
    return {
      title: lecture.title,
      type: `${subject.code} Cover`,
    };
  }
  if (slideNo === 3) {
    return {
      title: 'Interactive Positioning Elements',
      type: 'Visual Sandbox',
    };
  }
  if (slideNo === 4) {
    return {
      title: 'Syntax Highlighting',
      type: 'Code & Theme',
    };
  }
  if (slideNo === 5) {
    return {
      title: 'Monaco Playground',
      type: 'Live Compiler',
    };
  }
  if (slideNo === 6) {
    return {
      title: 'KaTeX Formulations',
      type: 'Mathematics',
    };
  }
  if (slideNo === 7) {
    return {
      title: 'Mermaid Diagrams',
      type: 'Algorithms',
    };
  }
  if (slideNo === 8) {
    return {
      title: 'Iconify Library',
      type: 'Vector Icons',
    };
  }
  if (slideNo === 9) {
    return {
      title: 'Rounding Precision Rules',
      type: 'Lecture Recap',
    };
  }
  if (slideNo === 10) {
    return {
      title: 'Conclusion & Vitest',
      type: 'Review Summary',
    };
  }
  return {
    title: `Slide ${slideNo}: Core Concepts`,
    type: 'Concept Details',
  };
};

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slideNo,
  subject,
  lecture,
  session,
}) => {
  if (slideNo === 1) {
    return <SlideCover subject={subject} lecture={lecture} session={session} />;
  }
  if (slideNo === 3) {
    return <SlideDraggable />;
  }
  if (slideNo === 4) {
    return <SlideCodeHighlighting />;
  }
  if (slideNo === 5) {
    return <SlideMonacoSandbox />;
  }
  if (slideNo === 6) {
    return <SlideMathRendering />;
  }
  if (slideNo === 7) {
    return <SlideMermaidFlowchart />;
  }
  if (slideNo === 8) {
    return <SlideIconShowcase />;
  }
  return <SlideConcepts slideNo={slideNo} />;
};

export default SlideRenderer;
