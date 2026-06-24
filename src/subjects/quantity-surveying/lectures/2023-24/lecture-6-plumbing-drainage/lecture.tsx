import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 } from './slides/WaterSupplySlides';
import {
  Slide7 as FittingsSlide7,
  Slide8 as FittingsSlide8,
  Slide9 as FittingsSlide9,
  GrooveWeldingSlide,
  GrooveWeldingSandboxSlide
} from './slides/FittingsSlides';
import {
  Slide7 as FixtureSlide7,
  Slide8 as FixtureSlide8,
  Slide9 as FixtureSlide9,
  Slide10 as FixtureSlide10,
  Slide11 as FixtureSlide11,
  AutomatedFixturesSlide
} from './slides/FixturePacksSlides';
import { Slide12, Slide13, Slide14, Slide15, Slide16 } from './slides/DrainageSlides';
import {
  Slide17 as SewerageSlide17,
  Slide18 as SewerageSlide18,
  Slide19 as SewerageSlide19,
  Slide20 as SewerageSlide20,
  Slide21 as SewerageSlide21,
  Slide22 as SewerageSlide22
} from './slides/ExternalSewerageSlides';
import {
  Slide25,
  Slide26,
  MepSubNetworksSlide,
  MepSubNetworksSandboxSlide
} from './slides/TradeSegregationSlides';
import { Slide28, Slide29 } from './slides/PreliminaryCostingSlides';

import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: Slide6,
  7: FittingsSlide7,
  8: FittingsSlide8,
  9: FittingsSlide9,
  10: GrooveWeldingSlide,
  11: GrooveWeldingSandboxSlide,
  12: FixtureSlide7,
  13: FixtureSlide8,
  14: FixtureSlide9,
  15: FixtureSlide10,
  16: FixtureSlide11,
  17: AutomatedFixturesSlide,
  18: Slide12,
  19: Slide13,
  20: Slide14,
  21: Slide15,
  22: Slide16,
  23: SewerageSlide17,
  24: SewerageSlide18,
  25: SewerageSlide19,
  26: SewerageSlide20,
  27: SewerageSlide21,
  28: Slide25,
  29: Slide26,
  30: MepSubNetworksSlide,
  31: MepSubNetworksSandboxSlide,
  32: SewerageSlide22,
  33: Slide28,
  34: Slide29,
  35: (props) => <LectureThankYou {...props} />,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Estimation of Plumbing and Drainage System Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Internal Water Supply System Cover', type: 'Cover Slide', section: 'Water Supply' },
  3: { title: 'Piping Material Classifications', type: 'Concept Details', section: 'Water Supply' },
  4: { title: 'Running Center-line Metrics', type: 'Concept Details', section: 'Water Supply' },
  5: { title: 'Pipe Network Dimensions Sandbox', type: 'Live Sandbox', section: 'Water Supply' },
  6: { title: 'Pipe Transitions Quiz', type: 'Concept Details', section: 'Water Supply' },
  7: { title: 'The Piping Network: Isolating Fittings', type: 'Concept Details', section: 'Water Supply' },
  8: { title: 'Standard Measurement Units for Fittings', type: 'Concept Details', section: 'Water Supply' },
  9: { title: 'Formulating the Fittings BoM', type: 'Concept Details', section: 'Water Supply' },
  10: { title: 'Advanced Jointing & Wall Concealment', type: 'Concept Details', section: 'Water Supply' },
  11: { title: 'Groove Cutting & Jointing Sandbox', type: 'Live Sandbox', section: 'Water Supply' },
  12: { title: 'Fixtures & Appurtenances Cover', type: 'Cover Slide', section: 'Sanitary Fixtures' },
  13: { title: 'Water Closet Composite Bundles', type: 'Concept Details', section: 'Sanitary Fixtures' },
  14: { title: 'Wash Basins & Sinks Take-off', type: 'Concept Details', section: 'Sanitary Fixtures' },
  15: { title: 'WC Assembly Package Sandbox', type: 'Live Sandbox', section: 'Sanitary Fixtures' },
  16: { title: 'Fixture Packs Quiz', type: 'Concept Details', section: 'Sanitary Fixtures' },
  17: { title: 'Smart & Automated Bathroom Fixtures', type: 'Concept Details', section: 'Sanitary Fixtures' },
  18: { title: 'Drainage Pipe Geometry Cover', type: 'Cover Slide', section: 'Gravity Drainage' },
  19: { title: 'Functional Drainage Diameters', type: 'Concept Details', section: 'Gravity Drainage' },
  20: { title: 'Gravity Hydraulics & Cushioning', type: 'Concept Details', section: 'Gravity Drainage' },
  21: { title: 'Pipe Gradient & Trench Sandbox', type: 'Live Sandbox', section: 'Gravity Drainage' },
  22: { title: 'Trench Hydraulics Quiz', type: 'Concept Details', section: 'Gravity Drainage' },
  23: { title: 'External Sewerage Interface Cover', type: 'Cover Slide', section: 'External Sewerage' },
  24: { title: 'Inspection Chambers & Manholes', type: 'Concept Details', section: 'External Sewerage' },
  25: { title: 'Finalizing Plumbing & Drainage BoM', type: 'Concept Details', section: 'External Sewerage' },
  26: { title: 'Masonry Chamber Estimating Sandbox', type: 'Live Sandbox', section: 'External Sewerage' },
  27: { title: 'Inspection Chambers Quiz', type: 'Concept Details', section: 'External Sewerage' },
  28: { title: 'Trade Boundaries: Civil vs. Sanitary Works', type: 'Concept Details', section: 'External Sewerage' },
  29: { title: 'Segregating the BoQ Sub-Heads', type: 'Concept Details', section: 'External Sewerage' },
  30: { title: 'MEP Pipeline Sub-Networks', type: 'Concept Details', section: 'External Sewerage' },
  31: { title: 'MEP Sub-Networks Sandbox', type: 'Live Sandbox', section: 'External Sewerage' },
  32: { title: 'Lab Report 6 Studio Directive', type: 'Concept Details', section: 'External Sewerage' },
  33: { title: 'Preliminary Plumbing Budgets', type: 'Concept Details', section: 'Cost Estimation' },
  34: { title: 'The 8% Budget Validation Rule', type: 'Live Sandbox', section: 'Cost Estimation' },
  35: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};

