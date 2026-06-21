import React from 'react';
import { logger } from '@/cores/logger/logger';
import { DoiStepVisual } from './diagrams/DoiStepVisual';
import { ReactionsStepVisual } from './diagrams/ReactionsStepVisual';
import { SectionStepVisual } from './diagrams/SectionStepVisual';
import { GraphicalStepVisual } from './diagrams/GraphicalStepVisual';
import { DoubleIntegrationStepVisual } from './diagrams/DoubleIntegrationStepVisual';
import { MomentAreaStepVisual } from './diagrams/MomentAreaStepVisual';
import { ConjugateBeamStepVisual } from './diagrams/ConjugateBeamStepVisual';
import { MicroStressWedge } from './diagrams/MicroStressWedge';
import { MicroMohrRadiusTriangle } from './diagrams/MicroMohrRadiusTriangle';
import { MicroPrincipalRotation } from './diagrams/MicroPrincipalRotation';
import { ICalculationStep } from '../../types/stepTypes';

interface StepDiagramRendererProps {
  step: ICalculationStep;
  tab: string;
}

export const hasDiagram = (step: ICalculationStep, tab: string): boolean => {
  switch (tab) {
    case 'doi':
      return step.type === 'doi-support-reaction' || step.type === 'doi-release-condition';
    case 'reactions':
      return step.type === 'reaction-equation';
    case 'section':
      return step.type === 'section-interval';
    case 'graphical':
      return step.type === 'graphical-sfd-step' || step.type === 'graphical-bmd-step';
    case 'double-integration':
      return step.type === 'di-boundary-condition' || step.type === 'di-segmentation';
    case 'moment-area':
      return step.type === 'ma-segment' || step.type === 'ma-reference-tangent';
    case 'conjugate-beam':
      return step.type === 'cb-transformation' || step.type === 'cb-reaction';
    case 'stress':
      return (
        step.type === 'stress-wedge-graphic' ||
        step.type === 'stress-circle-radius' ||
        step.type === 'stress-principal-rotation'
      );
    default:
      return false;
  }
};

const stepLogger = logger.child('StepDiagramRenderer');

export const StepDiagramRenderer: React.FC<StepDiagramRendererProps> = ({ step, tab }) => {
  const hasDiag = hasDiagram(step, tab);
  stepLogger.debug('StepDiagramRenderer evaluation', { text: step.text, tab, hasDiag });

  if (!hasDiag) {
    return null;
  }

  switch (tab) {
    case 'doi':
      return <DoiStepVisual step={step} />;
    case 'reactions':
      return <ReactionsStepVisual step={step} />;
    case 'section':
      return <SectionStepVisual step={step} />;
    case 'graphical':
      return <GraphicalStepVisual step={step} />;
    case 'double-integration':
      return <DoubleIntegrationStepVisual step={step} />;
    case 'moment-area':
      return <MomentAreaStepVisual step={step} />;
    case 'conjugate-beam':
      return <ConjugateBeamStepVisual step={step} />;
    case 'stress':
      if (step.type === 'stress-circle-radius') {
        return <MicroMohrRadiusTriangle step={step} />;
      }
      if (step.type === 'stress-principal-rotation') {
        return <MicroPrincipalRotation step={step} />;
      }
      if (step.type === 'stress-wedge-graphic') {
        return <MicroStressWedge step={step} />;
      }
      return null;
    default:
      return null;
  }
};

