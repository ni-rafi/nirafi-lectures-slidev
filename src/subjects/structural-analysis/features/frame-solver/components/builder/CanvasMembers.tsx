import React from 'react';
import { IMember, INode } from '../../types/frame';
import { toPixelX, toPixelY } from '../../hooks/useFrameBuilder';

interface CanvasMembersProps {
  members: IMember[];
  nodes: INode[];
  selectedId: string | null;
  activeMode: string;
  setSelectedId: (id: string | null) => void;
}

export const CanvasMembers: React.FC<CanvasMembersProps> = ({
  members,
  nodes,
  selectedId,
  activeMode,
  setSelectedId
}) => {
  return (
    <g>
      {members.map(member => {
        const startNode = nodes.find(n => n.id === member.startNodeId);
        const endNode = nodes.find(n => n.id === member.endNodeId);
        if (!startNode || !endNode) return null;

        const x1 = toPixelX(startNode.x);
        const y1 = toPixelY(startNode.y);
        const x2 = toPixelX(endNode.x);
        const y2 = toPixelY(endNode.y);

        const isSelected = selectedId === member.id;

        // Calculate hinge offsets if releases are active
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        
        // Offset start/end slightly if hinge is present to show gaps
        const gap = 6;
        const x1_offset = member.releases?.start ? x1 + (dx / len) * gap : x1;
        const y1_offset = member.releases?.start ? y1 + (dy / len) * gap : y1;
        const x2_offset = member.releases?.end ? x2 - (dx / len) * gap : x2;
        const y2_offset = member.releases?.end ? y2 - (dy / len) * gap : y2;

        return (
          <g key={member.id} className="cursor-pointer">
            {/* Fat transparent hover target */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="transparent"
              strokeWidth={16}
              onClick={(e) => {
                e.stopPropagation();
                if (activeMode === 'select') {
                  setSelectedId(member.id);
                }
              }}
            />

            {/* Visual Member */}
            <line
              x1={x1_offset}
              y1={y1_offset}
              x2={x2_offset}
              y2={y2_offset}
              stroke={isSelected ? 'var(--primary)' : 'var(--muted-foreground)'}
              strokeWidth={isSelected ? 6 : 4}
              strokeLinecap="round"
              className="transition-all"
              onClick={(e) => {
                e.stopPropagation();
                if (activeMode === 'select') {
                  setSelectedId(member.id);
                }
              }}
            />

            {/* Start release hinge circle */}
            {member.releases?.start && (
              <circle
                cx={x1 + (dx / len) * gap}
                cy={y1 + (dy / len) * gap}
                r={4}
                fill="var(--background)"
                stroke={isSelected ? 'var(--primary)' : 'var(--muted-foreground)'}
                strokeWidth={1.5}
              />
            )}

            {/* End release hinge circle */}
            {member.releases?.end && (
              <circle
                cx={x2 - (dx / len) * gap}
                cy={y2 - (dy / len) * gap}
                r={4}
                fill="var(--background)"
                stroke={isSelected ? 'var(--primary)' : 'var(--muted-foreground)'}
                strokeWidth={1.5}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
