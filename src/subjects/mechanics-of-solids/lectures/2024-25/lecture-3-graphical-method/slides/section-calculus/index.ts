import { CalculusDivider } from './CalculusDivider';
import { GraphDegreeTransitions } from './GraphDegreeTransitions';
import { CurveCalculusSandbox } from './CurveCalculusSandbox';
import { CalculusQuizL3 } from './CalculusQuizL3';

export const slides = {
  1: CalculusDivider,
  2: GraphDegreeTransitions,
  3: CurveCalculusSandbox,
  4: CalculusQuizL3,
};

export const sectionMetadata = {
  1: { title: 'Calculus Section Divider', type: 'Section Divider', section: 'Calculus Basics' },
  2: { title: 'Integration & Differentiation of Graphs', type: 'Concept Details', section: 'Calculus Basics' },
  3: { title: 'Slope & Area Curve Sandbox', type: 'Interactive Sandbox', section: 'Calculus Basics' },
  4: { title: 'Calculus Checkpoint Quiz', type: 'Dynamic Quiz', section: 'Calculus Basics' },
};
