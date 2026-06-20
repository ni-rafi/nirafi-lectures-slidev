import React from 'react';

interface MicroLoadConvolutionProps {
    load: number;
    ordinate: number;
}

export const MicroLoadConvolution: React.FC<MicroLoadConvolutionProps> = ({ load, ordinate }) => {
    return (
        <div className="inline-flex flex-col items-center gap-1 bg-background/40 border border-border p-2 rounded-lg my-1.5 max-w-[140px]">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Superposition Term</span>
            <svg viewBox="0 0 100 45" className="w-24 h-11 overflow-visible">
                {/* Tiny ILD Triangle */}
                <polygon points="5,35 50,15 95,35" fill="none" stroke="var(--primary)" strokeWidth={1} />
                <line x1={5} y1={35} x2={95} y2={35} stroke="var(--border)" strokeWidth={0.75} />

                {/* Point Load arrow hitting the peak */}
                <line x1={50} y1={2} x2={50} y2={12} stroke="var(--foreground)" strokeWidth={1.5} markerEnd="url(#micro-conv-arrow)" />

                {/* Ordinate drop line */}
                <line x1={50} y1={15} x2={50} y2={35} stroke="var(--primary)" strokeWidth={1} strokeDasharray="2,2" />

                {/* Text labels */}
                <text x={50} y={0} textAnchor="middle" className="fill-foreground font-black text-[8px]">
                    {load} kN
                </text>
                <text x={58} y={26} textAnchor="start" className="fill-primary font-bold text-[8px]">
                    y = {ordinate.toFixed(2)}
                </text>
            </svg>
            <span className="text-[9px] font-black text-primary select-all">
                {(load * ordinate).toFixed(2)} kN
            </span>
        </div>
    );
};
export default MicroLoadConvolution;
