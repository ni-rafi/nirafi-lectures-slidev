import React from 'react';
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

interface StepDiagramRendererProps {
  text: string;
  tab: string;
}

export const hasDiagram = (text: string): boolean => {
  const trimmed = text.trim();
  if (
    trimmed.startsWith('#') ||
    trimmed === '' ||
    trimmed.toLowerCase().includes('calculation steps') ||
    trimmed.toLowerCase().includes('calculation breakdown') ||
    trimmed.toLowerCase().includes('transforms the real beam') ||
    trimmed.toLowerCase().includes('equations are only solved')
  ) {
    return false;
  }
  return true;
};

export const StepDiagramRenderer: React.FC<StepDiagramRendererProps> = ({ text, tab }) => {
  if (!hasDiagram(text)) {
    return null;
  }

  switch (tab) {
    case 'doi':
      return <DoiStepVisual text={text} />;
    case 'reactions':
      return <ReactionsStepVisual text={text} />;
    case 'section':
      return <SectionStepVisual text={text} />;
    case 'graphical':
      return <GraphicalStepVisual text={text} />;
    case 'double-integration':
      return <DoubleIntegrationStepVisual text={text} />;
    case 'moment-area':
      return <MomentAreaStepVisual text={text} />;
    case 'conjugate-beam':
      return <ConjugateBeamStepVisual text={text} />;
    case 'stress':
      if (text.includes('R = \\sqrt') || text.includes('radius') || text.includes('radius $R$') || text.includes("Mohr's Circle")) {
        return <MicroMohrRadiusTriangle text={text} />;
      }
      if (text.includes('orientation') || text.includes('principal plane') || text.includes('rotation') || text.includes('theta_p') || text.includes('theta_s')) {
        return <MicroPrincipalRotation text={text} />;
      }
      if (text.includes('wedge') || text.includes('inclined plane')) {
        return <MicroStressWedge text={text} />;
      }
      return null;
    default:
      return null;
  }
};
