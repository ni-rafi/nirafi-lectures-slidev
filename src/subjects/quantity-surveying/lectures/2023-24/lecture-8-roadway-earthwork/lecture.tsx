import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6
} from './slides/RoadwayGeometrySlides';
import {
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12
} from './slides/SoilVolumetricsSlides';
import {
  Slide13,
  Slide14,
  Slide15,
  Slide16,
  Slide17
} from './slides/PWDRateAnalysisRulesAndQuizzes';

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
  1: { title: 'Roadway Earthwork Estimation', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Roadway Geometric Mechanics', type: 'Cover Slide', section: 'Geometry' },
  3: { title: 'Roadway Cross-Section Anatomy', type: 'Concept Details', section: 'Geometry' },
  4: { title: 'Cross-Section Area Sandbox', type: 'Live Sandbox', section: 'Geometry' },
  5: { title: 'Earthwork Mathematical Triad', type: 'Concept Details', section: 'Geometry' },
  6: { title: 'Longitudinal Profile Sandbox', type: 'Live Sandbox', section: 'Geometry' },
  7: { title: 'Soil Volumetrics & Compaction', type: 'Cover Slide', section: 'Soil Volumetrics' },
  8: { title: 'Volumetric States of Soil', type: 'Concept Details', section: 'Soil Volumetrics' },
  9: { title: 'Compaction & Bulking Sandbox', type: 'Live Sandbox', section: 'Soil Volumetrics' },
  10: { title: 'PWD Rate Analysis Standards', type: 'Cover Slide', section: 'PWD Standards' },
  11: { title: 'PWD Haulage Controls: Lead & Lift Rules', type: 'Concept Details', section: 'PWD Standards' },
  12: { title: 'PWD Tabular Earthwork Spreadsheet', type: 'Live Sandbox', section: 'PWD Standards' },
  13: { title: 'Studio Directive & Measurement Rules', type: 'Cover Slide', section: 'Measurement Rules' },
  14: { title: 'Trades Segregation & Measurement Rules', type: 'Concept Details', section: 'Measurement Rules' },
  15: { title: 'Roadway Cross-Section Area Quiz', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec8_q1' },
  16: { title: 'Compacted Embankment Soil Volume Quiz', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec8_q2' },
  17: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
