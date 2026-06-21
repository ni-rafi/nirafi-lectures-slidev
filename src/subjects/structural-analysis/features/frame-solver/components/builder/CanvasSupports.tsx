import React from 'react';
import { IFrameSupport, INode } from '../../types/frame';
import { toPixelX, toPixelY } from '../../hooks/useFrameBuilder';

interface CanvasSupportsProps {
  supports: IFrameSupport[];
  nodes: INode[];
  selectedId: string | null;
  activeMode: string;
  setSelectedId: (id: string | null) => void;
}

export const CanvasSupports: React.FC<CanvasSupportsProps> = ({
  supports,
  nodes,
  selectedId,
  activeMode,
  setSelectedId
}) => {
  return (
    <g>
      {supports.map(support => {
        const node = nodes.find(n => n.id === support.nodeId);
        if (!node) return null;

        const cx = toPixelX(node.x);
        const cy = toPixelY(node.y);
        const isSelected = selectedId === support.id || selectedId === `support_${support.nodeId}`;

        // Render support symbols relative to (0,0) and use transform
        return (
          <g
            key={support.id}
            transform={`translate(${cx}, ${cy}) rotate(${support.angle})`}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (activeMode === 'select') {
                setSelectedId(support.id);
              }
            }}
          >
            {/* Click target helper */}
            <circle cx={0} cy={12} r={16} fill="transparent" />

            {support.type === 'hinge' && (
              <g>
                {/* Hinge Triangle */}
                <polygon
                  points="0,0 -10,14 10,14"
                  fill="var(--card)"
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={1.5}
                />
                {/* Ground line */}
                <line
                  x1={-16}
                  y1={14}
                  x2={16}
                  y2={14}
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={2}
                />
                {/* Hatches */}
                <line x1={-12} y1={14} x2={-16} y2={19} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={-6} y1={14} x2={-10} y2={19} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={0} y1={14} x2={-4} y2={19} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={6} y1={14} x2={2} y2={19} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={12} y1={14} x2={8} y2={19} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
              </g>
            )}

            {support.type === 'roller' && (
              <g>
                {/* Roller Triangle */}
                <polygon
                  points="0,0 -9,12 9,12"
                  fill="var(--card)"
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={1.5}
                />
                {/* Roller Wheel circle */}
                <circle
                  cx={0}
                  cy={15}
                  r={3}
                  fill="var(--card)"
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={1.5}
                />
                {/* Ground line */}
                <line
                  x1={-16}
                  y1={18}
                  x2={16}
                  y2={18}
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={2}
                />
                {/* Hatches */}
                <line x1={-12} y1={18} x2={-16} y2={23} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={-6} y1={18} x2={-10} y2={23} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={0} y1={18} x2={-4} y2={23} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={6} y1={18} x2={2} y2={23} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={12} y1={18} x2={8} y2={23} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
              </g>
            )}

            {support.type === 'fixed' && (
              <g>
                {/* Connector short line */}
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={6}
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={2}
                />
                {/* Ground plate line */}
                <line
                  x1={-15}
                  y1={6}
                  x2={15}
                  y2={6}
                  stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'}
                  strokeWidth={2.5}
                />
                {/* Hatches */}
                <line x1={-12} y1={6} x2={-16} y2={12} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={-6} y1={6} x2={-10} y2={12} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={0} y1={6} x2={-4} y2={12} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={6} y1={6} x2={2} y2={12} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
                <line x1={12} y1={6} x2={8} y2={12} stroke={isSelected ? 'var(--primary)' : 'var(--foreground)'} strokeWidth={1} opacity={0.7} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
