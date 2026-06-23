import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide2, Slide3 } from './slides/PrinciplesSlides';
import { Slide3 as EarthworkDivider, Slide4 as CentreLineDeduction, Slide5 as FieldRealities, Slide6 as SoilBulking, Slide6B as SoilBulkingSandbox } from './slides/EarthworkSlides';
import { Slide7 as BfsBedding, Slide7B as BfsSandbox, Slide8 as LeanCc, Slide8B as LeanCcSandbox, Slide9 as RccFooting } from './slides/ConcreteSlides';
import {
  Slide9 as FootingWorkedExample,
  Slide10 as SandCushionRealities,
  Slide11 as FootingMath,
  Slide12 as FootingLedger,
  Slide13 as FootingPrecision
} from './slides/WorkedExampleSlides';
import { Slide10 as SteppedMasonry, Slide11 as DpcDeduction, Slide12 as DpmSlab } from './slides/FoundationMasonrySlides';
import { Slide13 as DimensionAnatomy, Slide14 as AddDeduct, Slide15 as ClassSummary } from './slides/StudioPracticeSlides';

import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: EarthworkDivider,
  5: CentreLineDeduction,
  6: FieldRealities,
  7: SoilBulking,
  8: SoilBulkingSandbox,
  9: BfsBedding,
  10: BfsSandbox,
  11: LeanCc,
  12: LeanCcSandbox,
  13: RccFooting,
  14: FootingWorkedExample,
  15: SandCushionRealities,
  16: FootingMath,
  17: FootingLedger,
  18: FootingPrecision,
  19: SteppedMasonry,
  20: DpcDeduction,
  21: DpmSlab,
  22: DimensionAnatomy,
  23: AddDeduct,
  24: ClassSummary,
  25: (props) => <LectureThankYou {...props} />,
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
  8: { title: 'Soil Bulking Sandbox', type: 'Live Sandbox', section: 'Earthwork' },
  9: { title: 'Brick Flat Soling (BFS)', type: 'Concept Details', section: 'Concrete Bedding' },
  10: { title: 'BFS Take-off Sandbox', type: 'Live Sandbox', section: 'Concrete Bedding' },
  11: { title: 'Lean Concrete Base', type: 'Concept Details', section: 'Concrete Bedding' },
  12: { title: 'Lean CC Volume Sandbox', type: 'Live Sandbox', section: 'Concrete Bedding' },
  13: { title: 'Reinforced concrete Footing', type: 'Concept Details', section: 'Concrete Bedding' },
  14: { title: 'Sessional Footing Example', type: 'Concept Details', section: 'Concrete Bedding' },
  15: { title: 'Sand Cushion Realities', type: 'Concept Details', section: 'Concrete Bedding' },
  16: { title: 'Footing Math Computations', type: 'Concept Details', section: 'Concrete Bedding' },
  17: { title: 'Footing MB Ledger', type: 'Spreadsheet View', section: 'Concrete Bedding' },
  18: { title: 'MB Precision Rules', type: 'Concept Details', section: 'Concrete Bedding' },
  19: { title: 'Stepped Masonry Foundation', type: 'Concept Details', section: 'Foundation Masonry' },
  20: { title: 'DPC Door Deductions', type: 'Concept Details', section: 'Foundation Masonry' },
  21: { title: 'Damp-Proof Membrane (DPM)', type: 'Concept Details', section: 'Foundation Masonry' },
  22: { title: 'Dimension Paper Layout', type: 'Spreadsheet View', section: 'Studio Practice' },
  23: { title: 'Add & Deduct Notations', type: 'Concept Details', section: 'Studio Practice' },
  24: { title: 'Class 2 Summary', type: 'Concept Details', section: 'Studio Practice' },
  25: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
