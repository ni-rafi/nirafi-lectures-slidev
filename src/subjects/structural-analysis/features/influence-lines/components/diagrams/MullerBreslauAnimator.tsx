import React, { useState, useEffect, useMemo } from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { motion } from 'motion/react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { IInfluenceTarget } from '../../../../cores/influence-lines/influence-lines.interface';
import { InfluenceLinesService } from '../../../../cores/influence-lines/influenceLinesService';
import { splitIntoSignSegments } from '@/subjects/mechanics-of-solids/features/sfd-bmd/utils/chartUtils';

interface MullerBreslauAnimatorProps {
    target: IInfluenceTarget;
}

export const MullerBreslauAnimator: React.FC<MullerBreslauAnimatorProps> = ({ target }) => {
    const { length, supports, releases, activeTargetId, setActiveTargetId } = useInfluenceWorkspace();
    const service = useMemo(() => new InfluenceLinesService(), []);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(1.0);

    const isActive = target.id === activeTargetId;

    useEffect(() => {
        if (!isAnimating) return;
        let start = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - start) % 4000;
            const t = elapsed / 4000;
            const factor = Math.sin(t * Math.PI);
            setProgress(factor);
        }, 30);
        return () => clearInterval(interval);
    }, [isAnimating]);

    const beam = useMemo(() => ({
        length,
        supports,
        releases,
        loads: [],
    }), [length, supports, releases]);

    const solverResult = useMemo(() => {
        try {
            if (target.type === 'reaction') {
                if (target.targetSupportX === null) return null;
                return service.calculateReactionILD(beam, target.targetSupportX);
            } else if (target.type === 'shear') {
                return service.calculateShearILD(beam, target.targetSection);
            } else {
                return service.calculateMomentILD(beam, target.targetSection);
            }
        } catch {
            return null;
        }
    }, [service, beam, target.type, target.targetSupportX, target.targetSection]);

    if (!solverResult || !solverResult.success || solverResult.kinematicPoints.length === 0) return null;

    const activePoints = solverResult.kinematicPoints;
    const isMoment = target.type === 'moment';

    const paddingX = 60;
    const width = 800;
    const height = 180;
    const chartW = width - paddingX * 2;
    const yBeam = 100;

    const toPixelX = (x: number) => paddingX + (x / length) * chartW;

    let maxAbs = 1.0;
    activePoints.forEach((pt) => {
        if (Math.abs(pt.ordinate) > maxAbs) maxAbs = Math.abs(pt.ordinate);
    });
    const scaleY = 50 / maxAbs;

    const pointsForSplit = activePoints.map(p => ({ x: p.x, y: p.ordinate * progress }));
    const subSegments = splitIntoSignSegments(pointsForSplit);

    let releaseX = 0;
    let releaseLabel = '';
    if (target.type === 'reaction') {
        releaseX = target.targetSupportX ?? 0;
        releaseLabel = 'Vertical Restraint Released';
    } else {
        releaseX = target.targetSection.xc;
        releaseLabel = target.type === 'shear' ? 'Shear Slide Cut' : 'Hinge Inserted';
    }

    const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
    const supportPosToLetter = new Map<number, string>();
    sortedSupports.forEach((s, idx) => {
        supportPosToLetter.set(s.position, String.fromCharCode(65 + idx));
    });

    const renderChartTitle = () => {
        if (target.type === 'reaction') {
            const letter = supportPosToLetter.get(target.targetSupportX ?? 0) || '?';
            return (
                <span>
                    MÜLLER-BRESLAU SHAPE (R<sub>{letter}</sub>)
                </span>
            );
        }
        const xcStr = target.targetSection.xc.toFixed(2);
        if (target.type === 'shear') {
            return (
                <span>
                    MÜLLER-BRESLAU SHAPE (V<sub>c</sub>, X<sub>c</sub> = {xcStr}M)
                </span>
            );
        }
        return (
            <span>
                MÜLLER-BRESLAU SHAPE (M<sub>c</sub>, X<sub>c</sub> = {xcStr}M)
            </span>
        );
    };

    const refPointsRaw = [
        { x: 0, label: '0.0m' },
        { x: length, label: `${length.toFixed(1)}m` }
    ];
    supports.forEach((s) => {
        const letter = supportPosToLetter.get(s.position) || '';
        refPointsRaw.push({ x: s.position, label: letter });
    });
    releases.forEach((r) => {
        refPointsRaw.push({ x: r.position, label: 'H' });
    });
    if (target.type !== 'reaction') {
        refPointsRaw.push({ x: target.targetSection.xc, label: 'x_c' });
    }

    const refPoints: { x: number; label: string }[] = [];
    refPointsRaw.sort((a, b) => a.x - b.x).forEach(pt => {
        const match = refPoints.find(u => Math.abs(u.x - pt.x) < 0.15);
        if (match) {
            match.label += `/${pt.label}`;
        } else {
            refPoints.push(pt);
        }
    });

    return (
        <div
            onClick={() => setActiveTargetId(target.id)}
            className={`flex flex-col gap-4 rounded-xl border p-4 backdrop-blur-md transition-all cursor-pointer ${
                isActive
                    ? 'border-primary bg-card/75 shadow-[0_4px_20px_rgba(59,130,246,0.12)] ring-1 ring-primary/20'
                    : 'border-border bg-card/40 hover:border-border/80 hover:bg-card/50'
            }`}
        >
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-foreground/90'}`}>
                        {renderChartTitle()}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Deflected mechanism shape from unit virtual displacement</p>
                </div>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setIsAnimating(!isAnimating)}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-foreground hover:bg-muted transition-all flex items-center gap-1"
                    >
                        {isAnimating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        <span>{isAnimating ? 'Pause' : 'Play'}</span>
                    </button>
                    <button
                        onClick={() => {
                            setProgress(1.0);
                            setIsAnimating(false);
                        }}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-foreground hover:bg-muted transition-all flex items-center gap-1"
                    >
                        <RefreshCw className="h-3 w-3" />
                        <span>Static Max</span>
                    </button>
                </div>
            </div>

            <div className="relative bg-background/25 rounded-xl border border-border/30 p-2">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
                    <defs>
                        <linearGradient id="mbGradPosPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="mbGradNegOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="mbGradPosGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="mbGradNegRed" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                        </linearGradient>
                        <marker id="mb-arrow-dir" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--destructive)" />
                        </marker>
                    </defs>

                    {/* Reference guidelines */}
                    {refPoints.map((pt, idx) => {
                        const px = toPixelX(pt.x);
                        return (
                            <g key={idx} className="opacity-[0.18]">
                                <line x1={px} y1={10} x2={px} y2={height - 25} stroke="var(--foreground)" strokeWidth={1} strokeDasharray="3,3" />
                                <text x={px} y={height - 12} textAnchor="middle" className="fill-foreground text-[8px] font-bold">{pt.label}</text>
                            </g>
                        );
                    })}

                    <line x1={paddingX} y1={yBeam} x2={width - paddingX} y2={yBeam} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />

                    {subSegments.map((seg, idx) => {
                        const isPos = seg.isPos;
                        const strokeColor = isPos ? (isMoment ? '#10b981' : 'var(--primary)') : (isMoment ? '#ef4444' : '#f97316');
                        const fillGradient = isPos ? (isMoment ? 'url(#mbGradPosGreen)' : 'url(#mbGradPosPrimary)') : (isMoment ? 'url(#mbGradNegRed)' : 'url(#mbGradNegOrange)');

                        const firstPt = seg.points[0];
                        const lastPt = seg.points[seg.points.length - 1];
                        if (!firstPt || !lastPt) return null;

                        let segAreaD = `M ${toPixelX(firstPt.x)} ${yBeam}`;
                        let segLineD = '';
                        seg.points.forEach((p, sIdx) => {
                            const px = toPixelX(p.x);
                            const py = yBeam - p.y * scaleY;
                            segAreaD += ` L ${px} ${py}`;
                            segLineD += (sIdx === 0 ? 'M' : ' L') + ` ${px} ${py}`;
                        });
                        segAreaD += ` L ${toPixelX(lastPt.x)} ${yBeam} Z`;

                        return (
                            <g key={idx}>
                                <motion.path layout d={segAreaD} fill={fillGradient} transition={{ type: 'spring', stiffness: 200, damping: 25 }} />
                                <motion.path layout d={segLineD} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" transition={{ type: 'spring', stiffness: 200, damping: 25 }} />
                            </g>
                        );
                    })}

                    {activePoints.map((cp, idx) => {
                        const px = toPixelX(cp.x);
                        const py = yBeam - cp.ordinate * scaleY * progress;
                        const isAbove = cp.ordinate >= 0;
                        const isDuplicateX = idx > 0 && Math.abs(activePoints[idx - 1]!.x - cp.x) < 0.001;
                        const labelY = isDuplicateX ? (isAbove ? py + 14 : py - 6) : (isAbove ? py - 8 : py + 14);
                        const dotColor = isAbove ? (isMoment ? '#10b981' : 'var(--primary)') : (isMoment ? '#ef4444' : '#f97316');

                        return (
                            <g key={idx}>
                                <circle cx={px} cy={py} r={3.5} fill={dotColor} />
                                <text x={px} y={labelY} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold select-none">
                                    {(cp.ordinate * progress).toFixed(3)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Virtual Displacement Indicator */}
                    <g>
                        <line x1={toPixelX(releaseX)} y1={yBeam} x2={toPixelX(releaseX)} y2={yBeam - 30 * progress} stroke="var(--destructive)" strokeWidth={2} markerEnd="url(#mb-arrow-dir)" />
                        <circle cx={toPixelX(releaseX)} cy={yBeam} r={4} fill="var(--destructive)" />
                        <text x={toPixelX(releaseX)} y={yBeam - 35 * progress - 2} textAnchor="middle" className="fill-destructive text-[9px] font-extrabold select-none">
                            {target.type === 'moment' ? 'θ = 1.0' : 'Δ = 1.0'}
                        </text>
                    </g>

                    <text x={toPixelX(releaseX)} y={height - 2} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold italic">
                        {releaseLabel} at {releaseX.toFixed(2)}m
                    </text>
                </svg>
            </div>
        </div>
    );
};
export default MullerBreslauAnimator;
