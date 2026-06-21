import { Point2D } from '../types/geometry';
import { CrossSectionSpec } from '../types/sectionSchema';

export interface RebarMatrix {
  rebars: { point: Point2D; diameter: number }[];
  stirrupRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Calculates rebar dot positions and outer stirrup bounds inside a concrete cross-section.
 */
export function calculateRebarMatrix(spec: CrossSectionSpec): RebarMatrix {
  const stirrupDia = spec.stirrups.diameter || 8;
  const cc = spec.clearCover;

  const stirrupRect = {
    x: cc,
    y: cc,
    width: Math.max(0, spec.width - 2 * cc),
    height: Math.max(0, spec.depth - 2 * cc),
  };

  const rebars: { point: Point2D; diameter: number }[] = [];

  spec.longitudinalLayers.forEach(layer => {
    const barDia = layer.barDiameter;
    // Offset from outer face to rebar center (cover + stirrup dia + half bar dia)
    const centerOffset = cc + stirrupDia + barDia / 2;
    const coreWidth = spec.width - 2 * centerOffset;
    const coreHeight = spec.depth - 2 * centerOffset;

    if (layer.side === 'top' || layer.side === 'bottom') {
      const y = layer.side === 'top' ? centerOffset : spec.depth - centerOffset;
      const count = layer.count;

      if (count === 1) {
        rebars.push({ point: { x: spec.width / 2, y }, diameter: barDia });
      } else if (count > 1) {
        for (let i = 0; i < count; i++) {
          const x = centerOffset + (coreWidth / (count - 1)) * i;
          rebars.push({ point: { x, y }, diameter: barDia });
        }
      }
    } else if (layer.side === 'side') {
      const count = layer.count;
      // Distribute side bars along left and right faces, skipping corner nodes (which are handled by top/bottom)
      const barsPerSide = Math.ceil(count / 2);
      const distributeHeight = coreHeight;
      const step = barsPerSide > 1 ? distributeHeight / (barsPerSide + 1) : distributeHeight / 2;

      for (let i = 1; i <= barsPerSide; i++) {
        const y = centerOffset + step * i;
        // Left side bar
        rebars.push({ point: { x: centerOffset, y }, diameter: barDia });
        // Right side bar (if not exceeding total count)
        if (rebars.length < count + spec.longitudinalLayers.filter(l => l.side !== 'side').reduce((acc, curr) => acc + curr.count, 0)) {
          rebars.push({ point: { x: spec.width - centerOffset, y }, diameter: barDia });
        }
      }
    }
  });

  return { rebars, stirrupRect };
}
