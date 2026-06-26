import React, { useRef, useMemo } from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { motion, AnimatePresence } from 'motion/react';
import { IInfluenceOrdinate, IInfluenceTarget } from '../../../../cores/influence-lines/influence-lines.interface';
import { InfluenceLinesService } from '../../../../cores/influence-lines/influenceLinesService';
import { splitIntoSignSegments } from '@/subjects/mechanics-of-solids/features/sfd-bmd/utils/chartUtils';

interface InfluenceLineChartProps {
    target: IInfluenceTarget;
}

export const InfluenceLineChart: React.FC<InfluenceLineChartProps> = ({ target }) => {
    const { length, hoverX, setHoverX, supports, releases, activeTargetId, setActiveTargetId } = useInfluenceWorkspace();
    const service = useMemo(() => new InfluenceLinesService(), []);
    const svgRef = useRef<SVGSVGElement>(null);

    const isActive = target.id === activeTargetId;

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

    if (!solverResult || !solverResult.success || solverResult.ildPoints.length === 0) return null;

    const activePoints = solverResult.ildPoints;
    const isMoment = target.type === 'moment';

    const paddingX = 60;
    const width = 800;
    const height = 160;
    const chartW = width - paddingX * 2;
    const midY = height / 2;

    const toPixelX = (x: number) => paddingX + (x / length) * chartW;
    const toMeterX = (pixel: number) => ((pixel - paddingX) / chartW) * length;

    let maxAbsVal = 1.0;
    activePoints.forEach((pt) => {
        const absVal = Math.abs(pt.ordinate);
        if (absVal > maxAbsVal) maxAbsVal = absVal;
    });
    const scaleY = 50 / maxAbsVal;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        // Scale screen-space offset to viewBox-space coordinates before converting to meters.
        // The SVG is responsive (w-full) so rect.width differs from the viewBox width.
        const clientX = (e.clientX - rect.left) * (width / rect.width);
        const xMeter = Math.max(0, Math.min(length, toMeterX(clientX)));
        setHoverX(parseFloat(xMeter.toFixed(2)));
    };

    const interpolateOrdinate = (ild: IInfluenceOrdinate[], targetX: number): number => {
        const exactMatches = ild.filter(pt => Math.abs(pt.x - targetX) < 0.01);
        if (exactMatches.length > 0) return exactMatches[0]!.ordinate;

        let leftPt = ild[0]!;
        let rightPt = ild[ild.length - 1]!;
        for (let i = 0; i < ild.length - 1; i++) {
            const cur = ild[i]!;
            const next = ild[i + 1]!;
            if (cur.x <= targetX && next.x >= targetX) {
                leftPt = cur;
                rightPt = next;
                break;
            }
        }
        const span = rightPt.x - leftPt.x;
        if (span === 0) return leftPt.ordinate;
        return leftPt.ordinate + ((targetX - leftPt.x) / span) * (rightPt.ordinate - leftPt.ordinate);
    };

    let hoverData = null;
    if (hoverX !== null) {
        const val = interpolateOrdinate(activePoints, hoverX);
        const projX = toPixelX(hoverX);
        const projY = midY - val * scaleY;
        hoverData = {
            x: hoverX,
            val: parseFloat(val.toFixed(3)),
            px: (projX / width) * 100,
            py: (projY / height) * 100,
        };
    }

    const subSegments = splitIntoSignSegments(activePoints.map(p => ({ x: p.x, y: p.ordinate })));

    const getUnitString = () => (target.type === 'moment' ? 'm (kN·m/kN)' : '(kN/kN)');

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
                    INFLUENCE LINE DIAGRAM (R<sub>{letter}</sub>)
                </span>
            );
        }
        const xcStr = target.targetSection.xc.toFixed(2);
        if (target.type === 'shear') {
            return (
                <span>
                    INFLUENCE LINE DIAGRAM (V<sub>c</sub>, X<sub>c</sub> = {xcStr}M)
                </span>
            );
        }
        return (
            <span>
                INFLUENCE LINE DIAGRAM (M<sub>c</sub>, X<sub>c</sub> = {xcStr}M)
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
            className={`relative w-full rounded-xl border p-4 backdrop-blur-md transition-all cursor-pointer ${
                isActive
                    ? 'border-primary bg-card/75 shadow-[0_4px_20px_rgba(59,130,246,0.12)] ring-1 ring-primary/20'
                    : 'border-border bg-card/40 hover:border-border/80 hover:bg-card/50'
            }`}
        >
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                    {renderChartTitle()}
                </span>
                <span className="text-[10px] lowercase text-muted-foreground/70">units: {getUnitString()}</span>
            </div>

            <div className="relative">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full overflow-visible"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverX(null)}
                >
                    <defs>
                        <linearGradient id="ildGradPosPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="ildGradNegOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="ildGradPosGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="ildGradNegRed" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Reference guidelines */}
                    {refPoints.map((pt, idx) => {
                        const px = toPixelX(pt.x);
                        return (
                            <g key={idx} className="opacity-[0.18]">
                                <line x1={px} y1={10} x2={px} y2={height - 22} stroke="var(--foreground)" strokeWidth={1} strokeDasharray="3,3" />
                                <text x={px} y={height - 10} textAnchor="middle" className="fill-foreground text-[8px] font-bold">{pt.label}</text>
                            </g>
                        );
                    })}

                    <line x1={paddingX} y1={midY} x2={paddingX + chartW} y2={midY} stroke="var(--border)" strokeWidth={1.5} />

                    {subSegments.map((seg, idx) => {
                        const isPos = seg.isPos;
                        const strokeColor = isPos ? (isMoment ? '#10b981' : 'var(--primary)') : (isMoment ? '#ef4444' : '#f97316');
                        const fillGradient = isPos ? (isMoment ? 'url(#ildGradPosGreen)' : 'url(#ildGradPosPrimary)') : (isMoment ? 'url(#ildGradNegRed)' : 'url(#ildGradNegOrange)');

                        const firstPt = seg.points[0];
                        const lastPt = seg.points[seg.points.length - 1];
                        if (!firstPt || !lastPt) return null;

                        let segAreaD = `M ${toPixelX(firstPt.x)} ${midY}`;
                        let segLineD = '';
                        seg.points.forEach((p, sIdx) => {
                            const px = toPixelX(p.x);
                            const py = midY - p.y * scaleY;
                            segAreaD += ` L ${px} ${py}`;
                            segLineD += (sIdx === 0 ? 'M' : ' L') + ` ${px} ${py}`;
                        });
                        segAreaD += ` L ${toPixelX(lastPt.x)} ${midY} Z`;

                        return (
                            <g key={idx}>
                                <motion.path layout d={segAreaD} fill={fillGradient} transition={{ type: 'spring', stiffness: 200, damping: 25 }} />
                                <motion.path layout d={segLineD} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" transition={{ type: 'spring', stiffness: 200, damping: 25 }} />
                            </g>
                        );
                    })}

                    {activePoints.map((cp, idx) => {
                        const px = toPixelX(cp.x);
                        const py = midY - cp.ordinate * scaleY;
                        const isAbove = cp.ordinate >= 0;
                        const isDuplicateX = idx > 0 && Math.abs(activePoints[idx - 1]!.x - cp.x) < 0.001;
                        const labelY = isDuplicateX ? (isAbove ? py + 14 : py - 6) : (isAbove ? py - 8 : py + 14);
                        const dotColor = isAbove ? (isMoment ? '#10b981' : 'var(--primary)') : (isMoment ? '#ef4444' : '#f97316');

                        return (
                            <g key={idx}>
                                <circle cx={px} cy={py} r={3.5} fill={dotColor} />
                                <text x={px} y={labelY} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold select-none">
                                    {cp.ordinate.toFixed(3)}
                                </text>
                            </g>
                        );
                    })}

                    {hoverData && (
                        <g>
                            <line
                                x1={toPixelX(hoverData.x)} y1={10} x2={toPixelX(hoverData.x)} y2={height - 20}
                                stroke={hoverData.val >= 0 ? (isMoment ? '#10b981' : 'var(--primary)') : (isMoment ? '#ef4444' : '#f97316')}
                                strokeWidth={1} strokeDasharray="3,3" opacity={0.65}
                            />
                            <circle cx={toPixelX(hoverData.x)} cy={midY - hoverData.val * scaleY} r={4.5} fill={hoverData.val >= 0 ? (isMoment ? '#10b981' : 'var(--primary)') : (isMoment ? '#ef4444' : '#f97316')} />
                        </g>
                    )}
                </svg>

                <AnimatePresence>
                    {hoverData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.1 }}
                            className="absolute pointer-events-none rounded-xl border border-border/80 bg-background/85 px-3 py-2 text-left shadow-lg backdrop-blur-md"
                            style={{ left: `${hoverData.px}%`, top: `${hoverData.py}%`, transform: `translate(${hoverData.px > 80 ? '-110%' : '15px'}, -50%)` }}
                        >
                            <div className="text-[10px] font-semibold text-muted-foreground">Location: {hoverData.x} m</div>
                            <div className={`text-xs font-bold ${hoverData.val >= 0 ? (isMoment ? 'text-emerald-500' : 'text-primary') : (isMoment ? 'text-red-500' : 'text-orange-500')}`}>
                                ordinate: {hoverData.val} {getUnitString()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
export default InfluenceLineChart;
