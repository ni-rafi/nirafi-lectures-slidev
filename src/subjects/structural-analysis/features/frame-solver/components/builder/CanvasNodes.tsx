import React from 'react';
import { INode } from '../../types/frame';
import { toPixelX, toPixelY } from '../../hooks/useFrameBuilder';

interface CanvasNodesProps {
  nodes: INode[];
  selectedId: string | null;
  activeMode: string;
  onNodeMouseDown: (nodeId: string, e: React.MouseEvent) => void;
}

export const CanvasNodes: React.FC<CanvasNodesProps> = ({
  nodes,
  selectedId,
  activeMode,
  onNodeMouseDown
}) => {
  return (
    <g>
      {nodes.map(node => {
        const cx = toPixelX(node.x);
        const cy = toPixelY(node.y);
        const isSelected = selectedId === node.id;

        // Visual attributes based on workspace mode
        const isSelectMode = activeMode === 'select';
        const showNode = isSelectMode || activeMode === 'draw-member' || activeMode === 'add-support' || activeMode === 'add-load';

        if (!showNode) return null;

        return (
          <g
            key={node.id}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => onNodeMouseDown(node.id, e)}
          >
            {/* Hit target circle (invisible, large) */}
            <circle
              cx={cx}
              cy={cy}
              r={12}
              fill="transparent"
            />

            {/* Visual outer ring if selected */}
            {isSelected && (
              <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={1.5}
                className="animate-pulse"
              />
            )}

            {/* Core Node Circle */}
            <circle
              cx={cx}
              cy={cy}
              r={isSelected ? 5 : 4}
              fill={isSelected ? 'var(--primary)' : 'var(--card)'}
              stroke={isSelected ? 'var(--primary)' : 'var(--muted-foreground)'}
              strokeWidth={1.5}
              className="transition-all hover:scale-125 hover:fill-primary-foreground"
            />

            {/* Tiny text coordinate label in select mode */}
            {isSelectMode && isSelected && (
              <text
                x={cx + 10}
                y={cy - 10}
                fill="var(--foreground)"
                fontSize={10}
                className="pointer-events-none select-none font-medium bg-background px-1 rounded border border-border"
              >
                ({node.x}, {node.y})m
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
