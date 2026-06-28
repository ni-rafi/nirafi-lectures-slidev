import React from 'react';
import { GraphicalProblemSolverVisualizer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/GraphicalProblemSolverVisualizer';
import { ClickReveal } from '@/features/presentation/components/elements';
import { beamConfig } from '../../beamConfig';

export const Problem3Step0: React.FC = () => <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={0} />;

export const Problem3Step1: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={1} />
  </>
);

export const Problem3Step2: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={4} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={2} />
  </>
);

// SFD Node A Jump
export const Problem3Step3: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={3} />
  </>
);

// SFD Segment A-C Integration
export const Problem3Step4: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={4} />
  </>
);

// SFD Node C Check
export const Problem3Step5: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={5} />
  </>
);

// SFD Segment C-D Integration
export const Problem3Step6: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={6} />
  </>
);

// SFD Node D Check
export const Problem3Step7: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={7} />
  </>
);

// SFD Segment D-E Integration
export const Problem3Step8: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={8} />
  </>
);

// SFD Node E Jump
export const Problem3Step9: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={9} />
  </>
);

// SFD Segment E-B Integration
export const Problem3Step10: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={10} />
  </>
);

// SFD Node B Jump
export const Problem3Step11: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={11} />
  </>
);

// Zero-Shear explanation
export const Problem3Step12: React.FC = () => <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={12} />;

// Similar Triangles proof
export const Problem3Step13: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={4} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={13} />
  </>
);

// BMD Node A Check
export const Problem3Step14: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={14} />
  </>
);

// BMD Segment A-C Integration
export const Problem3Step15: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={15} />
  </>
);

// BMD Node C Check
export const Problem3Step16: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={16} />
  </>
);

// BMD Segment C-to-Peak Integration
export const Problem3Step17: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={17} />
  </>
);

// BMD Peak Moment Check
export const Problem3Step18: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={18} />
  </>
);

// BMD Segment Peak-to-D Integration
export const Problem3Step19: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={19} />
  </>
);

// BMD Node D Check
export const Problem3Step20: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={20} />
  </>
);

// BMD Segment D-E Integration
export const Problem3Step21: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={21} />
  </>
);

// BMD Node E Check
export const Problem3Step22: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={22} />
  </>
);

// BMD Segment E-B Integration
export const Problem3Step23: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={23} />
  </>
);

// BMD Node B Check
export const Problem3Step24: React.FC = () => (
  <>
    <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
    <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
    <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={24} />
  </>
);

// Solved Diagrams Recap
export const Problem3Step25: React.FC = () => <GraphicalProblemSolverVisualizer beam={beamConfig} stepIndex={25} />;
