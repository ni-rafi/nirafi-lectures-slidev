import React from 'react';
import { ISupport, ISolverOutput } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { VisualCanvasShape } from '@/features/presentation/types/schema';
import { BeamSupports } from '@/features/presentation/components/elements/BeamSupports';
import { ReactionVectors } from './ReactionVectors';

interface CanvasSupportsProps {
  supports: ISupport[];
  selectedId: string | null;
  toPixel: (pos: number) => number;
  yBeam: number;
  length: number;
  supportIdToLetter: Map<string, string>;
  handleMouseDown: (
    e: React.MouseEvent,
    id: string,
    type: 'support' | 'release' | 'load',
    startPos: number,
    endPos?: number
  ) => void;
  solverResult: ISolverOutput;
  formatForce: (f: number) => string;
  formatMoment: (m: number) => string;
}

export const CanvasSupports: React.FC<CanvasSupportsProps> = ({
  supports,
  selectedId,
  toPixel,
  yBeam,
  length,
  supportIdToLetter,
  handleMouseDown,
  solverResult,
  formatForce,
  formatMoment,
}) => {
  return (
    <>
      {supports.map(s => {
        const px = toPixel(s.position);
        const isSelected = selectedId === s.id;
        const shape: VisualCanvasShape = {
          id: s.id,
          type: s.type === 'fixed' ? 'support-fixed' : s.type === 'hinge' ? 'support-pin' : 'support-roller',
          x: 0,
          y: 0,
          w: 40,
          h: 40,
          enterAt: 1,
        };

        let tx = `translate(${px - 20}, ${yBeam + 6})`;
        if (s.type === 'fixed') {
          tx = s.position < length / 2
            ? `translate(${px - 12}, ${yBeam - 20})`
            : `translate(${px + 12}, ${yBeam - 20}) scale(-1, 1)`;
        }

        const letter = supportIdToLetter.get(s.id) || '';
        const labelY = s.type === 'fixed' ? yBeam - 22 : yBeam + 38;

        return (
          <g key={s.id}>
            {/* Support Graphic Group */}
            <g
              className={`cursor-ew-resize transition-all ${
                isSelected ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''
              }`}
              onMouseDown={(e) => handleMouseDown(e, s.id, 'support', s.position)}
              onClick={(e) => e.stopPropagation()}
            >
              <BeamSupports
                el={shape}
                stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                fill={isSelected ? 'var(--primary-hover)' : 'var(--muted)'}
                sw={2}
                transform={tx}
              />
              <circle cx={px} cy={yBeam} r={5} fill={isSelected ? 'var(--primary)' : 'var(--muted-foreground)'} />

              {/* Support Label Letter */}
              <text
                x={px}
                y={labelY}
                textAnchor="middle"
                className={
                  isSelected
                    ? 'fill-primary text-[11px] font-extrabold select-none'
                    : 'fill-muted-foreground text-[11px] font-extrabold select-none'
                }
              >
                {letter}
              </text>
            </g>

            {/* Render reaction Ry/M vectors if solved */}
            <ReactionVectors
              px={px}
              yBeam={yBeam}
              supportId={s.id}
              letter={letter}
              solverResult={solverResult}
              formatForce={formatForce}
              formatMoment={formatMoment}
            />
          </g>
        );
      })}
    </>
  );
};
