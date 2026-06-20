import React from 'react';

interface CanvasHoverSyncProps {
    hoverX: number | null;
    toPixel: (pos: number) => number;
    yBeam: number;
}

export const CanvasHoverSync: React.FC<CanvasHoverSyncProps> = ({
    hoverX,
    toPixel,
    yBeam,
}) => {
    if (hoverX === null) return null;

    return (
        <g>
            <line
                x1={toPixel(hoverX)}
                y1={30}
                x2={toPixel(hoverX)}
                y2={160}
                stroke="var(--primary)"
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.5}
            />
            <circle cx={toPixel(hoverX)} cy={yBeam} r={3} fill="var(--primary)" opacity={0.8} />
        </g>
    );
};

export default CanvasHoverSync;
