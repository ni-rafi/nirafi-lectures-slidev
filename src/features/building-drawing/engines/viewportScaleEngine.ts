import { Point2D, ViewBoxConfig } from '../types/geometry';

/**
 * Automatically computes a padded SVG viewBox based on a set of Cartesian coordinates
 * to keep the drawings responsive and centered.
 */
export function calculateDynamicViewBox(
  points: Point2D[],
  padding: number = 40
): ViewBoxConfig {
  if (points.length === 0) {
    return { viewBox: '0 0 500 400', scaleFactor: 1 };
  }

  const xCoords = points.map(p => p.x);
  const yCoords = points.map(p => p.y);

  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  const rawWidth = maxX - minX;
  const rawHeight = maxY - minY;

  // Safeguard against zero dimensions
  const width = rawWidth <= 0 ? 300 : rawWidth;
  const height = rawHeight <= 0 ? 300 : rawHeight;

  const viewBox = `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`;

  return {
    viewBox,
    scaleFactor: 1,
  };
}
