import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide1B, Slide2, Slide3, Slide3B, Slide3C, Slide_ThumbRules, Slide_BarTypes } from './slides/OverviewSlides';
import { Slide4, Slide5, Slide5B, Slide5C, Slide6, Slide_HookGeometry, Slide_MechanicalCouplers } from './slides/MechanicsSlides';
import { Slide7, Slide8, Slide8B, Slide8C, Slide9 } from './slides/DetailingSlides';
import { Slide16B, Slide16C, Slide16D, Slide16E } from './slides/SlabSlides';
import { Slide16F, Slide16G, Slide16H } from './slides/StaircaseSlides';
import { Slide10, Slide11, Slide11B, Slide11C, Slide12, Slide_RebarBbsLedger, Slide_PwdWeightDiscrepancy } from './slides/TonnageSlides';

import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide1B,
  3: Slide2,
  4: Slide_ThumbRules,
  5: Slide_BarTypes,
  6: Slide3,
  7: Slide3B,
  8: Slide3C,
  9: Slide4,
  10: Slide5,
  11: Slide5B,
  12: Slide_HookGeometry,
  13: Slide5C,
  14: Slide6,
  15: Slide_MechanicalCouplers,
  16: Slide7,
  17: Slide8,
  18: Slide8B,
  19: Slide8C,
  20: Slide9,
  21: Slide16B,
  22: Slide16C,
  23: Slide16D,
  24: Slide16E,
  25: Slide16F,
  26: Slide16G,
  27: Slide16H,
  28: Slide10,
  29: Slide11,
  30: Slide11B,
  31: Slide11C,
  32: Slide_RebarBbsLedger,
  33: Slide_PwdWeightDiscrepancy,
  34: Slide12,
  35: (props) => <LectureThankYou {...props} />,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Steel Reinforcement Intro', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Section 1 Cover', type: 'Cover Slide', section: 'Introduction' },
  3: { title: 'Rebar Nomenclature & Grades', type: 'Concept Details', section: 'Introduction' },
  4: { title: 'Preliminary Steel Estimation', type: 'Live Sandbox', section: 'Introduction' },
  5: { title: 'Plain vs. Deformed Bars', type: 'Concept Details', section: 'Introduction' },
  6: { title: 'Clear Cover Rules', type: 'Concept Details', section: 'Introduction' },
  7: { title: 'Clear Cover Sandbox', type: 'Live Sandbox', section: 'Introduction' },
  8: { title: 'Clear Cover Quiz', type: 'Concept Details', section: 'Introduction' },
  9: { title: 'BBS Mechanics & Geometry', type: 'Cover Slide', section: 'BBS Mechanics' },
  10: { title: 'Hooks & Cranked Bars', type: 'Concept Details', section: 'BBS Mechanics' },
  11: { title: 'Hooks & Cranks Sandbox', type: 'Live Sandbox', section: 'BBS Mechanics' },
  12: { title: 'Hook Geometry & Bends', type: 'Live Sandbox', section: 'BBS Mechanics' },
  13: { title: 'Hooks & Cranks Quiz', type: 'Concept Details', section: 'BBS Mechanics' },
  14: { title: 'Splice Geometry & Lapping', type: 'Concept Details', section: 'BBS Mechanics' },
  15: { title: 'Mechanical Couplers vs Lapping', type: 'Live Sandbox', section: 'BBS Mechanics' },
  16: { title: 'Structural Element Detailing', type: 'Cover Slide', section: 'Element Detailing' },
  17: { title: 'Detailing Beams & Columns', type: 'Concept Details', section: 'Element Detailing' },
  18: { title: 'Stirrup Spacing Sandbox', type: 'Live Sandbox', section: 'Element Detailing' },
  19: { title: 'Stirrups Count Quiz', type: 'Concept Details', section: 'Element Detailing' },
  20: { title: 'Floor Slab Detailing', type: 'Concept Details', section: 'Element Detailing' },
  21: { title: 'Slab Reinforcement Rules', type: 'Concept Details', section: 'Element Detailing' },
  22: { title: 'Slab Bar Counting Math', type: 'Concept Details', section: 'Element Detailing' },
  23: { title: 'Slab Bar Spacing Sandbox', type: 'Live Sandbox', section: 'Element Detailing' },
  24: { title: 'Slab Hooks & Cranks Geometry', type: 'Concept Details', section: 'Element Detailing' },
  25: { title: 'Staircase Concrete Volume', type: 'Concept Details', section: 'Element Detailing' },
  26: { title: 'Staircase Volume Sandbox', type: 'Live Sandbox', section: 'Element Detailing' },
  27: { title: 'Staircase Reinforcement Detailing', type: 'Concept Details', section: 'Element Detailing' },
  28: { title: 'Tonnage & BoQ Integration', type: 'Cover Slide', section: 'Tonnage & BoQ' },
  29: { title: 'Rebar Weight Conversion', type: 'Concept Details', section: 'Tonnage & BoQ' },
  30: { title: 'Weight Converter Sandbox', type: 'Live Sandbox', section: 'Tonnage & BoQ' },
  31: { title: 'Weight Tonnage Quiz', type: 'Concept Details', section: 'Tonnage & BoQ' },
  32: { title: 'BBS Tabular Ledger Format', type: 'Live Sandbox', section: 'Tonnage & BoQ' },
  33: { title: 'Theoretical vs PWD Weights', type: 'Live Sandbox', section: 'Tonnage & BoQ' },
  34: { title: 'Allowances & Lab Report 4', type: 'Concept Details', section: 'Tonnage & BoQ' },
  35: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
