import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
} from './slides/IntroAndStressSlides';

import {
  Slide11,
  Slide12,
  Slide13,
} from './slides/SignConventionSlides';

import {
  Slide14,
} from './slides/BeamLoadingSandboxSlides';

import {
  Slide15,
  Slide16,
} from './slides/DifferentialCalculusSlides';

import {
  Slide17,
  Slide18,
  Slide19,
} from './slides/MethodOfSectionsSlides';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: Slide6,
  7: Slide7,
  8: Slide8,
  9: Slide9,
  10: Slide10,
  11: Slide11,
  12: Slide12,
  13: Slide13,
  14: Slide14,
  15: Slide15,
  16: Slide16,
  17: Slide17,
  18: Slide18,
  19: Slide19,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Shear Force & Bending Moment Diagrams', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Course Objectives & References', type: 'Concept Details', section: 'Introduction' },
  3: { title: 'Static Equilibrium Prerequisite Check', type: 'Live Sandbox', section: 'Introduction' },
  4: { title: 'Internal Forces & Structural Intuition', type: 'Cover Slide', section: 'Internal Stress' },
  5: { title: 'Sectioning & Internal Forces Expose', type: 'Concept Details', section: 'Internal Stress' },
  6: { title: 'The Anatomy of Internal Forces', type: 'Concept Details', section: 'Internal Stress' },
  7: { title: 'Bending Mechanics - Simply Supported Flexion', type: 'Concept Details', section: 'Internal Stress' },
  8: { title: 'Bending Mechanics - Cantilever Bending', type: 'Concept Details', section: 'Internal Stress' },
  9: { title: 'Shear Mechanics - Simply Supported Shear', type: 'Concept Details', section: 'Internal Stress' },
  10: { title: 'Shear Mechanics - Cantilever Shear', type: 'Concept Details', section: 'Internal Stress' },
  11: { title: 'Sign Conventions Divider', type: 'Cover Slide', section: 'Sign Conventions' },
  12: { title: 'The Shear Force Sign Convention', type: 'Live Sandbox', section: 'Sign Conventions' },
  13: { title: 'Bending Moment Sign Convention', type: 'Concept Details', section: 'Sign Conventions' },
  14: { title: 'Beam Loading Scenario Sandbox', type: 'Live Sandbox', section: 'Sign Conventions' },
  15: { title: 'Load-Shear-Moment Relationships', type: 'Concept Details', section: 'Sign Conventions' },
  16: { title: 'Curve Slopes & Key Points Visualization', type: 'Concept Details', section: 'Sign Conventions' },
  17: { title: 'Internal Equations Method', type: 'Cover Slide', section: 'Section Method' },
  18: { title: 'Executing the Virtual Cut (Sectioning at x)', type: 'Concept Details', section: 'Section Method' },
  19: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
