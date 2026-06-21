export interface Point2D {
  x: number;
  y: number;
}

export interface BoxGeometry {
  id: string;
  topLeft: Point2D;
  width: number;
  height: number;
}

export interface LineGeometry {
  id: string;
  start: Point2D;
  end: Point2D;
  thickness: number;
}

export interface ViewBoxConfig {
  viewBox: string;
  scaleFactor: number;
}
