import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import ShapeMorph from './ShapeMorph';
import {
  ShapeData,
  ConnectorData,
  createPhysicsBody,
  getConnectorPath,
} from './physicsHelpers';

interface PhysicsSandboxProps {
  shapes: ShapeData[];
  connectors: ConnectorData[];
  physicsEnabled: boolean;
  width?: number;
  height?: number;
  gravity?: number;
  bounciness?: number;
  jointStiffness?: number;
  onShapeClick?: (id: string) => void;
}

export const PhysicsSandbox: React.FC<PhysicsSandboxProps> = ({
  shapes,
  connectors,
  physicsEnabled,
  width = 800,
  height = 420,
  gravity = 1,
  bounciness = 0.6,
  jointStiffness = 0.05,
  onShapeClick,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const shapesRef = useRef<(SVGGElement | null)[]>([]);
  const connectorsRef = useRef<(SVGPathElement | null)[]>([]);
  const requestRef = useRef<number | null>(null);
  const physicsActive = useRef<boolean>(false);

  useEffect(() => {
    shapesRef.current = shapesRef.current.slice(0, shapes.length);
    connectorsRef.current = connectorsRef.current.slice(0, connectors.length);
  }, [shapes, connectors]);

  useEffect(() => {
    if (physicsEnabled) {
      const engine = Matter.Engine.create({ gravity: { y: gravity } });
      engineRef.current = engine;

      const pad = 30;
      const ground = Matter.Bodies.rectangle(width / 2, height + pad / 2, width, pad, { isStatic: true });
      const ceiling = Matter.Bodies.rectangle(width / 2, -pad / 2, width, pad, { isStatic: true });
      const leftWall = Matter.Bodies.rectangle(-pad / 2, height / 2, pad, height, { isStatic: true });
      const rightWall = Matter.Bodies.rectangle(width + pad / 2, height / 2, pad, height, { isStatic: true });
      Matter.Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

      const bodiesMap = new Map<string, Matter.Body>();
      const shapeBodies = shapes.map((shape) => {
        const body = createPhysicsBody(shape, bounciness);
        bodiesMap.set(shape.id, body);
        return { id: shape.id, body, size: shape.size || 60 };
      });

      Matter.Composite.add(engine.world, shapeBodies.map(sb => sb.body));

      connectors.forEach((conn) => {
        const bodyFrom = bodiesMap.get(conn.from);
        const bodyTo = bodiesMap.get(conn.to);
        if (!bodyFrom || !bodyTo) return;

        const dx = bodyTo.position.x - bodyFrom.position.x;
        const dy = bodyTo.position.y - bodyFrom.position.y;
        const initialDist = Math.sqrt(dx * dx + dy * dy);

        const constraint = Matter.Constraint.create({
          bodyA: bodyFrom,
          bodyB: bodyTo,
          stiffness: jointStiffness,
          length: Math.max(40, initialDist),
        });
        Matter.Composite.add(engine.world, constraint);
      });

      if (svgRef.current) {
        const mouse = Matter.Mouse.create(svgRef.current as unknown as HTMLElement);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.15, render: { visible: false } },
        });

        Matter.Events.on(mouseConstraint, 'mousedown', () => {
          if (!svgRef.current) return;
          let scale = 1;
          const canvasElement = svgRef.current.closest('[data-slide-canvas]') as HTMLElement;
          if (canvasElement) {
            scale = canvasElement.getBoundingClientRect().width / canvasElement.offsetWidth || 1;
          }
          Matter.Mouse.setScale(mouse, { x: 1 / scale, y: 1 / scale });
        });

        Matter.Composite.add(engine.world, mouseConstraint);
        mouseConstraintRef.current = mouseConstraint;
      }

      physicsActive.current = true;
      const runLoop = () => {
        if (!physicsActive.current || !engineRef.current) return;
        Matter.Engine.update(engineRef.current, 1000 / 60);

        shapeBodies.forEach((sb, idx) => {
          const el = shapesRef.current[idx];
          if (!el) return;
          const { x, y } = sb.body.position;
          const angle = sb.body.angle;
          el.style.transform = `translate(${x - sb.size / 2}px, ${y - sb.size / 2}px) rotate(${angle}rad)`;
        });

        connectors.forEach((conn, idx) => {
          const el = connectorsRef.current[idx];
          if (!el) return;
          const bFrom = bodiesMap.get(conn.from);
          const bTo = bodiesMap.get(conn.to);
          if (!bFrom || !bTo) return;

          const fromS = shapes.find(s => s.id === conn.from);
          const toS = shapes.find(s => s.id === conn.to);
          const { d, opacity } = getConnectorPath(
            bFrom.position,
            bTo.position,
            (fromS?.size || 60) / 2,
            (toS?.size || 60) / 2
          );
          el.setAttribute('d', d);
          el.setAttribute('opacity', String(opacity));
        });

        requestRef.current = requestAnimationFrame(runLoop);
      };
      requestRef.current = requestAnimationFrame(runLoop);
    } else {
      physicsActive.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      shapes.forEach((shape, idx) => {
        const el = shapesRef.current[idx];
        if (!el) return;
        const size = shape.size || 60;
        el.style.transform = `translate(${shape.x - size / 2}px, ${shape.y - size / 2}px) rotate(0rad)`;
      });

      connectors.forEach((conn, idx) => {
        const el = connectorsRef.current[idx];
        if (!el) return;
        const fromS = shapes.find(s => s.id === conn.from);
        const toS = shapes.find(s => s.id === conn.to);
        if (!fromS || !toS) return;

        const { d, opacity } = getConnectorPath(
          fromS,
          toS,
          (fromS.size || 60) / 2,
          (toS.size || 60) / 2
        );
        el.setAttribute('d', d);
        el.setAttribute('opacity', String(opacity));
      });

      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      engineRef.current = null;
    }

    return () => {
      physicsActive.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [physicsEnabled, shapes, connectors, gravity, bounciness, jointStiffness, width, height]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full relative overflow-hidden bg-slate-950/80 border border-white/10 rounded-xl select-none"
      style={{ touchAction: 'none' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,1 L0,6 L5,3.5 Z" className="fill-slate-500" />
        </marker>
      </defs>

      <g>
        {connectors.map((conn, idx) => {
          const fromS = shapes.find(s => s.id === conn.from);
          const toS = shapes.find(s => s.id === conn.to);
          if (!fromS || !toS) return null;

          const { d, opacity } = getConnectorPath(
            fromS,
            toS,
            (fromS.size || 60) / 2,
            (toS.size || 60) / 2
          );

          return (
            <path
              key={conn.id}
              ref={(el) => { if (el) connectorsRef.current[idx] = el; }}
              d={d}
              opacity={opacity}
              stroke="rgba(100, 116, 139, 0.6)"
              strokeWidth={2}
              strokeDasharray={conn.dasharray}
              fill="none"
              markerEnd="url(#arrowhead)"
              style={{
                transition: physicsEnabled
                  ? 'none'
                  : 'd 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
              }}
            />
          );
        })}
      </g>

      {shapes.map((shape, idx) => {
        const size = shape.size || 60;
        const style: React.CSSProperties = {
          position: 'absolute',
          transform: `translate(${shape.x - size / 2}px, ${shape.y - size / 2}px)`,
          transformOrigin: 'center',
          transition: physicsEnabled ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        };

        return (
          <g
            key={shape.id}
            ref={(el) => { if (el) shapesRef.current[idx] = el; }}
            style={style}
            onClick={() => onShapeClick?.(shape.id)}
          >
            <ShapeMorph
              type={shape.type}
              size={size}
              fill={shape.fill || 'var(--primary)'}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1.5}
              className="cursor-pointer hover:stroke-primary hover:fill-primary/20 transition-all duration-300"
            />
            <text
              x={size / 2}
              y={size / 2 + 3.5}
              textAnchor="middle"
              className="fill-slate-100 font-sans text-[10px] font-bold select-none pointer-events-none tracking-wider uppercase"
            >
              {shape.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default PhysicsSandbox;
