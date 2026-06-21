import React from 'react';
import { CrossSectionSpec } from '../types/sectionSchema';
import { ConcreteSectionBox } from './atoms/sections/ConcreteSectionBox';
import { RebarSectionPrimitive } from './atoms/sections/RebarSectionPrimitive';
import { AnnotationOverlay } from './atoms/elements/AnnotationOverlay';
import { calculateDynamicViewBox } from '../engines/viewportScaleEngine';

interface SectionDrawingCanvasProps {
  spec: CrossSectionSpec;
  isActive?: boolean;
}

export const SectionDrawingCanvas: React.FC<SectionDrawingCanvasProps> = ({
  spec,
  isActive = false,
}) => {
  // Set up layout points to construct a responsive viewBox
  const points = [
    { x: 0, y: 0 },
    { x: spec.width, y: spec.depth },
  ];

  // Calculate dynamic viewBox with padding to fit dimensions and annotation labels
  const { viewBox } = calculateDynamicViewBox(points, 50);

  // Group top/bottom layers text descriptions
  const topLayerText = spec.longitudinalLayers
    .filter(l => l.side === 'top')
    .map(l => `${l.count}#${l.barDiameter}`)
    .join(' + ');

  const bottomLayerText = spec.longitudinalLayers
    .filter(l => l.side === 'bottom')
    .map(l => `${l.count}#${l.barDiameter}`)
    .join(' + ');

  const sideLayer = spec.longitudinalLayers.find(l => l.side === 'side');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-muted/10 rounded-xl border border-border/30">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-2">
        Cross Section: {spec.componentType.toUpperCase()} {spec.id}
      </div>
      <div className="w-full max-w-[280px] h-[280px]">
        <svg viewBox={viewBox} className="w-full h-full select-none overflow-visible">
          {/* 1. Base Concrete Shape */}
          <ConcreteSectionBox width={spec.width} depth={spec.depth} isActive={isActive} />

          {/* 2. Steel Rebars and Links/Stirrup primitives */}
          <RebarSectionPrimitive spec={spec} isActive={isActive} />

          {/* 3. Outer Dimension Annotations */}
          {/* Bottom Width Annotation */}
          <AnnotationOverlay
            p1={{ x: 0, y: spec.depth }}
            p2={{ x: spec.width, y: spec.depth }}
            offset={25}
            text={`${spec.width} mm`}
          />

          {/* Right Depth Annotation */}
          <AnnotationOverlay
            p1={{ x: spec.width, y: 0 }}
            p2={{ x: spec.width, y: spec.depth }}
            offset={25}
            text={`${spec.depth} mm`}
          />

          {/* 4. Structural Rebar Details Annotations */}
          {/* Top Reinforcement Tag */}
          {topLayerText && (
            <g className="fill-foreground font-mono text-[8px]" opacity="0.8">
              <text x={spec.width / 2} y={-10} textAnchor="middle" fontWeight="bold">
                {topLayerText} (Top)
              </text>
              <line
                x1={spec.width / 2}
                y1={-6}
                x2={spec.width / 2}
                y2={spec.clearCover + 4}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
            </g>
          )}

          {/* Bottom Reinforcement Tag */}
          {bottomLayerText && (
            <g className="fill-foreground font-mono text-[8px]" opacity="0.8">
              <text x={spec.width / 2} y={spec.depth + 42} textAnchor="middle" fontWeight="bold">
                {bottomLayerText} (Bottom)
              </text>
              <line
                x1={spec.width / 2}
                y1={spec.depth + 30}
                x2={spec.width / 2}
                y2={spec.depth - spec.clearCover - 4}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
            </g>
          )}

          {/* Side bars indicator */}
          {sideLayer && (
            <text
              x={spec.width + 30}
              y={spec.depth / 2}
              textAnchor="start"
              fontSize="7.5"
              className="fill-muted-foreground font-mono"
            >
              Side: {sideLayer.count}#{sideLayer.barDiameter}
            </text>
          )}

          {/* Clear Cover pointer */}
          <g className="fill-muted-foreground/80 stroke-muted-foreground/50" strokeWidth="0.5">
            {/* Draw a tiny pointer to clear cover gap */}
            <line x1={-10} y1={spec.clearCover / 2} x2={spec.clearCover / 2} y2={spec.clearCover / 2} />
            <circle cx={spec.clearCover / 2} cy={spec.clearCover / 2} r="1" className="fill-current" />
            <text x={-12} y={spec.clearCover / 2 + 2} textAnchor="end" fontSize="7" className="font-mono">
              cc: {spec.clearCover}
            </text>
          </g>

          {/* Stirrup Tag */}
          <text
            x={-15}
            y={spec.depth + 18}
            textAnchor="start"
            fontSize="7"
            className="fill-destructive/80 font-mono"
          >
            Stirrup: R{spec.stirrups.diameter}@{spec.stirrups.spacing}
          </text>
        </svg>
      </div>
    </div>
  );
};
