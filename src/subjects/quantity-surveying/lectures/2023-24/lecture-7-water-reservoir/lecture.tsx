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
  Slide8
} from './slides/ReservoirSlides';
import {
  Slide9,
  Slide10,
  Slide11,
  Slide12
} from './slides/SepticTankSlides';
import {
  Slide13,
  Slide14,
  Slide15,
  Slide16,
  Slide17
} from './slides/RulesAndQuizzes';

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
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Water Reservoir & Septic Tank', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Water Reservoir divider', type: 'Cover Slide', section: 'Water Reservoir' },
  3: { title: 'Excavation Logistics & Shoring', type: 'Concept Details', section: 'Water Reservoir' },
  4: { title: 'Excavation Volume Sandbox', type: 'Live Sandbox', section: 'Water Reservoir' },
  5: { title: 'RCC Concrete Containment Shell', type: 'Concept Details', section: 'Water Reservoir' },
  6: { title: 'RCC Shell Volume Sandbox', type: 'Live Sandbox', section: 'Water Reservoir' },
  7: { title: 'Waterproofing Admixtures & Finishes', type: 'Concept Details', section: 'Water Reservoir' },
  8: { title: 'Plaster Area & Chemical Sandbox', type: 'Live Sandbox', section: 'Water Reservoir' },
  9: { title: 'Septic Tank Divider', type: 'Cover Slide', section: 'Septic Tank' },
  10: { title: 'Septic Tank Anatomy & Take-offs', type: 'Concept Details', section: 'Septic Tank' },
  11: { title: 'Soak Pit Filtration Structure', type: 'Concept Details', section: 'Septic Tank' },
  12: { title: 'Soak Pit Volume Sandbox', type: 'Live Sandbox', section: 'Septic Tank' },
  13: { title: 'PWD SoR Divider', type: 'Cover Slide', section: 'PWD Measurement' },
  14: { title: 'Structural Trades vs. Plumbing Items', type: 'Concept Details', section: 'PWD Measurement' },
  15: { title: 'Excavation Parameterized Checkpoint', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec7_q1' },
  16: { title: 'Soak Pit Loose Aggregate Checkpoint', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec7_q2' },
  17: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
