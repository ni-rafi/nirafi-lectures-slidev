export interface GridAxis {
  id: string;
  offset: number; // Offset from origin in mm or meters
  label: string;  // e.g. "A", "B", "1", "2"
}

export interface GridSystem {
  xAxes: GridAxis[];
  yAxes: GridAxis[];
}

export interface DragPosition {
  gridXId: string;
  gridYId: string;
}

export interface ElementColorOverride {
  startFraction: number; // 0.0 to 1.0
  endFraction: number;
  fillClass?: string;    // CSS classes, e.g. "fill-emerald-500/30"
  strokeClass?: string;  // CSS classes, e.g. "stroke-destructive"
}

export interface PlanColumn {
  id: string;
  gridPlacement: DragPosition;
  width: number;      // dimensions in mm or meters (B)
  depth: number;      // dimension (D)
  alignmentOffset: { x: number; y: number }; // free drag adjustments
  fillColor?: string;
  strokeColor?: string;
}

export interface PlanOpening {
  id: string;
  relativeOffset: number; // offset along clear span (0.0 to 1.0)
  clearanceWidth: number; // width of opening in mm or meters
  type: 'door' | 'window';
}

export interface PlanBeam {
  id: string;
  startNodeId: string; // column ID or grid cross-intersection
  endNodeId: string;
  thickness: number;
  eccentricityOffset?: number; // sideways translation
  openings?: PlanOpening[];
  highlights?: ElementColorOverride[];
  fillColor?: string;
  strokeColor?: string;
}

export interface PlanSlab {
  id: string;
  boundaryGridIds: string[]; // loop of grid node IDs
  highlights?: ElementColorOverride[];
  fillColor?: string;
}

export interface PlanLayoutSchema {
  grid: GridSystem;
  columns: PlanColumn[];
  beams: PlanBeam[];
  slabs: PlanSlab[];
}
