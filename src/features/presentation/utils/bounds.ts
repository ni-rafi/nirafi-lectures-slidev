import { VectorElement } from '../types';

/**
 * Calculates the bounding box coordinates (minX, minY, width, height)
 * of any vector drawing shape or stroke, incorporating translate offsets.
 */
export function getElementBounds(el: VectorElement) {
  if (el.points.length === 0) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  el.points.forEach((pt) => {
    minX = Math.min(minX, pt.x);
    maxX = Math.max(maxX, pt.x);
    minY = Math.min(minY, pt.y);
    maxY = Math.max(maxY, pt.y);
  });

  return {
    x: minX + el.translate.x,
    y: minY + el.translate.y,
    w: maxX - minX,
    h: maxY - minY,
  };
}
