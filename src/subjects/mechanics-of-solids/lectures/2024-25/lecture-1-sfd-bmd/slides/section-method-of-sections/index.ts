import { Divider } from './Divider';
import { SixStepProtocol } from './SixStepProtocol';
import { LeftSegmentFBD } from './LeftSegmentFBD';
import { RightSegmentVerification } from './RightSegmentVerification';
import { WhyFunctionsNotNumbers } from './WhyFunctionsNotNumbers';
import { DiscontinuityTriggers } from './DiscontinuityTriggers';
import { PiecewiseIntervalPartition } from './PiecewiseIntervalPartition';
import { ZoneOneFBD } from './ZoneOneFBD';
import { MomentArmPrinciple } from './MomentArmPrinciple';
import { ProblemSetup } from './ProblemSetup';
import { ReactionsStep1 } from './ReactionsStep1';
import { ReactionsStep2 } from './ReactionsStep2';
import { ReactionsSolved } from './ReactionsSolved';
import { Interval1Analysis } from './Interval1Analysis';
import { Interval2Analysis } from './Interval2Analysis';
import { Consolidation } from './Consolidation';
import { DiagramOutput } from './DiagramOutput';
import { Conclusion } from './Conclusion';

export const slides = {
  17: Divider,
  18: SixStepProtocol,
  19: LeftSegmentFBD,
  20: RightSegmentVerification,
  21: WhyFunctionsNotNumbers,
  22: DiscontinuityTriggers,
  23: PiecewiseIntervalPartition,
  24: ZoneOneFBD,
  25: MomentArmPrinciple,
  26: ProblemSetup,
  27: ReactionsStep1,
  28: ReactionsStep2,
  29: ReactionsSolved,
  30: Interval1Analysis,
  31: Interval2Analysis,
  32: Consolidation,
  33: DiagramOutput,
  34: Conclusion,
};

export const sectionMetadata = {
  17: { title: 'Analytical Calculations: The Method of Sections', type: 'Cover Slide', section: 'Section Method' },
  18: { title: 'The 6-Step Protocol', type: 'Concept Details', section: 'Section Method' },
  19: { title: 'Left-Segment Static Solution', type: 'Concept Details', section: 'Section Method' },
  20: { title: 'Right-Segment Verification', type: 'Concept Details', section: 'Section Method' },
  21: { title: 'Continuous Diagrams & Functions', type: 'Concept Details', section: 'Section Method' },
  22: { title: 'Locational Discontinuities & Triggers', type: 'Concept Details', section: 'Section Method' },
  23: { title: 'Interval Partitioning & Piecewise Boundaries', type: 'Concept Details', section: 'Section Method' },
  24: { title: 'Constructing Equation 1 (Zone 1)', type: 'Concept Details', section: 'Section Method' },
  25: { title: 'The Moment Arm Principle', type: 'Concept Details', section: 'Section Method' },
  26: { title: 'Problem 1 Setup', type: 'Concept Details', section: 'Section Method' },
  27: { title: 'Support Reactions - Moment about Support A', type: 'Concept Details', section: 'Section Method' },
  28: { title: 'Support Reactions - Vertical Force Summation', type: 'Concept Details', section: 'Section Method' },
  29: { title: 'Support Reactions Solved', type: 'Concept Details', section: 'Section Method' },
  30: { title: 'Section Method - Interval 1 (0 <= x <= 8 m)', type: 'Concept Details', section: 'Section Method' },
  31: { title: 'Section Method - Interval 2 (8 <= x <= 16 m)', type: 'Concept Details', section: 'Section Method' },
  32: { title: 'Differential Relationships - Consolidation', type: 'Concept Details', section: 'Section Method' },
  33: { title: 'Shear Force & Bending Moment Diagrams', type: 'Concept Details', section: 'Section Method' },
  34: { title: 'Conclusion', type: 'Thank You Slide', section: 'Conclusion' },
};
