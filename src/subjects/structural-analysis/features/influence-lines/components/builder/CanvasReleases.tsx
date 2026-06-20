import React from 'react';
import { IInternalRelease } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { BeamSupports } from '@/features/presentation/components/elements/BeamSupports';
import { VisualCanvasShape } from '@/features/presentation/types/schema';

interface CanvasReleasesProps {
    releases: IInternalRelease[];
    selectedId: string | null;
    toPixel: (pos: number) => number;
    yBeam: number;
    handleMouseDown: (
        e: React.MouseEvent,
        id: string,
        type: 'support' | 'release' | 'targetSection',
        startPos: number
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
            {releases.map((r) => {
                const px = toPixel(r.position);
                const isSelected = selectedId === r.id;
                const shape: VisualCanvasShape = {
                    id: r.id,
                    type: 'hinge',
                    x: 0,
                    y: 0,
                    w: 12,
                    h: 12,
                    enterAt: 1,
                };
                return (
                    <g
                        key={r.id}
                        className="cursor-ew-resize"
                        onMouseDown={(e) => handleMouseDown(e, r.id, 'release', r.position)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <BeamSupports
                            el={shape}
                            stroke={isSelected ? 'var(--primary)' : 'var(--destructive)'}
                            fill="var(--background)"
                            sw={2}
                            transform={`translate(${px - 6}, ${yBeam - 6})`}
                        />
                    </g>
                );
            })}
        </>
    );
};
export default CanvasReleases;
