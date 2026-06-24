import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6
} from './slides/PavementSlides';
import {
  Slide7,
  Slide8 as WallGeomSlide8,
  Slide9 as WallDrainSlide9,
  Slide10 as WallSandboxSlide10
} from './slides/RetainingWallSlides';
import {
  Slide8 as WallTypeSlide8,
  Slide11 as WallRebarSlide11,
  Slide14 as CulvertTypeSlide14,
  Slide15 as SlabAnatomySlide15,
  Slide16 as SlabBearingSlide16,
  Slide17 as CulvertRebarSlide17
} from './slides/SlabCulvertAndWallBBS';
import {
  Slide11 as CulvertDivSlide11,
  Slide12 as BoxCulvertSlide12,
  Slide13 as HumePipeSlide13,
  Slide14 as CulvertSandboxSlide14
} from './slides/CulvertSlides';
import {
  Slide15 as QuizSlide15,
  Slide16 as QuizSlide16,
  Slide17 as ConclusionSlide17
} from './slides/RulesAndQuizzes';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: Slide6,
  7: Slide7,
  8: WallTypeSlide8,
  9: WallGeomSlide8,
  10: WallDrainSlide9,
  11: WallRebarSlide11,
  12: WallSandboxSlide10,
  13: CulvertDivSlide11,
  14: CulvertTypeSlide14,
  15: SlabAnatomySlide15,
  16: SlabBearingSlide16,
  17: CulvertRebarSlide17,
  18: BoxCulvertSlide12,
  19: HumePipeSlide13,
  20: CulvertSandboxSlide14,
  21: QuizSlide15,
  22: QuizSlide16,
  23: ConclusionSlide17,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Estimation of Roadway: Pavements, Retaining Wall & Culvert', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Flexible Road Pavements Divider', type: 'Cover Slide', section: 'Flexible Road Pavements' },
  3: { title: 'Pavement Stratification', type: 'Concept Details', section: 'Flexible Road Pavements' },
  4: { title: 'Volumetric Layering Rule & Compaction', type: 'Concept Details', section: 'Flexible Road Pavements' },
  5: { title: 'Bituminous Carpening & Seal Coat', type: 'Concept Details', section: 'Flexible Road Pavements' },
  6: { title: 'Pavement Volumetric Sandbox', type: 'Live Sandbox', section: 'Flexible Road Pavements' },
  7: { title: 'Retaining Wall Divider', type: 'Cover Slide', section: 'Retaining Wall' },
  8: { title: 'Classification of Retaining Walls', type: 'Concept Details', section: 'Retaining Wall' },
  9: { title: 'Retaining Wall Geometry', type: 'Concept Details', section: 'Retaining Wall' },
  10: { title: 'Drainage Systems & Backfill', type: 'Concept Details', section: 'Retaining Wall' },
  11: { title: 'Retaining Wall Reinforcement', type: 'Concept Details', section: 'Retaining Wall' },
  12: { title: 'Retaining Wall Sandbox', type: 'Live Sandbox', section: 'Retaining Wall' },
  13: { title: 'Box & Pipe Culverts Divider', type: 'Cover Slide', section: 'Box & Pipe Culverts' },
  14: { title: 'Culvert Classifications & Limits', type: 'Concept Details', section: 'Box & Pipe Culverts' },
  15: { title: 'Anatomy of an RCC Slab Culvert', type: 'Concept Details', section: 'Box & Pipe Culverts' },
  16: { title: 'The Slab Bearing Deduction Rule', type: 'Concept Details', section: 'Box & Pipe Culverts' },
  17: { title: 'Slab Culvert BBS Spacing Nuances', type: 'Concept Details', section: 'Box & Pipe Culverts' },
  18: { title: 'RCC Box Culvert & Void Deductions', type: 'Concept Details', section: 'Box & Pipe Culverts' },
  19: { title: 'Hume Pipe Culverts & Cradle Bedding', type: 'Concept Details', section: 'Box & Pipe Culverts' },
  20: { title: 'Culvert Quantity Sandbox', type: 'Live Sandbox', section: 'Box & Pipe Culverts' },
  21: { title: 'Pavement Volume Checkpoint', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec9_q1' },
  22: { title: 'Culvert Concrete Checkpoint', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec9_q2' },
  23: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
