import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7 as ReservoirSlide7,
  Slide8 as ReservoirSlide8
} from './slides/ReservoirSlides';
import {
  Slide7 as BBSSlide7,
  Slide8 as BBSSlide8
} from './slides/ReservoirBBSSlides';
import {
  Slide9 as SepticSlide9,
  Slide10 as SepticSlide10,
  Slide11 as SepticSlide11,
  Slide12 as SepticSlide12,
  Slide13 as SepticSlide13,
  Slide14 as SepticSlide14
} from './slides/SepticTankSlides';
import {
  Slide13 as InspectionSlide13,
  Slide16 as SoakPitSlide16,
  Slide17 as SoakPitSlide17,
  Slide18 as SoakPitSlide18
} from './slides/InspectionPitSlides';
import {
  Slide13 as RulesSlide13,
  Slide14 as RulesSlide14,
  Slide15 as RulesSlide15,
  Slide16 as RulesSlide16,
  Slide17 as RulesSlide17,
  QuizzesDividerSlide,
  SubmissionDividerSlide,
  SubmissionDirectivesSlide
} from './slides/RulesAndQuizzes';
import {
  Slide19 as CostingSlide19,
  Slide20 as CostingSlide20,
  Slide21 as CostingSlide21,
  Slide22 as CostingSlide22
} from './slides/SepticCostingSlides';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: Slide6,
  7: BBSSlide7,
  8: BBSSlide8,
  9: ReservoirSlide7,
  10: ReservoirSlide8,
  11: SepticSlide9,
  12: SepticSlide10,
  13: SepticSlide13,
  14: SepticSlide14,
  15: InspectionSlide13,
  16: SepticSlide11,
  17: SepticSlide12,
  18: SoakPitSlide16,
  19: SoakPitSlide17,
  20: SoakPitSlide18,
  21: RulesSlide13,
  22: RulesSlide14,
  23: CostingSlide19,
  24: CostingSlide20,
  25: CostingSlide21,
  26: CostingSlide22,
  27: QuizzesDividerSlide,
  28: RulesSlide15,
  29: RulesSlide16,
  30: SubmissionDividerSlide,
  31: SubmissionDirectivesSlide,
  32: RulesSlide17,
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
  7: { title: 'Reservoir BBS Fundamentals', type: 'Concept Details', section: 'Water Reservoir' },
  8: { title: 'Calculating Reservoir Reinforcement', type: 'Concept Details', section: 'Water Reservoir' },
  9: { title: 'Waterproofing Admixtures & Finishes', type: 'Concept Details', section: 'Water Reservoir' },
  10: { title: 'Plaster Area & Chemical Sandbox', type: 'Live Sandbox', section: 'Water Reservoir' },
  11: { title: 'Septic Tank Divider', type: 'Cover Slide', section: 'Septic Tank' },
  12: { title: 'Septic Tank Anatomy & Take-offs', type: 'Concept Details', section: 'Septic Tank' },
  13: { title: 'Stepped Wall Masonry & Plaster', type: 'Concept Details', section: 'Septic Tank' },
  14: { title: 'Septic Stepped Sandbox', type: 'Live Sandbox', section: 'Septic Tank' },
  15: { title: 'Sanitary Junction: The Inspection Pit', type: 'Concept Details', section: 'Septic Tank' },
  16: { title: 'Soak Pit Filtration Structure', type: 'Concept Details', section: 'Septic Tank' },
  17: { title: 'Soak Pit Volume Sandbox', type: 'Live Sandbox', section: 'Septic Tank' },
  18: { title: 'Soak Pit Filtration Layers', type: 'Concept Details', section: 'Septic Tank' },
  19: { title: 'Soak Pit Structural Enclosures', type: 'Concept Details', section: 'Septic Tank' },
  20: { title: 'Soak Pit Structural Sandbox', type: 'Live Sandbox', section: 'Septic Tank' },
  21: { title: 'PWD SoR Divider', type: 'Cover Slide', section: 'PWD Measurement' },
  22: { title: 'Structural Trades vs. Plumbing Items', type: 'Concept Details', section: 'PWD Measurement' },
  23: { title: 'Septic Tank BoQ Assembly', type: 'Concept Details', section: 'PWD Measurement' },
  24: { title: 'Septic Tank Costing Ledger', type: 'Live Sandbox', section: 'PWD Measurement' },
  25: { title: 'Modern Eco STPs & Prefabricated Storage', type: 'Concept Details', section: 'PWD Measurement' },
  26: { title: 'Eco STP & Prefab Tanks Sandbox', type: 'Live Sandbox', section: 'PWD Measurement' },
  27: { title: 'Interactive Checkpoints Divider', type: 'Cover Slide', section: 'Quizzes' },
  28: { title: 'Excavation Parameterized Checkpoint', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec7_q1' },
  29: { title: 'Soak Pit Loose Aggregate Checkpoint', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec7_q2' },
  30: { title: 'Submission Divider', type: 'Cover Slide', section: 'Submission' },
  31: { title: 'Lab Report 7 Submission Directives', type: 'Concept Details', section: 'Submission' },
  32: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
