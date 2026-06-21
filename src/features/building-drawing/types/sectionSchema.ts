import { ElementColorOverride } from './layoutSchema';

export interface RebarLayer {
  barDiameter: number; // in mm
  count: number;
  side: 'top' | 'bottom' | 'side';
}

export interface StirrupSchedule {
  diameter: number; // in mm
  spacing: number;  // in mm or meters
  colorClass?: string;
}

export interface CrossSectionSpec {
  id: string;
  componentType: 'beam' | 'column';
  width: number;       // element B
  depth: number;       // element D
  clearCover: number;  // internal offset perimeter
  longitudinalLayers: RebarLayer[];
  stirrups: StirrupSchedule;
  highlights?: ElementColorOverride[];
}

export interface SoilLayerSpec {
  depth: number;
  label: string;
  colorClass: string;
}

export interface PileFoundationSpec {
  id: string;
  pileCount: number;
  pileDiameter: number;
  pileDepth: number;
  capWidth: number;
  capDepth: number;
  soilLayers: SoilLayerSpec[];
  rebarDetails?: {
    pileDiameter: number;
    pileCount: number;
    capDiameter: number;
    capSpacing: number;
  };
}
