export interface Point2D {
  x: number;
  y: number;
}

/**
 * Samples a polygon defined by its vertices into exactly N points distributed evenly along its perimeter.
 */
export function samplePolygon(vertices: Point2D[], N: number): Point2D[] {
  const M = vertices.length;
  if (M === 0) return Array.from({ length: N }, () => ({ x: 0, y: 0 }));

  const lengths: number[] = [];
  let totalPerimeter = 0;
  for (let k = 0; k < M; k++) {
    const v1 = vertices[k] ?? { x: 0, y: 0 };
    const v2 = vertices[(k + 1) % M] ?? { x: 0, y: 0 };
    const len = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
    lengths.push(len);
    totalPerimeter += len;
  }

  const cumulative: number[] = [0];
  for (let k = 0; k < M; k++) {
    const prevCum = cumulative[k] ?? 0;
    const len = lengths[k] ?? 0;
    cumulative.push(prevCum + len);
  }

  const points: Point2D[] = [];
  for (let i = 0; i < N; i++) {
    const targetDist = (i * totalPerimeter) / N;
    
    // Find corresponding segment
    let segmentIndex = 0;
    for (let k = 0; k < M; k++) {
      const currentCum = cumulative[k] ?? 0;
      const nextCum = cumulative[k + 1] ?? 0;
      if (targetDist >= currentCum && targetDist <= nextCum) {
        segmentIndex = k;
        break;
      }
    }
    
    const startDist = cumulative[segmentIndex] ?? 0;
    const segLen = lengths[segmentIndex] ?? 0;
    const t = segLen > 0 ? (targetDist - startDist) / segLen : 0;
    const v1 = vertices[segmentIndex] ?? { x: 0, y: 0 };
    const v2 = vertices[(segmentIndex + 1) % M] ?? { x: 0, y: 0 };
    
    points.push({
      x: v1.x + t * (v2.x - v1.x),
      y: v1.y + t * (v2.y - v1.y),
    });
  }
  
  return points;
}

/**
 * Generates N vertices representing a pre-built geometric shape, scaled and centered in a box of w x h.
 */
export function getShapePoints(
  type: string,
  w: number,
  h: number,
  N = 120,
  points?: Point2D[],
  borderRadius?: number
): Point2D[] {
  const C = w / 2;
  const Cy = h / 2;
  const Rx = w / 2;
  const Ry = h / 2;

  if (type === 'polygon' && points && points.length >= 3) {
    return samplePolygon(points, N);
  }

  if (type === 'circle') {
    const pts: Point2D[] = [];
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / N;
      pts.push({
        x: C + Rx * Math.cos(theta),
        y: Cy + Ry * Math.sin(theta),
      });
    }
    return pts;
  }

  if (type === 'heart') {
    const rawPoints: Point2D[] = [];
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / N;
      const sin = Math.sin(theta);
      const xRaw = 16 * Math.pow(sin, 3);
      const yRaw = -(13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));
      
      rawPoints.push({ x: xRaw, y: yRaw });
      if (xRaw < minX) minX = xRaw;
      if (xRaw > maxX) maxX = xRaw;
      if (yRaw < minY) minY = yRaw;
      if (yRaw > maxY) maxY = yRaw;
    }

    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const maxSpanX = spanX || 1;
    const maxSpanY = spanY || 1;
    const scaleX = (w * 0.9) / maxSpanX;
    const scaleY = (h * 0.9) / maxSpanY;
    const centerXRaw = (minX + maxX) / 2;
    const centerYRaw = (minY + maxY) / 2;

    return rawPoints.map(p => ({
      x: C + (p.x - centerXRaw) * scaleX,
      y: Cy + (p.y - centerYRaw) * scaleY,
    }));
  }

  let vertices: Point2D[] = [];

  switch (type) {
    case 'rect':
    case 'square':
      const r = Math.min(borderRadius || 0, w / 2, h / 2);
      if (r <= 0) {
        vertices = [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: h },
          { x: 0, y: h },
        ];
      } else {
        const steps = 8;
        // Top-Left corner
        for (let i = 0; i <= steps; i++) {
          const theta = Math.PI + (Math.PI / 2) * (i / steps);
          vertices.push({ x: r + r * Math.cos(theta), y: r + r * Math.sin(theta) });
        }
        // Top-Right corner
        for (let i = 0; i <= steps; i++) {
          const theta = 1.5 * Math.PI + (Math.PI / 2) * (i / steps);
          vertices.push({ x: w - r + r * Math.cos(theta), y: r + r * Math.sin(theta) });
        }
        // Bottom-Right corner
        for (let i = 0; i <= steps; i++) {
          const theta = (Math.PI / 2) * (i / steps);
          vertices.push({ x: w - r + r * Math.cos(theta), y: h - r + r * Math.sin(theta) });
        }
        // Bottom-Left corner
        for (let i = 0; i <= steps; i++) {
          const theta = 0.5 * Math.PI + (Math.PI / 2) * (i / steps);
          vertices.push({ x: r + r * Math.cos(theta), y: h - r + r * Math.sin(theta) });
        }
      }
      break;
    case 'triangle':
      vertices = [
        { x: C, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ];
      break;
    case 'pentagon':
      for (let k = 0; k < 5; k++) {
        const theta = -Math.PI / 2 + (2 * Math.PI * k) / 5;
        vertices.push({ x: C + Rx * Math.cos(theta), y: Cy + Ry * Math.sin(theta) });
      }
      break;
    case 'hexagon':
      for (let k = 0; k < 6; k++) {
        const theta = -Math.PI / 2 + (2 * Math.PI * k) / 6;
        vertices.push({ x: C + Rx * Math.cos(theta), y: Cy + Ry * Math.sin(theta) });
      }
      break;
    case 'star': {
      for (let k = 0; k < 10; k++) {
        const theta = -Math.PI / 2 + (Math.PI * k) / 5;
        const rx = k % 2 === 0 ? Rx : Rx * 0.4;
        const ry = k % 2 === 0 ? Ry : Ry * 0.4;
        vertices.push({ x: C + rx * Math.cos(theta), y: Cy + ry * Math.sin(theta) });
      }
      break;
    }
    case 'cross': {
      const wx = w * 0.35;
      const hx = h * 0.35;
      const x1 = C - wx / 2;
      const x2 = C + wx / 2;
      const y1 = Cy - hx / 2;
      const y2 = Cy + hx / 2;
      vertices = [
        { x: x1, y: 0 },
        { x: x2, y: 0 },
        { x: x2, y: y1 },
        { x: w, y: y1 },
        { x: w, y: y2 },
        { x: x2, y: y2 },
        { x: x2, y: h },
        { x: x1, y: h },
        { x: x1, y: y2 },
        { x: 0, y: y2 },
        { x: 0, y: y1 },
        { x: x1, y: y1 },
      ];
      break;
    }
    case 'arrow':
      vertices = [
        { x: 0, y: h * 0.3 },
        { x: w * 0.55, y: h * 0.3 },
        { x: w * 0.55, y: 0 },
        { x: w, y: Cy },
        { x: w * 0.55, y: h },
        { x: w * 0.55, y: h * 0.7 },
        { x: 0, y: h * 0.7 },
      ];
      break;
    case 'parallelogram':
      vertices = [
        { x: w * 0.25, y: 0 },
        { x: w, y: 0 },
        { x: w * 0.75, y: h },
        { x: 0, y: h },
      ];
      break;
    case 'rhombus':
      vertices = [
        { x: C, y: 0 },
        { x: w, y: Cy },
        { x: C, y: h },
        { x: 0, y: Cy },
      ];
      break;
    default:
      vertices = [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ];
  }

  return samplePolygon(vertices, N);
}

/**
 * Returns a standardized SVG path 'd' string for a shape type.
 */
export function getShapePath(
  type: string,
  w: number,
  h: number,
  N = 120,
  points?: Point2D[],
  borderRadius?: number
): string {
  const pts = getShapePoints(type, w, h, N, points, borderRadius);
  return 'M ' + pts.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' L ') + ' Z';
}

/**
 * Dynamically resamples any SVG path string into exactly N points, returning a standardized 'd' string.
 * This runs natively in the browser using the SVGPathElement measurement APIs.
 */
export function resamplePath(d: string, N = 120): string {
  if (typeof document === 'undefined' || !d) return d;
  try {
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', d);
    const totalLength = pathEl.getTotalLength();
    if (totalLength === 0) return d;

    const points: string[] = [];
    const isClosed = d.trim().toLowerCase().endsWith('z');
    const divisor = isClosed ? N : N - 1 || 1;

    for (let i = 0; i < N; i++) {
      const length = (i * totalLength) / divisor;
      const pt = pathEl.getPointAtLength(length);
      points.push(`${pt.x.toFixed(3)},${pt.y.toFixed(3)}`);
    }

    return 'M ' + points.join(' L ') + (isClosed ? ' Z' : '');
  } catch (e) {
    console.error('Error resampling path:', e);
    return d;
  }
}
