import React from 'react';
import { MorphingPath } from '@/shared/components/MorphingPath';
import { getShapePath } from './shapeUtils';

export interface ShapeMorphProps extends Omit<React.SVGProps<SVGPathElement>, 'd'> {
  /**
   * Shape type name: 'circle', 'rect', 'triangle', 'star', 'arrow', 'pentagon', 'hexagon', 'cross', 'heart', 'parallelogram', 'rhombus'
   */
  type: string;
  /**
   * Bounding box dimension (width and height)
   */
  size: number;
  /**
   * Path transition duration in milliseconds
   */
  duration?: number;
  /**
   * Easing function (e.g. 'ease-in-out', 'cubic-bezier(0.16, 1, 0.3, 1)')
   */
  easing?: string;
}

/**
 * ShapeMorph renders a vector shape that transitions smoothly when the 'type' or 'size' changes.
 * Under the hood, it converts shapes into polygons of exactly 120 vertices, enabling smooth native path morphing.
 */
export const ShapeMorph = React.forwardRef<SVGPathElement, ShapeMorphProps>(
  ({ type, size, duration = 800, easing = 'cubic-bezier(0.16, 1, 0.3, 1)', ...props }, ref) => {
    const pathD = getShapePath(type, size);

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
