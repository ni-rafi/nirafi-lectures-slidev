import React, { useRef } from 'react';
import { useFrameWorkspace } from '../../context/FrameWorkspaceContext';
import { useFrameBuilder, toPixelX, toPixelY, CANVAS_WIDTH, CANVAS_HEIGHT, X_ORIGIN, Y_ORIGIN } from '../../hooks/useFrameBuilder';
import { useFrameDragging } from '../../hooks/useFrameDragging';
import { CanvasMembers } from './CanvasMembers';
import { CanvasNodes } from './CanvasNodes';
import { CanvasSupports } from './CanvasSupports';
import { CanvasLoads } from './CanvasLoads';

export const FrameCanvas: React.FC = () => {
  const {
    nodes,
    members,
    supports,
    loads,
    activeMode,
    selectedElementId,
    gridSpacing,
    snapToGrid,
    setSelectedElementId
  } = useFrameWorkspace();

  const svgRef = useRef<SVGSVGElement>(null);

  const {
    drawingStartNode,
    setDrawingStartNode,
    draggedNodeId,
    setDraggedNodeId,
    previewPosition,
    setPreviewPosition
  } = useFrameBuilder();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleNodeMouseDown
  } = useFrameDragging({
    svgRef,
    drawingStartNode,
    setDrawingStartNode,
    draggedNodeId,
    setDraggedNodeId,
    setPreviewPosition
  });

  // Generate grid lines
  const gridLines = [];
  const maxMetersX = 18;
  const maxMetersY = 10;

  // Vertical lines
  for (let x = 0; x <= maxMetersX; x += gridSpacing) {
    const px = toPixelX(x);
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={px}
        y1={0}
        x2={px}
        y2={CANVAS_HEIGHT}
        stroke="var(--border)"
        strokeWidth={x === 0 ? 1.5 : 0.5}
        strokeDasharray={x === 0 ? undefined : '2,3'}
        opacity={x === 0 ? 0.8 : 0.3}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= maxMetersY; y += gridSpacing) {
    const py = toPixelY(y);
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={py}
        x2={CANVAS_WIDTH}
        y2={py}
        stroke="var(--border)"
        strokeWidth={y === 0 ? 1.5 : 0.5}
        strokeDasharray={y === 0 ? undefined : '2,3'}
        opacity={y === 0 ? 0.8 : 0.3}
      />
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interactive 2D Frame Workspace</div>
        <div className="text-[10px] text-muted-foreground flex gap-3">
          <span>Grid: {gridSpacing}m</span>
          <span>Snapping: {snapToGrid ? 'ON' : 'OFF'}</span>
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="w-full select-none overflow-visible border border-border/40 rounded-lg bg-background/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          setSelectedElementId(null);
        }}
      >
        {/* Draw coordinate system grid */}
        <g>{gridLines}</g>

        {/* Axis Labels */}
        <text x={X_ORIGIN - 12} y={Y_ORIGIN + 4} fill="var(--muted-foreground)" fontSize={10} fontWeight="bold" textAnchor="end">0,0</text>
        <text x={CANVAS_WIDTH - 20} y={Y_ORIGIN + 15} fill="var(--muted-foreground)" fontSize={9} textAnchor="end">X (meters)</text>
        <text x={X_ORIGIN - 15} y={24} fill="var(--muted-foreground)" fontSize={9} transform={`rotate(-90, ${X_ORIGIN - 15}, 24)`}>Y (meters)</text>

        {/* Render Members */}
        <CanvasMembers
          members={members}
          nodes={nodes}
          selectedId={selectedElementId}
          activeMode={activeMode}
          setSelectedId={setSelectedElementId}
        />

        {/* Render Supports */}
        <CanvasSupports
          supports={supports}
          nodes={nodes}
          selectedId={selectedElementId}
          activeMode={activeMode}
          setSelectedId={setSelectedElementId}
        />

        {/* Render Loads */}
        <CanvasLoads
          loads={loads}
          nodes={nodes}
          members={members}
          selectedId={selectedElementId}
          activeMode={activeMode}
          setSelectedId={setSelectedElementId}
        />

        {/* Render Nodes */}
        <CanvasNodes
          nodes={nodes}
          selectedId={selectedElementId}
          activeMode={activeMode}
          onNodeMouseDown={handleNodeMouseDown}
        />

        {/* Member Drawing Preview Line */}
        {activeMode === 'draw-member' && drawingStartNode && previewPosition && (
          <g>
            <line
              x1={toPixelX(drawingStartNode.x)}
              y1={toPixelY(drawingStartNode.y)}
              x2={toPixelX(previewPosition.x)}
              y2={toPixelY(previewPosition.y)}
              stroke="var(--primary)"
              strokeWidth={3}
              strokeDasharray="4,4"
              opacity={0.7}
            />
            <circle
              cx={toPixelX(previewPosition.x)}
              cy={toPixelY(previewPosition.y)}
              r={4}
              fill="var(--primary)"
              opacity={0.8}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
export default FrameCanvas;
