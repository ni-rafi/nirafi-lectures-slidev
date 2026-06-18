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
 * Generates N vertices representing a pre-built geometric shape, scaled and centered in a box of size x size.
 */
export function getShapePoints(type: string, size: number, N = 120): Point2D[] {
  const C = size / 2;
  const R = size / 2;

  if (type === 'circle') {
    const points: Point2D[] = [];
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / N;
      points.push({
        x: C + R * Math.cos(theta),
        y: C + R * Math.sin(theta),
      });
    }
    return points;
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
    const maxSpan = Math.max(spanX, spanY) || 1;
    const scale = (size * 0.9) / maxSpan;
    const centerXRaw = (minX + maxX) / 2;
    const centerYRaw = (minY + maxY) / 2;

    return rawPoints.map(p => ({
      x: C + (p.x - centerXRaw) * scale,
      y: C + (p.y - centerYRaw) * scale,
    }));
  }

  let vertices: Point2D[] = [];

  switch (type) {
    case 'rect':
    case 'square':
      vertices = [
        { x: 0, y: 0 },
        { x: size, y: 0 },
        { x: size, y: size },
        { x: 0, y: size },
      ];
      break;
    case 'triangle':
      vertices = [
        { x: C, y: 0 },
        { x: size, y: size },
        { x: 0, y: size },
      ];
      break;
    case 'pentagon':
      for (let k = 0; k < 5; k++) {
        const theta = -Math.PI / 2 + (2 * Math.PI * k) / 5;
        vertices.push({ x: C + R * Math.cos(theta), y: C + R * Math.sin(theta) });
      }
      break;
    case 'hexagon':
      for (let k = 0; k < 6; k++) {
        const theta = -Math.PI / 2 + (2 * Math.PI * k) / 6;
        vertices.push({ x: C + R * Math.cos(theta), y: C + R * Math.sin(theta) });
      }
      break;
    case 'star': {
      const rOut = R;
      const rIn = R * 0.4;
      for (let k = 0; k < 10; k++) {
        const theta = -Math.PI / 2 + (Math.PI * k) / 5;
        const r = k % 2 === 0 ? rOut : rIn;
        vertices.push({ x: C + r * Math.cos(theta), y: C + r * Math.sin(theta) });
      }
      break;
    }
    case 'cross': {
      const w = size * 0.35;
      const x1 = C - w / 2;
      const x2 = C + w / 2;
      vertices = [
        { x: x1, y: 0 },
        { x: x2, y: 0 },
        { x: x2, y: x1 },
        { x: size, y: x1 },
        { x: size, y: x2 },
        { x: x2, y: x2 },
        { x: x2, y: size },
        { x: x1, y: size },
        { x: x1, y: x2 },
        { x: 0, y: x2 },
        { x: 0, y: x1 },
        { x: x1, y: x1 },
      ];
      break;
    }
    case 'arrow':
      vertices = [
        { x: 0, y: size * 0.3 },
        { x: size * 0.55, y: size * 0.3 },
        { x: size * 0.55, y: 0 },
        { x: size, y: C },
        { x: size * 0.55, y: size },
        { x: size * 0.55, y: size * 0.7 },
        { x: 0, y: size * 0.7 },
      ];
      break;
    case 'parallelogram':
      vertices = [
        { x: size * 0.25, y: 0 },
        { x: size, y: 0 },
        { x: size * 0.75, y: size },
        { x: 0, y: size },
      ];
      break;
    case 'rhombus':
      vertices = [
        { x: C, y: 0 },
        { x: size, y: C },
        { x: C, y: size },
        { x: 0, y: C },
      ];
      break;
    default:
      vertices = [
        { x: 0, y: 0 },
        { x: size, y: 0 },
        { x: size, y: size },
        { x: 0, y: size },
      ];
  }

  return samplePolygon(vertices, N);
}

/**
 * Returns a standardized SVG path 'd' string for a shape type.
 */
export function getShapePath(type: string, size: number, N = 120): string {
  const points = getShapePoints(type, size, N);
  return 'M ' + points.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' L ') + ' Z';
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
