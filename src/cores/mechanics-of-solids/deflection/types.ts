export interface IEISegment {
  id: string;
  startPosition: number;
  endPosition: number;
  E: number; // in GPa (e.g. 200)
  I: number; // in 10^6 mm^4 (e.g. 100)
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
  equationM: string;       // LaTeX equation of moment
  equationSlope: string;   // LaTeX equation of slope (with C1)
  equationDeflection: string; // LaTeX equation of deflection (with C1, C2)
  C1: number;
  C2: number;
}

export interface IDoubleIntegrationDetails {
  intervals: IDoubleIntegrationInterval[];
  boundaryConditions: string[];
  solvedConstants: { name: string; value: number }[];
}

export interface IMomentAreaSegment {
  startX: number;
  endX: number;
  description: string;
  area: number;             // Area under M/EI curve
  centroidX: number;        // Centroid coordinate x
  momentOfAreaAboutLeft: number;  // Area * (x - startX)
  momentOfAreaAboutRight: number; // Area * (endX - x)
}

export interface IMomentAreaDetails {
  segments: IMomentAreaSegment[];
  referencePoint: number;
  calculations: string[];
}

export interface IConjugateReaction {
  supportId: string;
  type: 'R_y' | 'M';
  value: number;
}

export interface IConjugateBeamDetails {
  supports: { position: number; type: string }[];
  reactions: IConjugateReaction[];
  steps: string[];
}

export interface IDeflectionResult {
  success: boolean;
  points: IDeflectionPoint[];
  criticalPoints: ICriticalDeflectionPoint[];
  steps: string[];
  doubleIntegration?: IDoubleIntegrationDetails;
  momentArea?: IMomentAreaDetails;
  conjugateBeam?: IConjugateBeamDetails;
}
