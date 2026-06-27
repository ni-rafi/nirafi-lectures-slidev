import { PlotSegment1L2 } from './PlotSegment1L2';
import { PlotSegment2L2 } from './PlotSegment2L2';
import { PlotSegment3L2 } from './PlotSegment3L2';
import { PlotSegment4L2 } from './PlotSegment4L2';
import { CalculusLinkL2 } from './CalculusLinkL2';
import { ZeroShearLocL2 } from './ZeroShearLocL2';
import { ZeroShearQuizL2 } from './ZeroShearQuizL2';
import { DiagramOutputL2 } from './DiagramOutputL2';
import { ConclusionL2 } from './ConclusionL2';

export const slides = {
  17: PlotSegment1L2,
  18: CalculusLinkL2,
  19: ZeroShearLocL2,
  20: ZeroShearQuizL2,
  21: PlotSegment2L2,
  22: PlotSegment3L2,
  23: PlotSegment4L2,
  24: DiagramOutputL2,
  25: ConclusionL2,
};

export const sectionMetadata = {
  17: { title: 'Plotting Segment 1 (0 to 5m)', type: 'Concept Details', section: 'Diagram Plotting' },
  18: { title: 'The Calculus Link: Peak Moment', type: 'Concept Details', section: 'Diagram Plotting' },
  19: { title: 'Locating the Zero Shear Coordinate', type: 'Concept Details', section: 'Diagram Plotting' },
  20: { title: 'Checkpoint 4: Zero Shear Quiz', type: 'Concept Details', section: 'Diagram Plotting' },
  21: { title: 'Plotting Segment 2 (5 to 12m)', type: 'Concept Details', section: 'Diagram Plotting' },
  22: { title: 'Plotting Segment 3 (12 to 17m)', type: 'Concept Details', section: 'Diagram Plotting' },
  23: { title: 'Plotting Segment 4 (17 to 20m)', type: 'Concept Details', section: 'Diagram Plotting' },
  24: { title: 'SFD & BMD Final Solved Diagrams', type: 'Concept Details', section: 'Diagram Plotting' },
  25: { title: 'Shapes & Edge-Point Plotting Conclusion', type: 'Cover Slide', section: 'Conclusion' },
};
