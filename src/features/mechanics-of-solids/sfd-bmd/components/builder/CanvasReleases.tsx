import React from 'react';
import { IInternalRelease } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { VisualCanvasShape } from '@/features/presentation/types/schema';
import { BeamSupports } from '@/features/presentation/components/elements/BeamSupports';

interface CanvasReleasesProps {
  releases: IInternalRelease[];
  selectedId: string | null;
  toPixel: (pos: number) => number;
  yBeam: number;
  handleMouseDown: (
    e: React.MouseEvent,
    id: string,
    type: 'support' | 'release' | 'load',
    startPos: number,
    endPos?: number
  ) => void;
}

export const CanvasReleases: React.FC<CanvasReleasesProps> = ({
  releases,
  selectedId,
  toPixel,
  yBeam,
  handleMouseDown,
}) => {
  return (
    <>
      {releases.map(r => {
        const px = toPixel(r.position);
        const isSelected = selectedId === r.id;
        const shape: VisualCanvasShape = {
          id: r.id,
          type: 'hinge', // internal release hinge is rendered as circle
          x: 0,
          y: 0,
          w: 14,
          h: 14,
          enterAt: 1,
        };
        return (
          <g
            key={r.id}
            className={`cursor-ew-resize ${isSelected ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`}
            onMouseDown={(e) => handleMouseDown(e, r.id, 'release', r.position)}
            onClick={(e) => e.stopPropagation()}
          >
            <BeamSupports
              el={shape}
              stroke={isSelected ? 'var(--primary)' : 'var(--destructive)'}
              fill="var(--background)"
              sw={2}
              transform={`translate(${px - 7}, ${yBeam - 7})`}
            />
          </g>
        );
      })}
    </>
  );
};
