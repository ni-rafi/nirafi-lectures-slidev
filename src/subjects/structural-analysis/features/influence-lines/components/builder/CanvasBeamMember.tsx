import React from 'react';

interface CanvasBeamMemberProps {
    paddingX: number;
    width: number;
    yBeam: number;
}

export const CanvasBeamMember: React.FC<CanvasBeamMemberProps> = ({
    paddingX,
    width,
    yBeam,
}) => {
    return (
        <line
            x1={paddingX}
            y1={yBeam}
            x2={width - paddingX}
            y2={yBeam}
            stroke="var(--muted-foreground)"
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.8}
        />
    );
};

export default CanvasBeamMember;
