import React from 'react';
import { IMovingVehicle } from '../../../../cores/influence-lines/influence-lines.interface';

interface CanvasVehicleTransitProps {
    activeVehicle: IMovingVehicle | null;
    transitPosition: number;
    length: number;
    toPixel: (pos: number) => number;
    yBeam: number;
    success: boolean;
}

export const CanvasVehicleTransit: React.FC<CanvasVehicleTransitProps> = ({
    activeVehicle,
    transitPosition,
    length,
    toPixel,
    yBeam,
    success,
}) => {
    if (!activeVehicle || !success) return null;

    // Precalculate vehicle relative positions
    const axlePositions: number[] = [];
    let currentPos = 0;
    activeVehicle.axles.forEach((a, idx) => {
        if (idx > 0) {
            currentPos -= a.spacingFromPrevious;
        }
        axlePositions.push(currentPos);
    });

    return (
        <g>
            {/* Connector line for truck frame */}
            {axlePositions.length > 1 && (
                <line
                    x1={toPixel(transitPosition + axlePositions[axlePositions.length - 1]!)}
                    y1={yBeam - 16}
                    x2={toPixel(transitPosition)}
                    y2={yBeam - 16}
                    stroke="var(--foreground)"
                    strokeWidth={3}
                    opacity={0.65}
                />
            )}
            {activeVehicle.axles.map((axle, idx) => {
                const relPos = axlePositions[idx]!;
                const globalX = transitPosition + relPos;
                const px = toPixel(globalX);

                // Draw only if it is physically on the span
                if (globalX < 0 || globalX > length) return null;

                return (
                    <g key={axle.id} className="transition-all">
                        {/* Axle Wheel */}
                        <circle
                            cx={px}
                            cy={yBeam - 8}
                            r={6}
                            fill="var(--foreground)"
                            className="animate-pulse"
                        />
                        {/* Axle Load Vector Arrow */}
                        <line
                            x1={px}
                            y1={yBeam - 32}
                            x2={px}
                            y2={yBeam - 16}
                            stroke="var(--foreground)"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                        />
                        {/* Axle Load label */}
                        <text
                            x={px}
                            y={yBeam - 38}
                            textAnchor="middle"
                            className="text-[9px] font-bold fill-foreground select-none bg-background/80 p-0.5 rounded"
                        >
                            {axle.load} kN
                        </text>
                    </g>
                );
            })}
        </g>
    );
};
export default CanvasVehicleTransit;
