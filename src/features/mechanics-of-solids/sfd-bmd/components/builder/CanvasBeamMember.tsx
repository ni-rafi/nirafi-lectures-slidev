import React from 'react';
import { IEISegment } from '@/cores/mechanics-of-solids/deflection/types';

interface CanvasBeamMemberProps {
  eiSegments: IEISegment[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  toPixel: (pos: number) => number;
  yBeam: number;
}

export const CanvasBeamMember: React.FC<CanvasBeamMemberProps> = ({
  eiSegments,
  selectedId,
  setSelectedId,
  toPixel,
  yBeam,
}) => {
  return (
    <>
      {eiSegments.map((seg, idx) => {
        const sPx = toPixel(seg.startPosition);
        const ePx = toPixel(seg.endPosition);
        const segW = ePx - sPx;
        const isSelected = selectedId === seg.id;
        
        const EI = seg.E * seg.I;
        const scaleH = Math.max(12, Math.min(32, 12 + (EI / 100000) * 16));

        return (
          <g key={seg.id}>
            <rect
              x={sPx}
              y={yBeam - scaleH / 2}
              width={segW}
              height={scaleH}
              rx={4}
              className={`cursor-pointer stroke-2 fill-muted/80 transition-colors ${
                isSelected ? 'stroke-primary fill-primary/10' : 'stroke-border hover:fill-muted/90'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(seg.id);
              }}
            />
            {/* Boundary divider line between segments */}
            {idx > 0 && (
              <line
                x1={sPx}
                y1={yBeam - 16}
                x2={sPx}
                y2={yBeam + 16}
                stroke="var(--primary)"
                strokeWidth={1.5}
                strokeDasharray="3,3"
              />
            )}
          </g>
        );
      })}
    </>
  );
};
