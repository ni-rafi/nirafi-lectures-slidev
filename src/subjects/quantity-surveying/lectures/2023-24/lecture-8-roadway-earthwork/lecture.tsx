import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6 as GeoSlide6
} from './slides/RoadwayGeometrySlides';
import {
  Slide6 as MethodSlide6,
  Slide7 as MethodSlide7,
  Slide8 as MethodSlide8,
  Slide9 as MethodSlide9,
  Slide16 as MethodSlide16,
  Slide17 as MethodSlide17,
  Slide19 as MethodSlide19
} from './slides/EarthworkMethodsSlides';
import {
  Slide7 as SoilSlide7,
  Slide8 as SoilSlide8,
  Slide9 as SoilSlide9,
  Slide10 as SoilSlide10,
  Slide11 as SoilSlide11,
  Slide12 as SoilSlide12
} from './slides/SoilVolumetricsSlides';
import {
  Slide13 as PwdSlide13,
  Slide14 as PwdSlide14,
  Slide15 as PwdSlide15,
  Slide16 as PwdSlide16,
  Slide17 as PwdSlide17
} from './slides/PWDRateAnalysisRulesAndQuizzes';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
  5: Slide5,
  6: MethodSlide6,
  7: MethodSlide7,
  8: MethodSlide8,
  9: MethodSlide9,
  10: GeoSlide6,
  11: SoilSlide7,
  12: SoilSlide8,
  13: SoilSlide9,
  14: SoilSlide10,
  15: SoilSlide11,
  16: MethodSlide16,
  17: MethodSlide17,
  18: SoilSlide12,
  19: MethodSlide19,
  20: PwdSlide13,
  21: PwdSlide14,
  22: PwdSlide15,
  23: PwdSlide16,
  24: PwdSlide17,
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
  6: { title: 'Core Methods for Earthwork Computation', type: 'Concept Details', section: 'Geometry' },
  7: { title: 'Mid-Section Method Formula', type: 'Concept Details', section: 'Geometry' },
  8: { title: 'Trapezoidal Method Formula', type: 'Concept Details', section: 'Geometry' },
  9: { title: 'Prismoidal Formula (Simpson\'s Rule)', type: 'Concept Details', section: 'Geometry' },
  10: { title: 'Longitudinal Profile Sandbox', type: 'Live Sandbox', section: 'Geometry' },
  11: { title: 'Soil Volumetrics & Compaction', type: 'Cover Slide', section: 'Soil Volumetrics' },
  12: { title: 'Volumetric States of Soil', type: 'Concept Details', section: 'Soil Volumetrics' },
  13: { title: 'Compaction & Bulking Sandbox', type: 'Live Sandbox', section: 'Soil Volumetrics' },
  14: { title: 'PWD Rate Analysis Standards', type: 'Cover Slide', section: 'PWD Standards' },
  15: { title: 'PWD Haulage Controls: Lead & Lift Rules', type: 'Concept Details', section: 'PWD Standards' },
  16: { title: 'Structuring the Earthwork Computation Table', type: 'Concept Details', section: 'PWD Standards' },
  17: { title: 'Ledger Adjustments for Advanced Methods', type: 'Concept Details', section: 'PWD Standards' },
  18: { title: 'PWD Tabular Earthwork Spreadsheet', type: 'Live Sandbox', section: 'PWD Standards' },
  19: { title: 'Spot Levels & The Grid Method', type: 'Concept Details', section: 'PWD Standards' },
  20: { title: 'Studio Directive & Measurement Rules', type: 'Cover Slide', section: 'Measurement Rules' },
  21: { title: 'Trades Segregation & Measurement Rules', type: 'Concept Details', section: 'Measurement Rules' },
  22: { title: 'Roadway Cross-Section Area Quiz', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec8_q1' },
  23: { title: 'Compacted Embankment Soil Volume Quiz', type: 'Concept Details', section: 'Quizzes', quizId: 'qs_2023_lec8_q2' },
  24: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
