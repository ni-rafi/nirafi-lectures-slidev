import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide1B, Slide2, Slide3, Slide3B, Slide3C } from './slides/OverviewSlides';
import { Slide4, Slide5, Slide5B, Slide5C, Slide6 } from './slides/SubstructureInterfaceSlides';
import { Slide7, Slide8, Slide8B, Slide8C, Slide9 } from './slides/RoofTrussSlides';
import { Slide10, Slide11, Slide11B, Slide11C, Slide12, Slide13, Slide14 } from './slides/ConnectionsSlides';

import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide1B,
  3: Slide2,
  4: Slide3,
  5: Slide3B,
  6: Slide3C,
  7: Slide4,
  8: Slide5,
  9: Slide5B,
  10: Slide5C,
  11: Slide6,
  12: Slide7,
  13: Slide8,
  14: Slide8B,
  15: Slide8C,
  16: Slide9,
  17: Slide10,
  18: Slide11,
  19: Slide11B,
  20: Slide11C,
  21: Slide12,
  22: Slide13,
  23: Slide14,
  24: (props) => <LectureThankYou {...props} />,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Steel & Truss Estimation Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Steel Fundamentals Divider', type: 'Cover Slide', section: 'Steel Fundamentals' },
  3: { title: 'Standard Steel Sections', type: 'Concept Details', section: 'Steel Fundamentals' },
  4: { title: 'Linear to Weight Rule', type: 'Concept Details', section: 'Steel Fundamentals' },
  5: { title: 'Steel Section Sandbox', type: 'Live Sandbox', section: 'Steel Fundamentals' },
  6: { title: 'Steel Nomenclature Quiz', type: 'Concept Details', section: 'Steel Fundamentals' },
  7: { title: 'Substructure Interface Divider', type: 'Cover Slide', section: 'Pedestals & Plates' },
  8: { title: 'Base Plates & Density Constant', type: 'Concept Details', section: 'Pedestals & Plates' },
  9: { title: 'Column Base Plate Sandbox', type: 'Live Sandbox', section: 'Pedestals & Plates' },
  10: { title: 'Base Plate Weight Quiz', type: 'Concept Details', section: 'Pedestals & Plates' },
  11: { title: 'Holding-Down Bolts', type: 'Concept Details', section: 'Pedestals & Plates' },
  12: { title: 'Roof Trusses Divider', type: 'Cover Slide', section: 'Roof Trusses' },
  13: { title: 'Truss Take-Off Architecture', type: 'Concept Details', section: 'Roof Trusses' },
  14: { title: 'Truss & Purlin Sandbox', type: 'Live Sandbox', section: 'Roof Trusses' },
  15: { title: 'Truss Purlin Lines Quiz', type: 'Concept Details', section: 'Roof Trusses' },
  16: { title: 'Longitudinal Spans & Splicing', type: 'Concept Details', section: 'Roof Trusses' },
  17: { title: 'Connections Divider', type: 'Cover Slide', section: 'Connections & Painting' },
  18: { title: 'Gusset Envelope Rule', type: 'Concept Details', section: 'Connections & Painting' },
  19: { title: 'Gusset Weight Sandbox', type: 'Live Sandbox', section: 'Connections & Painting' },
  20: { title: 'Gusset Envelope Quiz', type: 'Concept Details', section: 'Connections & Painting' },
  21: { title: 'Fasteners & Multipliers', type: 'Concept Details', section: 'Connections & Painting' },
  22: { title: 'Anti-Corrosive Painting', type: 'Concept Details', section: 'Connections & Painting' },
  23: { title: 'Lab Assignment Briefing', type: 'Concept Details', section: 'Connections & Painting' },
  24: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
