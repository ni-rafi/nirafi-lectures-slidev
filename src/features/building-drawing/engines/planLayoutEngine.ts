import { GridSystem, PlanColumn, PlanBeam } from '../types/layoutSchema';
import { BoxGeometry, LineGeometry } from '../types/geometry';
import { resolveGridIntersection } from './gridCoordinateEngine';
import { trimBeamToColumnFaces } from './trimIntersectionEngine';

/**
 * Resolves absolute bounding boxes for columns based on their grid placement and manual offsets.
 */
export function calculateColumnsGeometry(columns: PlanColumn[], grid: GridSystem): BoxGeometry[] {
  return columns.map(col => {
    const center = resolveGridIntersection(col.gridPlacement.gridXId, col.gridPlacement.gridYId, grid);
    return {
      id: col.id,
      topLeft: {
        x: center.x - col.width / 2 + col.alignmentOffset.x,
        y: center.y - col.depth / 2 + col.alignmentOffset.y,
      },
      width: col.width,
      height: col.depth,
    };
  });
}

/**
 * Resolves edge-trimmed beam geometries from column bounds or grid intersections.
 */
export function calculateBeamsGeometry(
  beams: PlanBeam[],
  columnsGeo: BoxGeometry[],
  grid: GridSystem
): LineGeometry[] {
  return beams.map(bm => {
    const startCol = columnsGeo.find(c => c.id === bm.startNodeId);
    const endCol = columnsGeo.find(c => c.id === bm.endNodeId);

    let startCenter = { x: 0, y: 0 };
    let endCenter = { x: 200, y: 200 };

    if (startCol) {
      startCenter = { x: startCol.topLeft.x + startCol.width / 2, y: startCol.topLeft.y + startCol.height / 2 };
    } else {
      const parts = bm.startNodeId.split('-');
      if (parts.length === 2) startCenter = resolveGridIntersection(parts[0] || '', parts[1] || '', grid);
    }

    if (endCol) {
      endCenter = { x: endCol.topLeft.x + endCol.width / 2, y: endCol.topLeft.y + endCol.height / 2 };
    } else {
      const parts = bm.endNodeId.split('-');
      if (parts.length === 2) endCenter = resolveGridIntersection(parts[0] || '', parts[1] || '', grid);
    }

    const trimmed = trimBeamToColumnFaces(startCenter, endCenter, bm.eccentricityOffset || 0, startCol, endCol);
    return {
      id: bm.id,
      start: trimmed.start,
      end: trimmed.end,
      thickness: bm.thickness,
    };
  });
}

/**
 * Finds the nearest grid intersection node to target coordinates.
 */
export function findNearestGridIntersection(
  targetX: number,
  targetY: number,
  grid: GridSystem
): { gridXId: string; gridYId: string; distance: number } {
  let nearestXAxis = '';
  let nearestYAxis = '';
  let minDistance = Infinity;

  grid.xAxes.forEach(xAxis => {
    grid.yAxes.forEach(yAxis => {
      const ix = resolveGridIntersection(xAxis.id, yAxis.id, grid);
      const dist = Math.sqrt((ix.x - targetX) ** 2 + (ix.y - targetY) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        nearestXAxis = xAxis.id;
        nearestYAxis = yAxis.id;
      }
    });
  });

  return { gridXId: nearestXAxis, gridYId: nearestYAxis, distance: minDistance };
}
