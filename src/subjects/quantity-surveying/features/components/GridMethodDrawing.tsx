import React from 'react';

interface GridMethodDrawingProps {
  activeCell: number | null; // 1, 2, 3, 4 or null
  onCellClick?: (cellId: number) => void;
  className?: string;
}

export const GridMethodDrawing: React.FC<GridMethodDrawingProps> = ({
  activeCell,
  onCellClick,
  className = '',
}) => {
  // 9 Node coordinates (Natural Ground Level grid)
  const nodes = [
    { x: 150, y: 40, label: 'd1 = 1.2m' }, // Node 0
    { x: 195, y: 62.5, label: 'd2 = 1.5m' }, // Node 1
    { x: 240, y: 85, label: 'd3 = 1.0m' }, // Node 2
    { x: 105, y: 62.5, label: 'd4 = 1.4m' }, // Node 3
    { x: 150, y: 85, label: 'd5 = 1.6m' }, // Node 4 (Center)
    { x: 195, y: 107.5, label: 'd6 = 1.1m' }, // Node 5
    { x: 60, y: 85, label: 'd7 = 0.9m' }, // Node 6
    { x: 105, y: 107.5, label: 'd8 = 1.3m' }, // Node 7
    { x: 150, y: 130, label: 'd9 = 0.8m' }, // Node 8
  ];

  // Excavation Depths in meters (same order)
  const depths = [1.2, 1.5, 1.0, 1.4, 1.6, 1.1, 0.9, 1.3, 0.8];
  const depthScale = 15; // pixels per meter

  // Bottom coordinates (excavation bed)
  const botNodes = nodes.map((node, i) => ({
    x: node.x,
    y: node.y + (depths[i] ?? 0) * depthScale,
  }));

  // Define 4 cells by their node indices (clockwise)
  const cells = [
    { id: 1, indices: [0, 1, 4, 3], name: 'Cell 1 (North-West)' },
    { id: 2, indices: [1, 2, 5, 4], name: 'Cell 2 (North-East)' },
    { id: 3, indices: [3, 4, 7, 6], name: 'Cell 3 (South-West)' },
    { id: 4, indices: [4, 5, 8, 7], name: 'Cell 4 (South-East)' },
  ];

  const getPolygonPath = (indices: number[], isBottom = false) => {
    const list = isBottom ? botNodes : nodes;
    return indices.map(idx => `${list[idx]!.x},${list[idx]!.y}`).join(' ');
  };

  const getActiveCellVolume = () => {
    if (activeCell === null) return null;
    const cell = cells.find(c => c.id === activeCell);
    if (!cell) return null;
    const cellDepths = cell.indices.map(idx => depths[idx] ?? 0);
    const avgDepth = cellDepths.reduce((a: number, b: number) => a + b, 0) / 4;
    // Assuming each cell is 5m x 5m = 25m²
    const area = 25.0;
    const vol = avgDepth * area;
    return {
      name: cell.name,
      depths: cellDepths,
      avg: avgDepth.toFixed(3),
      volume: vol.toFixed(3),
    };
  };

  const cellInfo = getActiveCellVolume();

  return (
    <div className={`w-full flex flex-col justify-between bg-muted/20 p-4 border border-border/40 rounded-xl ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        Interactive 2.5D Excavation Grid (Grid spacing = 5m)
      </span>

      <div className="h-48 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 10 300 160" className="w-full h-full select-none overflow-visible">
          {/* Grids rendering */}
          {cells.map(cell => {
            const isActive = activeCell === cell.id;
            return (
              <g
                key={cell.id}
                className="cursor-pointer"
                onClick={() => onCellClick && onCellClick(cell.id)}
              >
                {/* Ground Level Surface Quadrant */}
                <polygon
                  points={getPolygonPath(cell.indices)}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[1.5px]'
                      : 'fill-muted/20 stroke-border/40 hover:fill-muted/50'
                  }`}
                />
                {/* Pit Excavation Bed Surface Quadrant */}
                <polygon
                  points={getPolygonPath(cell.indices, true)}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'fill-emerald-500/20 stroke-emerald-600 stroke-[1.5px]'
                      : 'fill-muted/10 stroke-border/20'
                  }`}
                />
              </g>
            );
          })}

          {/* Depth lines (Vertical edges connecting ground to bed) */}
          {nodes.map((node, i) => {
            // Determine if this line belongs to the active cell
            const isLineActive =
              activeCell !== null &&
              (cells[activeCell - 1]?.indices.includes(i) ?? false);

            return (
              <line
                key={i}
                x1={node.x}
                y1={node.y}
                x2={botNodes[i]?.x ?? node.x}
                y2={botNodes[i]?.y ?? node.y}
                className={`transition-all duration-300 ${
                  isLineActive
                    ? 'stroke-indigo-500 stroke-[2px]'
                    : 'stroke-muted-foreground/30 stroke-[1px] stroke-dasharray-[2 2]'
                }`}
              />
            );
          })}

          {/* Depth Label nodes on click/hover */}
          {nodes.map((node, i) => (
            <g key={i}>
              {/* Small ground level anchor */}
              <circle cx={node.x} cy={node.y} r="2" className="fill-indigo-600" />
              {/* Depth value text */}
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                className="fill-muted-foreground text-[8px] font-mono select-none"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {cellInfo && (
          <div className="absolute bottom-2 left-2 right-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[10px] p-2 rounded-md font-mono flex flex-col space-y-1 z-10">
            <span className="font-bold text-center">{cellInfo.name}</span>
            <div className="flex justify-between text-[9px]">
              <span>Depths: ({cellInfo.depths.join(' + ')}) / 4 = {cellInfo.avg}m</span>
              <span className="font-bold">Vol = {cellInfo.volume} m³</span>
            </div>
          </div>
        )}
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-2 leading-normal h-8">
        {activeCell === null
          ? 'Click any quadrant to activate its grid cell calculation.'
          : 'A Corner Depth average is multiplied by cell Area (25 m²) to determine volume.'}
      </span>
    </div>
  );
};
