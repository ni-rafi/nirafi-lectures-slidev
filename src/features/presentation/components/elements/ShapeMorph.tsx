import React from 'react';
import { MorphingPath } from '@/shared/components/MorphingPath';
import { getShapePath } from './shapeUtils';

export interface ShapeMorphProps extends Omit<React.SVGProps<SVGPathElement>, 'd'> {
  /**
   * Shape type name
   */
  type: string;
  /**
   * Optional width and height bounds
   */
  w?: number;
  h?: number;
  /**
   * Bounding box dimension fallback (width and height)
   */
  size?: number;
  /**
   * Custom vertices for polygons
   */
  points?: Array<{ x: number; y: number }>;
  /**
   * Corner radius for rectangles
   */
  borderRadius?: number;
  /**
   * Path transition duration in milliseconds
   */
  duration?: number;
  /**
   * Easing function
   */
  easing?: string;
}

/**
 * ShapeMorph renders a vector shape that transitions smoothly when properties change.
 */
export const ShapeMorph = React.forwardRef<SVGPathElement, ShapeMorphProps>(
  ({ type, w, h, size, points, borderRadius, duration = 800, easing = 'cubic-bezier(0.16, 1, 0.3, 1)', ...props }, ref) => {
    const width = w ?? size ?? 100;
    const height = h ?? size ?? 100;
    const pathD = getShapePath(type, width, height, 120, points, borderRadius);

    return (
      <MorphingPath
        ref={ref}
        d={pathD}
        duration={duration}
        easing={easing}
        animateProps={['fill', 'stroke']}
        {...props}
      />
    );
  }
);

ShapeMorph.displayName = 'ShapeMorph';

export default ShapeMorph;
