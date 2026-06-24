import React from 'react';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';

import { Slide1, Slide1B, Slide2, Slide3, Slide3B, Slide3C } from './slides/OverviewSlides';
import { Slide4, Slide5, Slide5B, Slide5C, Slide6 } from './slides/SubstructureInterfaceSlides';
import { Slide7, Slide8, Slide8B, Slide8C, Slide9 } from './slides/RoofTrussSlides';
import {
  TrussTypologySlide,
  TrussGeometrySlide,
  SecondaryFramingSlide,
  CgiRoofingSlide,
  CgiRoofingSandboxSlide,
  PwdSectionWeightSlide,
  SecondaryFramingSandboxSlide
} from './slides/TrussTypologySlides';
import { SteelLedgerSlide, SteelLedgerSandboxSlide } from './slides/SteelLedgerSlides';
import { Slide10, Slide11, Slide11B, Slide11C, Slide12, Slide13, Slide14 } from './slides/ConnectionsSlides';
import { CostingErectionSlide, PwdGradesCostSlide } from './slides/CostEstimationSlides';

import { LectureThankYou } from '@/shared/layouts/LectureThankYou';

export const slides: Record<number, React.ComponentType<SlideProps>> = {
  1: Slide1,
  2: Slide1B,
  3: Slide2,
  4: Slide3,
  5: PwdSectionWeightSlide,
  6: Slide3B,
  7: Slide3C,
  8: Slide4,
  9: Slide5,
  10: Slide5B,
  11: Slide5C,
  12: Slide6,
  13: Slide7,
  14: TrussTypologySlide,
  15: TrussGeometrySlide,
  16: SecondaryFramingSlide,
  17: SecondaryFramingSandboxSlide,
  18: CgiRoofingSlide,
  19: CgiRoofingSandboxSlide,
  20: Slide8,
  21: Slide8B,
  22: Slide8C,
  23: Slide9,
  24: SteelLedgerSlide,
  25: SteelLedgerSandboxSlide,
  26: Slide10,
  27: Slide11,
  28: Slide11B,
  29: Slide11C,
  30: Slide12,
  31: Slide13,
  32: CostingErectionSlide,
  33: PwdGradesCostSlide,
  34: Slide14,
  35: (props) => <LectureThankYou {...props} />,
};

export const slideMetadata: Record<
  number,
  import('@/features/presentation/components/slides/SlideRenderer').SlideMetadata
> = {
  1: { title: 'Steel & Truss Estimation Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Steel Fundamentals Divider', type: 'Cover Slide', section: 'Steel Fundamentals' },
  3: { title: 'Standard Steel Sections', type: 'Concept Details', section: 'Steel Fundamentals' },
  4: { title: 'Linear to Weight Rule', type: 'Concept Details', section: 'Steel Fundamentals' },
  5: { title: 'PWD Section Weight Tables', type: 'Live Sandbox', section: 'Steel Fundamentals' },
  6: { title: 'Steel Section Sandbox', type: 'Live Sandbox', section: 'Steel Fundamentals' },
  7: { title: 'Steel Nomenclature Quiz', type: 'Concept Details', section: 'Steel Fundamentals' },
  8: { title: 'Substructure Interface Divider', type: 'Cover Slide', section: 'Pedestals & Plates' },
  9: { title: 'Base Plates & Density Constant', type: 'Concept Details', section: 'Pedestals & Plates' },
  10: { title: 'Column Base Plate Sandbox', type: 'Live Sandbox', section: 'Pedestals & Plates' },
  11: { title: 'Base Plate Weight Quiz', type: 'Concept Details', section: 'Pedestals & Plates' },
  12: { title: 'Holding-Down Bolts', type: 'Concept Details', section: 'Pedestals & Plates' },
  13: { title: 'Roof Trusses Divider', type: 'Cover Slide', section: 'Roof Trusses' },
  14: { title: 'Truss Typologies', type: 'Concept Details', section: 'Roof Trusses' },
  15: { title: 'Primary Truss Geometry', type: 'Concept Details', section: 'Roof Trusses' },
  16: { title: 'Secondary Framing Components', type: 'Concept Details', section: 'Roof Trusses' },
  17: { title: 'Secondary Framing Sandbox', type: 'Live Sandbox', section: 'Roof Trusses' },
  18: { title: 'Estimating Sheet Roofing (Corrugated Cladding)', type: 'Concept Details', section: 'Roof Trusses' },
  19: { title: 'CGI Roofing Sheet Sandbox', type: 'Live Sandbox', section: 'Roof Trusses' },
  20: { title: 'Truss Take-Off Architecture', type: 'Concept Details', section: 'Roof Trusses' },
  21: { title: 'Truss & Purlin Sandbox', type: 'Live Sandbox', section: 'Roof Trusses' },
  22: { title: 'Truss Purlin Lines Quiz', type: 'Concept Details', section: 'Roof Trusses' },
  23: { title: 'Longitudinal Spans & Splicing', type: 'Concept Details', section: 'Roof Trusses' },
  24: { title: 'Steel Calculation Ledger Layout', type: 'Concept Details', section: 'Roof Trusses' },
  25: { title: 'Steel Calculation Ledger Sandbox', type: 'Live Sandbox', section: 'Roof Trusses' },
  26: { title: 'Connections Divider', type: 'Cover Slide', section: 'Connections & Painting' },
  27: { title: 'Gusset Envelope Rule', type: 'Concept Details', section: 'Connections & Painting' },
  28: { title: 'Gusset Weight Sandbox', type: 'Live Sandbox', section: 'Connections & Painting' },
  29: { title: 'Gusset Envelope Quiz', type: 'Concept Details', section: 'Connections & Painting' },
  30: { title: 'Fasteners & Multipliers', type: 'Concept Details', section: 'Connections & Painting' },
  31: { title: 'Anti-Corrosive Painting', type: 'Concept Details', section: 'Connections & Painting' },
  32: { title: 'Costing & Erection Rules', type: 'Concept Details', section: 'Cost Estimation' },
  33: { title: 'PWD Rates & ASTM Grades Sandbox', type: 'Live Sandbox', section: 'Cost Estimation' },
  34: { title: 'Lab Assignment Briefing', type: 'Concept Details', section: 'Connections & Painting' },
  35: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};

