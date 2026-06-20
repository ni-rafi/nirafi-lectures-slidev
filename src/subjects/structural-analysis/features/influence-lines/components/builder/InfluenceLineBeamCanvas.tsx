import React, { useRef } from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { useInfluenceLinesEngine } from '../../hooks/useInfluenceLinesEngine';
import { useInfluenceDragging } from '../../hooks/useInfluenceDragging';
import { CanvasSupports } from './CanvasSupports';
import { CanvasReleases } from './CanvasReleases';
import { CanvasTargetSection } from './CanvasTargetSection';
import { CanvasVehicleTransit } from './CanvasVehicleTransit';
import { CanvasBeamMember } from './CanvasBeamMember';
import { CanvasHoverSync } from './CanvasHoverSync';
import { CanvasArrowMarker } from './CanvasArrowMarker';

export const InfluenceLineBeamCanvas: React.FC = () => {
    const {
        length,
        supports,
        releases,
        targetSection,
        targetSupportX,
        analysisType,
        activeVehicle,
        transitPosition,
        selectedId,
        hoverX,
        setSelectedId,
        updateSupport,
        updateRelease,
        setTargetSection,
        setTargetSupportX,
        setHoverX,
    } = useInfluenceWorkspace();

    const { solverResult } = useInfluenceLinesEngine();
    const svgRef = useRef<SVGSVGElement>(null);

    // SVG coordinates constants
    const paddingX = 60;
    const width = 800;
    const beamW = width - paddingX * 2; // 680px
    const yBeam = 100; // beam horizontal center

    const toPixel = (pos: number) => paddingX + (pos / length) * beamW;
    const toMeter = (pixel: number) => {
        const raw = ((pixel - paddingX) / beamW) * length;
        return Math.max(0, Math.min(length, parseFloat(raw.toFixed(2))));
    };

    const updateTargetSection = (sec: { xc: number; label?: string }) => {
        setTargetSection({ xc: sec.xc, label: sec.label || 'C' });
    };

    const {
        wasDraggingRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
    } = useInfluenceDragging({
        length,
        beamW,
        toMeter,
        setSelectedId,
        updateSupport,
        updateRelease,
        updateTargetSection,
        setHoverX,
        svgRef,
    });

    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Influence Line Builder Canvas</span>
                <span className="text-[10px] text-muted-foreground">Drag supports or target section to configure</span>
            </div>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} 205`}
                className="w-full select-none overflow-visible"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => {
                    wasDraggingRef.current = false;
                }}
                onClick={() => {
                    if (wasDraggingRef.current) {
                        wasDraggingRef.current = false;
                        return;
                    }
                    setSelectedId(null);
                }}
            >
                {/* Horizontal Beam Member representation */}
                <CanvasBeamMember paddingX={paddingX} width={width} yBeam={yBeam} />

                {/* Render Supports Subcomponent */}
                <CanvasSupports
                    supports={supports}
                    selectedId={selectedId}
                    toPixel={toPixel}
                    yBeam={yBeam}
                    length={length}
                    targetSupportX={targetSupportX}
                    analysisType={analysisType}
                    handleMouseDown={handleMouseDown}
                    setTargetSupportX={setTargetSupportX}
                />

                {/* Render Internal Releases Subcomponent */}
                <CanvasReleases
                    releases={releases}
                    selectedId={selectedId}
                    toPixel={toPixel}
                    yBeam={yBeam}
                    handleMouseDown={handleMouseDown}
                />

                {/* Render Target Section xc slide selector indicator */}
                <CanvasTargetSection
                    targetSection={targetSection}
                    analysisType={analysisType}
                    toPixel={toPixel}
                    handleMouseDown={handleMouseDown}
                />

                {/* Render Moving Load Axles Overlay dynamically */}
                <CanvasVehicleTransit
                    activeVehicle={activeVehicle}
                    transitPosition={transitPosition}
                    length={length}
                    toPixel={toPixel}
                    yBeam={yBeam}
                    success={solverResult.success}
                />

                {/* SVG Arrow Marker definitions */}
                <CanvasArrowMarker />

                {/* Hover Sync vertical line */}
                <CanvasHoverSync hoverX={hoverX} toPixel={toPixel} yBeam={yBeam} />
            </svg>
        </div>
    );
};

export default InfluenceLineBeamCanvas;
