import React from 'react';
import { ITargetSection } from '../../../../cores/influence-lines/influence-lines.interface';

interface CanvasTargetSectionProps {
    targetSection: ITargetSection;
    analysisType: string;
    toPixel: (pos: number) => number;
    handleMouseDown: (
        e: React.MouseEvent,
        id: string,
        type: 'support' | 'release' | 'targetSection',
        startPos: number
    ) => void;
}

export const CanvasTargetSection: React.FC<CanvasTargetSectionProps> = ({
    targetSection,
    analysisType,
    toPixel,
    handleMouseDown,
}) => {
    if (analysisType === 'reaction') return null;

    const px = toPixel(targetSection.xc);

    return (
        <g
            className="cursor-ew-resize group"
            onMouseDown={(e) => handleMouseDown(e, 'targetSection', 'targetSection', targetSection.xc)}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Red target dashed line */}
            <line
                x1={px}
                y1={30}
                x2={px}
                y2={150}
                stroke="var(--primary)"
                strokeWidth={2}
                strokeDasharray="4,4"
            />
            {/* Drag target indicator handle */}
            <polygon
                points={`${px - 6},30 ${px + 6},30 ${px},40`}
                fill="var(--primary)"
            />
            <rect
                x={px - 18}
                y={12}
                width={36}
                height={16}
                rx={4}
                fill="var(--primary)"
            />
            <text
                x={px}
                y={23}
                textAnchor="middle"
                fill="white"
                className="text-[9px] font-extrabold select-none"
            >
                x_c
            </text>
        </g>
    );
};
export default CanvasTargetSection;
