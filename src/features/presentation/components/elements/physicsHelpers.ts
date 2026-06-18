import Matter from 'matter-js';

export interface ShapeData {
  id: string;
  type: string;
  x: number;
  y: number;
  size?: number;
  fill?: string;
  label: string;
}

export interface ConnectorData {
  id: string;
  from: string;
  to: string;
  dasharray?: string;
}

/**
 * Factory helper to construct Matter.js bodies matching our layout shapes.
 */
export function createPhysicsBody(shape: ShapeData, bounciness: number): Matter.Body {
  const size = shape.size || 60;
  const options = {
    restitution: bounciness,
    friction: 0.1,
    frictionAir: 0.015,
  };

  switch (shape.type) {
    case 'circle':
    case 'heart':
      return Matter.Bodies.circle(shape.x, shape.y, size / 2, options);
    case 'rect':
    case 'square':
      return Matter.Bodies.rectangle(shape.x, shape.y, size, size, options);
    case 'triangle':
      return Matter.Bodies.polygon(shape.x, shape.y, 3, size / 2, options);
    case 'pentagon':
      return Matter.Bodies.polygon(shape.x, shape.y, 5, size / 2, options);
    case 'hexagon':
      return Matter.Bodies.polygon(shape.x, shape.y, 6, size / 2, options);
    case 'star':
      return Matter.Bodies.polygon(shape.x, shape.y, 5, size / 2, options);
    case 'cross':
      return Matter.Bodies.rectangle(shape.x, shape.y, size, size, options);
    case 'arrow':
      return Matter.Bodies.rectangle(shape.x, shape.y, size, size * 0.65, options);
    case 'parallelogram':
      return Matter.Bodies.rectangle(shape.x, shape.y, size, size * 0.8, options);
    case 'rhombus':
      return Matter.Bodies.polygon(shape.x, shape.y, 4, size / 2, options);
    default:
      return Matter.Bodies.rectangle(shape.x, shape.y, size, size, options);
  }
}

/**
 * Computes shortened connection lines so arrowheads terminate precisely at shape boundaries.
 */
export function getConnectorPath(
  pA: { x: number; y: number },
  pB: { x: number; y: number },
  rA: number,
  rB: number
): { d: string; opacity: number } {
  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;

  if (dist > rA + rB + 10) {
    const ux = dx / dist;
    const uy = dy / dist;
    const x1 = pA.x + rA * ux;
    const y1 = pA.y + rA * uy;
    const x2 = pB.x - rB * ux;
    const y2 = pB.y - rB * uy;
    return {
      d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      opacity: 1,
    };
  }
  return { d: '', opacity: 0 };
}
