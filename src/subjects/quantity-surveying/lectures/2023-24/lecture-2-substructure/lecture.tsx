import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide2, Slide3 } from './slides/PrinciplesSlides';
import { Slide3 as EarthworkDivider, Slide4 as CentreLineDeduction, Slide5 as FieldRealities, Slide6 as SoilBulking } from './slides/EarthworkSlides';
import { Slide7 as BfsBedding, Slide8 as LeanCc, Slide9 as RccFooting } from './slides/ConcreteSlides';
import { Slide10 as SteppedMasonry, Slide11 as DpcDeduction, Slide12 as DpmSlab } from './slides/FoundationMasonrySlides';
import { Slide13 as DimensionAnatomy, Slide14 as AddDeduct, Slide15 as ClassSummary } from './slides/StudioPracticeSlides';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: EarthworkDivider,
  5: CentreLineDeduction,
  6: FieldRealities,
  7: SoilBulking,
  8: BfsBedding,
  9: LeanCc,
  10: RccFooting,
  11: SteppedMasonry,
  12: DpcDeduction,
  13: DpmSlab,
  14: DimensionAnatomy,
  15: AddDeduct,
  16: ClassSummary,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Substructure Estimation', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Principles of Measurement', type: 'Concept Details', section: 'Introduction' },
  3: { title: 'Measurement Sandbox', type: 'Live Sandbox', section: 'Introduction' },
  4: { title: 'Earthwork Divider', type: 'Cover Slide', section: 'Earthwork' },
  5: { title: 'Centre Line Deductions', type: 'Concept Details', section: 'Earthwork' },
  6: { title: 'Field Realities & Dewatering', type: 'Concept Details', section: 'Earthwork' },
  7: { title: 'Soil Bulking & Backfill', type: 'Concept Details', section: 'Earthwork' },
  8: { title: 'Brick Flat Soling (BFS)', type: 'Concept Details', section: 'Concrete Bedding' },
  9: { title: 'Lean Concrete Base', type: 'Concept Details', section: 'Concrete Bedding' },
  10: { title: 'Reinforced concrete Footing', type: 'Concept Details', section: 'Concrete Bedding' },
  11: { title: 'Stepped Masonry Foundation', type: 'Concept Details', section: 'Foundation Masonry' },
  12: { title: 'DPC Door Deductions', type: 'Concept Details', section: 'Foundation Masonry' },
  13: { title: 'Damp-Proof Membrane (DPM)', type: 'Concept Details', section: 'Foundation Masonry' },
  14: { title: 'Dimension Paper Layout', type: 'Spreadsheet View', section: 'Studio Practice' },
  15: { title: 'Add & Deduct Notations', type: 'Concept Details', section: 'Studio Practice' },
  16: { title: 'Class 2 Summary', type: 'Thank You Slide', section: 'Conclusion' },
};
