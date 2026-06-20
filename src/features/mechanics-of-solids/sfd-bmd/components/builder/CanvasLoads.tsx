import React from 'react';
import { ILoad } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { VisualCanvasShape } from '@/features/presentation/types/schema';
import { BeamLoads } from '@/features/presentation/components/elements/BeamLoads';

interface CanvasLoadsProps {
  loads: ILoad[];
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
  getBeamThicknessAt: (x: number) => number;
}

export const CanvasLoads: React.FC<CanvasLoadsProps> = ({
  loads,
  selectedId,
  toPixel,
  yBeam,
  handleMouseDown,
  getBeamThicknessAt,
}) => {
  // Label positioning structure
  interface LabelPosition {
    loadId: string;
    x: number;
    y: number;
    align: 'above' | 'below';
    isMoment: boolean;
  }

  // 1. Generate base positions
  const labelPositions: LabelPosition[] = loads.map(l => {
    let x = 0;
    let align: 'above' | 'below' = 'above';
    const isMoment = l.type === 'moment';

    if (l.type === 'point' && l.position !== undefined) {
      x = toPixel(l.position);
      const isUp = (l.magnitude ?? 0) < 0;
      align = isUp ? 'below' : 'above';
    } else if (l.type === 'moment' && l.position !== undefined) {
      x = toPixel(l.position);
      align = 'above';
    } else if ((l.type === 'udl' || l.type === 'uvl') && l.startPosition !== undefined && l.endPosition !== undefined) {
      x = toPixel((l.startPosition + l.endPosition) / 2);
      const isUp = l.type === 'udl' ? (l.magnitude ?? 0) < 0 : (l.startMagnitude ?? 0) < 0;
      align = isUp ? 'below' : 'above';
    }

    const thickness = getBeamThicknessAt(l.position ?? l.startPosition ?? 0);
    let y = yBeam;
    if (align === 'above') {
      y = yBeam - thickness / 2 - (isMoment ? 42 : 54);
    } else {
      y = yBeam + thickness / 2 + (l.type === 'udl' ? 62 : 60);
    }

    return { loadId: l.id, x, y, align, isMoment };
  });

  // 2. Stagger colliding labels
  const labelYMap = new Map<string, number>();

  const resolveGroup = (group: LabelPosition[], direction: 1 | -1) => {
    group.sort((a, b) => a.x - b.x);

    const levels: { [key: number]: number[] } = {};

    const isColliding = (levelIdx: number, x: number) => {
      const xs = levels[levelIdx] || [];
      return xs.some(ex => Math.abs(ex - x) < 65); // 65px buffer
    };

    group.forEach(label => {
      let level = 0;
      while (isColliding(level, label.x)) {
        level++;
      }
      if (!levels[level]) levels[level] = [];
      levels[level]!.push(label.x);

      const finalY = label.y + level * 16 * direction;
      labelYMap.set(label.loadId, finalY);
    });
  };

  resolveGroup(labelPositions.filter(p => p.align === 'above'), -1);
  resolveGroup(labelPositions.filter(p => p.align === 'below'), 1);

  return (
    <>
      {loads.map(l => {
        const isSelected = selectedId === l.id;
        const stroke = isSelected ? 'var(--primary)' : 'var(--accent, #f97316)';
        const fill = isSelected ? 'rgba(59,130,246,0.1)' : 'rgba(249,115,22,0.1)';
        const textY = labelYMap.get(l.id) ?? yBeam;

        if (l.type === 'point' && l.position !== undefined) {
          const px = toPixel(l.position);
          const isUp = (l.magnitude ?? 0) < 0;
          const thickness = getBeamThicknessAt(l.position);
          const shape: VisualCanvasShape = {
            id: l.id,
            type: 'point-load',
            x: 0,
            y: 0,
            w: 20,
            h: 40,
            enterAt: 1,
            pointLoadDirection: isUp ? 'up' : 'down',
          };
          const ty = isUp ? yBeam + thickness / 2 : yBeam - thickness / 2 - 40;
          return (
            <g
              key={l.id}
              className="cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, l.id, 'load', l.position!)}
              onClick={(e) => e.stopPropagation()}
            >
              <BeamLoads el={shape} stroke={stroke} fill={fill} sw={2} transform={`translate(${px - 10}, ${ty})`} />
              <text x={px} y={textY} textAnchor="middle" className="fill-foreground text-xs font-semibold select-none">
                {Math.abs(l.magnitude ?? 0)} kN
              </text>
            </g>
          );
        }

        if (l.type === 'moment' && l.position !== undefined) {
          const px = toPixel(l.position);
          const thickness = getBeamThicknessAt(l.position);
          const shape: VisualCanvasShape = {
            id: l.id,
            type: 'moment',
            x: 0,
            y: 0,
            w: 32,
            h: 32,
            enterAt: 1,
            momentDirection: (l.magnitude ?? 0) >= 0 ? 'cw' : 'ccw',
          };
          const ty = yBeam - thickness / 2 - 32;
          return (
            <g
              key={l.id}
              className="cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, l.id, 'load', l.position!)}
              onClick={(e) => e.stopPropagation()}
            >
              <BeamLoads el={shape} stroke={stroke} fill={fill} sw={2} transform={`translate(${px - 16}, ${ty})`} />
              <text x={px} y={textY} textAnchor="middle" className="fill-foreground text-xs font-semibold select-none">
                {Math.abs(l.magnitude ?? 0)} kNm
              </text>
            </g>
          );
        }

        if ((l.type === 'udl' || l.type === 'uvl') && l.startPosition !== undefined && l.endPosition !== undefined) {
          const startPx = toPixel(l.startPosition);
          const endPx = toPixel(l.endPosition);
          const w = endPx - startPx;

          const shape: VisualCanvasShape = {
            id: l.id,
            type: l.type === 'udl' ? 'udl' : 'uvl',
            x: 0,
            y: 0,
            w,
            h: 40,
            enterAt: 1,
            udlSegmentsCount: Math.max(4, Math.round(w / 20)),
            uvlStartHeight: l.type === 'uvl' ? Math.min(1, Math.max(0, Math.abs(l.startMagnitude ?? 0) / 10)) : undefined,
            uvlEndHeight: l.type === 'uvl' ? Math.min(1, Math.max(0, Math.abs(l.endMagnitude ?? 0) / 10)) : undefined,
          };

          const isUp = l.type === 'udl' ? (l.magnitude ?? 0) < 0 : (l.startMagnitude ?? 0) < 0;
          const centerPos = (l.startPosition + l.endPosition) / 2;
          const thickness = getBeamThicknessAt(centerPos);
          const ty = isUp ? yBeam + thickness / 2 : yBeam - thickness / 2 - 40;

          const textX = startPx + w / 2;
          const labelStr = l.type === 'udl'
            ? `${Math.abs(l.magnitude ?? 0)} kN/m`
            : `${Math.abs(l.startMagnitude ?? 0)} to ${Math.abs(l.endMagnitude ?? 0)} kN/m`;

          return (
            <g
              key={l.id}
              className="cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, l.id, 'load', l.startPosition!, l.endPosition!)}
              onClick={(e) => e.stopPropagation()}
            >
              <BeamLoads el={shape} stroke={stroke} fill={fill} sw={1.5} transform={`translate(${startPx}, ${ty})`} />
              <text x={textX} y={textY} textAnchor="middle" className="fill-foreground text-xs font-semibold select-none">
                {labelStr}
              </text>
            </g>
          );
        }

        return null;
      })}
    </>
  );
};
