import React from 'react';

interface MicroKinematicReleaseProps {
    type: 'reaction' | 'shear' | 'moment';
}

export const MicroKinematicRelease: React.FC<MicroKinematicReleaseProps> = ({ type }) => {
    return (
        <div className="inline-flex flex-col items-center gap-1 bg-background/40 border border-border p-2 rounded-lg my-1.5 max-w-[140px]">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Release Action</span>
            <svg viewBox="0 0 100 40" className="w-24 h-10 overflow-visible">
                {/* Dotted reference line */}
                <line x1={5} y1={20} x2={95} y2={20} stroke="var(--border)" strokeWidth={1} strokeDasharray="2,2" />

                {type === 'reaction' && (
                    <g>
                        {/* Beam */}
                        <line x1={5} y1={20} x2={95} y2={20} stroke="var(--muted-foreground)" strokeWidth={4} />
                        {/* Support symbol with red X */}
                        <polygon points="50,22 42,35 58,35" fill="none" stroke="var(--primary)" strokeWidth={1.5} />
                        <line x1={44} y1={25} x2={56} y2={35} stroke="var(--destructive)" strokeWidth={2} />
                        <line x1={56} y1={25} x2={44} y2={35} stroke="var(--destructive)" strokeWidth={2} />
                    </g>
                )}

                {type === 'shear' && (
                    <g>
                        {/* Sliced beam showing shear slide mechanism */}
                        <line x1={5} y1={12} x2={48} y2={12} stroke="var(--primary)" strokeWidth={4} />
                        <line x1={52} y1={28} x2={95} y2={28} stroke="var(--primary)" strokeWidth={4} />
                        {/* Up and down shear jump arrows */}
                        <path d="M 48 16 L 48 30" stroke="var(--destructive)" strokeWidth={1.5} markerEnd="url(#mb-arrow-micro)" />
                        <path d="M 52 24 L 52 10" stroke="var(--primary)" strokeWidth={1.5} markerEnd="url(#mb-arrow-micro)" />
                    </g>
                )}

                {type === 'moment' && (
                    <g>
                        {/* Hinge release tent deflection */}
                        <line x1={5} y1={20} x2={50} y2={8} stroke="var(--primary)" strokeWidth={3} />
                        <line x1={50} y1={8} x2={95} y2={20} stroke="var(--primary)" strokeWidth={3} />
                        {/* Internal hinge circle release */}
                        <circle cx={50} cy={8} r={3} fill="var(--background)" stroke="var(--destructive)" strokeWidth={1.5} />
                    </g>
                )}

                <defs>
                    <marker
                        id="mb-arrow-micro"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="4"
                        markerHeight="4"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--destructive)" />
                    </marker>
                </defs>
            </svg>
        </div>
    );
};
export default MicroKinematicRelease;
