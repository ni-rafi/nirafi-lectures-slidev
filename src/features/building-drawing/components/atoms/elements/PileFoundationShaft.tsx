import React from 'react';
import { PileFoundationSpec } from '../../../types/sectionSchema';

interface PileFoundationShaftProps {
  spec: PileFoundationSpec;
  cx: number; // Center of the column / pile cap
  cy: number; // Ground level coordinate
}

export const PileFoundationShaft: React.FC<PileFoundationShaftProps> = ({
  spec,
  cx,
  cy,
}) => {
  const capY = cy;
  const capX = cx - spec.capWidth / 2;

  // Calculate coordinates for the piles
  const pileTopY = capY + spec.capDepth;
  const pileSpacing = spec.capWidth / (spec.pileCount + 1);

  const pileCenters: number[] = [];
  if (spec.pileCount === 1) {
    pileCenters.push(cx);
  } else {
    for (let i = 1; i <= spec.pileCount; i++) {
      pileCenters.push(cx - spec.capWidth / 2 + pileSpacing * i);
    }
  }

  // Draw background soil layers
  let currentSoilY = cy + 20; // soil starts slightly below cap top
  const soilRender = spec.soilLayers.map((layer, idx) => {
    const layerH = layer.depth;
    const soilRect = (
      <rect
        key={idx}
        x={cx - spec.capWidth * 1.5}
        y={currentSoilY}
        width={spec.capWidth * 3}
        height={layerH}
        className={`${layer.colorClass} opacity-20`}
      />
    );
    // Draw soil boundary line
    const boundaryLine = (
      <line
        key={`line-${idx}`}
        x1={cx - spec.capWidth * 1.5}
        y1={currentSoilY + layerH}
        x2={cx + spec.capWidth * 1.5}
        y2={currentSoilY + layerH}
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4,4"
        className="stroke-foreground/20"
      />
    );
    // Draw text label on the side
    const label = (
      <text
        key={`label-${idx}`}
        x={cx - spec.capWidth * 1.4}
        y={currentSoilY + layerH - 6}
        fontSize="8"
        className="fill-muted-foreground/60 font-mono"
      >
        {layer.label} ({layer.depth}m)
      </text>
    );

    currentSoilY += layerH;
    return (
      <g key={idx}>
        {soilRect}
        {boundaryLine}
        {label}
      </g>
    );
  });

  return (
    <g>
      {/* 1. Background Soil Layers */}
      {soilRender}

      {/* 2. Pile Cap (Concrete foundation cap) */}
      <rect
        x={capX}
        y={capY}
        width={spec.capWidth}
        height={spec.capDepth}
        rx={2}
        className="fill-muted stroke-foreground/50 stroke-2"
      />
      {/* Hatch inside cap */}
      <line x1={capX} y1={capY + 10} x2={capX + 10} y2={capY} className="stroke-muted-foreground/20" strokeWidth="0.5" />
      <line x1={capX + spec.capWidth - 10} y1={capY + spec.capDepth} x2={capX + spec.capWidth} y2={capY + spec.capDepth - 10} className="stroke-muted-foreground/20" strokeWidth="0.5" />

      {/* 3. Deep Bored Friction Pile Shafts */}
      {pileCenters.map((xCenter, idx) => {
        const px = xCenter - spec.pileDiameter / 2;
        return (
          <g key={idx}>
            {/* Pile Shaft Body */}
            <rect
              x={px}
              y={pileTopY}
              width={spec.pileDiameter}
              height={spec.pileDepth}
              rx={1}
              className="fill-muted/80 stroke-foreground/45 stroke-[1.5]"
            />
            {/* Ground Friction Hatch Marks (subtle details along shaft skin) */}
            {Array.from({ length: Math.floor(spec.pileDepth / 25) }).map((_, hIdx) => {
              const hatchY = pileTopY + hIdx * 25 + 10;
              return (
                <g key={hIdx} className="stroke-foreground/30" strokeWidth="0.75">
                  {/* Left skin friction tick */}
                  <line x1={px - 3} y1={hatchY + 3} x2={px} y2={hatchY} />
                  {/* Right skin friction tick */}
                  <line x1={px + spec.pileDiameter} y1={hatchY} x2={px + spec.pileDiameter + 3} y2={hatchY + 3} />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* 4. Ground/Soil Level Line */}
      <line
        x1={cx - spec.capWidth * 1.5}
        y1={cy}
        x2={cx + spec.capWidth * 1.5}
        y2={cy}
        stroke="currentColor"
        strokeWidth="1.5"
        className="stroke-foreground/60"
      />
    </g>
  );
};
