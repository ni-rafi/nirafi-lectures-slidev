/**
 * Core slide canvas dimensions configuration.
 */
export interface SlideDimensions {
  /** Width in pixels of the virtual slide canvas */
  width: number;
  /** Aspect ratio of the canvas width/height (e.g. 16/9 = 1.777) */
  aspectRatio: number;
}

/**
 * Per-slide parameters configuration.
 */
export interface SlideConfig {
  /** Scaling factor override for this specific slide (e.g. 0.8) */
  zoom?: number;
}

/**
 * Single coordinate point representation.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents a single drawn line stroke.
 */
export interface DrawingStroke {
  points: Point[];
  color: string;
  width: number;
  isEraser?: boolean;
}

