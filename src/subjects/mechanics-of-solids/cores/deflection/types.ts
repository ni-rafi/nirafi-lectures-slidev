import { ICrossSection } from '../stress/stress.interface';

export interface IEISegment {
  id: string;
  startPosition: number;
  endPosition: number;
  E: number; // in GPa (e.g. 200)
  I: number; // in 10^6 mm^4 (e.g. 100)
  shape?: ICrossSection;
}

export interface IDeflectionPoint {
  x: number;
  slope: number;       // in radians
  deflection: number;  // in mm
}

export interface ICriticalDeflectionPoint {
  x: number;
  label: string;
  slope: number;
  deflection: number;
}

export interface IDoubleIntegrationInterval {
  startX: number;
  endX: number;
  mCoeffs: number[];
  slopeCoeffs: number[];
  deflCoeffs: number[];
  C1: number;
  C2: number;
  EI: number;
  latexM: string;
}

export interface IDoubleIntegrationBC {
  type: 'deflection-support' | 'slope-fixed' | 'deflection-continuity' | 'slope-continuity' | 'hinge-discontinuity';
  position: number;
  segmentIndex1: number;
  segmentIndex2?: number;
  supportType?: string;
}

export interface IDoubleIntegrationDetails {
  intervals: IDoubleIntegrationInterval[];
  boundaryConditions: IDoubleIntegrationBC[];
  solvedConstants: { name: string; value: number }[];
}

export interface IMomentAreaSegment {
  startX: number;
  endX: number;
  area: number;             // Area under M/EI curve
  centroidX: number;        // Centroid coordinate x
  momentOfAreaAboutLeft: number;  // Area * (x - startX)
  momentOfAreaAboutRight: number; // Area * (endX - x)
}

export interface IMomentAreaDetails {
  segments: IMomentAreaSegment[];
  referencePoint: number;
  referencePointB?: number;
  tBA?: number;
  thetaA?: number;
  isCantilever: boolean;
}

export interface IConjugateReaction {
  supportId: string;
  type: 'R_y' | 'M';
  value: number;
}

export interface IConjugateBeamDetails {
  supports: { position: number; type: string }[];
  reactions: IConjugateReaction[];
}

export interface IDeflectionResult {
  success: boolean;
  points: IDeflectionPoint[];
  criticalPoints: ICriticalDeflectionPoint[];
  doubleIntegration?: IDoubleIntegrationDetails;
  momentArea?: IMomentAreaDetails;
  conjugateBeam?: IConjugateBeamDetails;
}

