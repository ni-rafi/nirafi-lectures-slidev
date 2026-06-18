import React from 'react';
import SlideCover from '@/features/presentation/components/slides/SlideCover';
import SlideConcepts from '@/features/presentation/components/slides/SlideConcepts';
import SlideDraggable from '@/features/presentation/components/slides/SlideDraggable';
import SlideCodeHighlighting from '@/features/presentation/components/slides/SlideCodeHighlighting';
import SlideMonacoSandbox from '@/features/presentation/components/slides/SlideMonacoSandbox';
import SlideMathRendering from '@/features/presentation/components/slides/SlideMathRendering';
import SlideMermaidFlowchart from '@/features/presentation/components/slides/SlideMermaidFlowchart';
import SlideIconShowcase from '@/features/presentation/components/slides/SlideIconShowcase';
import SlideBklitChart from '@/features/presentation/components/slides/SlideBklitChart';
import SlidePhysicsShapes from '@/features/presentation/components/slides/SlidePhysicsShapes';

export const slides: Record<number, React.ComponentType<any>> = {
  1: SlideCover,
  2: SlideConcepts,
  3: SlideDraggable,
  4: SlideCodeHighlighting,
  5: SlideMonacoSandbox,
  6: SlideMathRendering,
  7: SlideMermaidFlowchart,
  8: SlideIconShowcase,
  9: SlideBklitChart,
  10: SlidePhysicsShapes,
  11: (props) => <SlideConcepts {...props} slideNo={11} />,
  12: (props) => <SlideConcepts {...props} slideNo={12} />,
};

export const slideMetadata: Record<number, { title: string; type: string; section: string }> = {
  1: { title: 'Slidev Cover Page', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Theory of Slidev', type: 'Core Theory', section: 'Introduction' },
  3: { title: 'Interactive Draggables', type: 'Visual Sandbox', section: 'Interactive Sandbox' },
  4: { title: 'Syntax Highlighting', type: 'Code & Theme', section: 'Interactive Sandbox' },
  5: { title: 'Monaco Playground', type: 'Live Compiler', section: 'Interactive Sandbox' },
  6: { title: 'KaTeX Formulations', type: 'Mathematics', section: 'Advanced Features' },
  7: { title: 'Mermaid Diagrams', type: 'Algorithms', section: 'Advanced Features' },
  8: { title: 'Iconify SVG Library', type: 'Vector Icons', section: 'Advanced Features' },
  9: { title: 'Interactive Charts', type: 'Data Visualization', section: 'Advanced Features' },
  10: { title: 'Physics & Morphing Shapes', type: 'Interactive Physics', section: 'Advanced Features' },
  11: { title: 'Rounding Precision Rules', type: 'Lecture Recap', section: 'Summary & Review' },
  12: { title: 'Conclusion & Vitest', type: 'Review Summary', section: 'Summary & Review' },
};
