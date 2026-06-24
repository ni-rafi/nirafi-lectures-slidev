import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 } from './slides/WaterSupplySlides';
import { Slide7, Slide8, Slide9, Slide10, Slide11 } from './slides/FixturePacksSlides';
import { Slide12, Slide13, Slide14, Slide15, Slide16 } from './slides/DrainageSlides';
import { Slide17, Slide18, Slide19, Slide20, Slide21, Slide22 } from './slides/ExternalSewerageSlides';

import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

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
  20: Slide20,
  21: Slide21,
  22: Slide22,
  23: (props) => <LectureThankYou {...props} />,
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
  7: { title: 'Fixtures & Appurtenances Cover', type: 'Cover Slide', section: 'Sanitary Fixtures' },
  8: { title: 'Water Closet Composite Bundles', type: 'Concept Details', section: 'Sanitary Fixtures' },
  9: { title: 'Wash Basins & Sinks Take-off', type: 'Concept Details', section: 'Sanitary Fixtures' },
  10: { title: 'WC Assembly Package Sandbox', type: 'Live Sandbox', section: 'Sanitary Fixtures' },
  11: { title: 'Fixture Packs Quiz', type: 'Concept Details', section: 'Sanitary Fixtures' },
  12: { title: 'Drainage Pipe Geometry Cover', type: 'Cover Slide', section: 'Gravity Drainage' },
  13: { title: 'Functional Drainage Diameters', type: 'Concept Details', section: 'Gravity Drainage' },
  14: { title: 'Gravity Hydraulics & Cushioning', type: 'Concept Details', section: 'Gravity Drainage' },
  15: { title: 'Pipe Gradient & Trench Sandbox', type: 'Live Sandbox', section: 'Gravity Drainage' },
  16: { title: 'Trench Hydraulics Quiz', type: 'Concept Details', section: 'Gravity Drainage' },
  17: { title: 'External Sewerage Interface Cover', type: 'Cover Slide', section: 'External Sewerage' },
  18: { title: 'Inspection Chambers & Manholes', type: 'Concept Details', section: 'External Sewerage' },
  19: { title: 'Finalizing Plumbing & Drainage BoM', type: 'Concept Details', section: 'External Sewerage' },
  20: { title: 'Masonry Chamber Estimating Sandbox', type: 'Live Sandbox', section: 'External Sewerage' },
  21: { title: 'Inspection Chambers Quiz', type: 'Concept Details', section: 'External Sewerage' },
  22: { title: 'Lab Report 6 Studio Directive', type: 'Concept Details', section: 'External Sewerage' },
  23: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
