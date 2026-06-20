import React from 'react';
import { ISupport } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { BeamSupports } from '@/features/presentation/components/elements/BeamSupports';
import { VisualCanvasShape } from '@/features/presentation/types/schema';

interface CanvasSupportsProps {
    supports: ISupport[];
    selectedId: string | null;
    toPixel: (pos: number) => number;
    yBeam: number;
    length: number;
    targetSupportX: number | null;
    analysisType: string;
    handleMouseDown: (
        e: React.MouseEvent,
        id: string,
        type: 'support' | 'release' | 'targetSection',
        startPos: number
    ) => void;
    setTargetSupportX: (x: number | null) => void;
}

export const CanvasSupports: React.FC<CanvasSupportsProps> = ({
    supports,
    selectedId,
    toPixel,
    yBeam,
    length,
    targetSupportX,
    analysisType,
    handleMouseDown,
    setTargetSupportX,
}) => {
    // Assign letters A, B, C... to supports sorted by position
    const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
    const supportIdToLetter = new Map<string, string>();
    sortedSupports.forEach((s, idx) => {
        const letter = String.fromCharCode(65 + idx);
        supportIdToLetter.set(s.id, letter);
    });

    return (
        <>
            {supports.map((s) => {
                const px = toPixel(s.position);
                const isSelected = selectedId === s.id;
                const letter = supportIdToLetter.get(s.id) || '';
                const shape: VisualCanvasShape = {
                    id: s.id,
                    type: s.type === 'fixed' ? 'support-fixed' : s.type === 'hinge' ? 'support-pin' : 'support-roller',
                    x: 0,
                    y: 0,
                    w: 40,
                    h: 40,
                    enterAt: 1,
                };

                let tx = `translate(${px - 20}, ${yBeam + 4})`;
                if (s.type === 'fixed') {
                    tx = s.position < length / 2
                        ? `translate(${px - 12}, ${yBeam - 20})`
                        : `translate(${px + 12}, ${yBeam - 20}) scale(-1, 1)`;
                }

                const isTargetSupport = analysisType === 'reaction' && Math.abs(targetSupportX ?? -999 - s.position) < 0.01;

                return (
                    <g
                        key={s.id}
                        className="cursor-ew-resize"
                        onMouseDown={(e) => handleMouseDown(e, s.id, 'support', s.position)}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (analysisType === 'reaction') {
                                setTargetSupportX(s.position);
                            }
                        }}
                    >
                        <BeamSupports
                            el={shape}
                            stroke={isSelected ? 'var(--primary)' : isTargetSupport ? 'var(--primary)' : 'var(--foreground)'}
                            fill={isSelected ? 'var(--primary-hover)' : isTargetSupport ? 'rgba(59,130,246,0.1)' : 'var(--muted)'}
                            sw={2}
                            transform={tx}
                        />
                        <circle cx={px} cy={yBeam} r={4.5} fill={isSelected ? 'var(--primary)' : 'var(--muted-foreground)'} />
                        <text
                            x={px}
                            y={s.type === 'fixed' ? yBeam - 26 : yBeam + 36}
                            textAnchor="middle"
                            className={`text-[10px] font-extrabold select-none ${
                                isSelected || isTargetSupport ? 'fill-primary' : 'fill-muted-foreground'
                            }`}
                        >
                            {letter}
                        </text>
                    </g>
                );
            })}
        </>
    );
};
export default CanvasSupports;
