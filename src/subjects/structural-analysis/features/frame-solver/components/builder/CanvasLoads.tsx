import React from 'react';
import { IFrameLoad, INode, IMember } from '../../types/frame';
import { toPixelX, toPixelY } from '../../hooks/useFrameBuilder';

interface CanvasLoadsProps {
  loads: IFrameLoad[];
  nodes: INode[];
  members: IMember[];
  selectedId: string | null;
  activeMode: string;
  setSelectedId: (id: string | null) => void;
}

export const CanvasLoads: React.FC<CanvasLoadsProps> = ({
  loads,
  nodes,
  members,
  selectedId,
  activeMode,
  setSelectedId
}) => {
  const drawArrow = (x1: number, y1: number, x2: number, y2: number, isSelected: boolean, label: string) => {
    // Calculate angle of arrow to draw arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = 6;
    const arrowHeadX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowHeadY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowHeadX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowHeadY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);



    return (
      <g className="transition-all">
        {/* Click target (fat line) */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth={10}
        />
        {/* Main Line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          strokeWidth={isSelected ? 3 : 2}
        />
        {/* Arrowhead */}
        <polygon
          points={`${x2},${y2} ${arrowHeadX1},${arrowHeadY1} ${arrowHeadX2},${arrowHeadY2}`}
          fill={isSelected ? 'var(--primary)' : 'var(--destructive)'}
        />
        {/* Label */}
        <text
          x={x1 - 10 * Math.cos(angle + Math.PI / 2)}
          y={y1 - 10 * Math.sin(angle + Math.PI / 2)}
          fill={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </g>
    );
  };

  const drawMoment = (cx: number, cy: number, isSelected: boolean, magnitude: number, label: string) => {
    const isClockwise = magnitude > 0;
    
    // Draw an arc around the node
    const r = 16;
    const startAngle = isClockwise ? -Math.PI / 2 : Math.PI;
    const endAngle = isClockwise ? Math.PI : -Math.PI / 2;
    
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    
    const largeArc = 1; // 270 degree arc
    const sweep = isClockwise ? 1 : 0;
    
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`;

    // Head angles
    const headAngle = endAngle + (isClockwise ? Math.PI / 2 : -Math.PI / 2);
    const size = 5;
    const hx1 = x2 - size * Math.cos(headAngle - Math.PI / 6);
    const hy1 = y2 - size * Math.sin(headAngle - Math.PI / 6);
    const hx2 = x2 - size * Math.cos(headAngle + Math.PI / 6);
    const hy2 = y2 - size * Math.sin(headAngle + Math.PI / 6);

    return (
      <g>
        {/* Arc */}
        <path
          d={d}
          fill="none"
          stroke={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          strokeWidth={isSelected ? 2.5 : 1.75}
        />
        {/* Arrowhead */}
        <polygon
          points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`}
          fill={isSelected ? 'var(--primary)' : 'var(--destructive)'}
        />
        {/* Label */}
        <text
          cx={cx}
          cy={cy}
          x={cx}
          y={cy - 24}
          fill={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
        >
          {label}
        </text>
      </g>
    );
  };

  const renderLoad = (load: IFrameLoad) => {
    const isSelected = selectedId === load.id;
    let cx = 0;
    let cy = 0;
    let memberAngle = 0;

    if (load.attachedTo === 'node') {
      const node = nodes.find(n => n.id === load.nodeId);
      if (!node) return null;
      cx = toPixelX(node.x);
      cy = toPixelY(node.y);
    } else {
      const member = members.find(m => m.id === load.memberId);
      
      const actualMember = member;
      const actualStart = nodes.find(n => n.id === actualMember?.startNodeId);
      const actualEnd = nodes.find(n => n.id === actualMember?.endNodeId);

      if (!actualMember || !actualStart || !actualEnd) return null;

      const pos = load.position ?? 0.5;
      const lx = actualStart.x + pos * (actualEnd.x - actualStart.x);
      const ly = actualStart.y + pos * (actualEnd.y - actualStart.y);
      cx = toPixelX(lx);
      cy = toPixelY(ly);

      memberAngle = Math.atan2(toPixelY(actualEnd.y) - toPixelY(actualStart.y), toPixelX(actualEnd.x) - toPixelX(actualStart.x));
    }

    const valueStr = `${Math.abs(load.magnitude)} ${load.type === 'moment' ? 'kNm' : 'kN'}`;

    if (load.type === 'moment') {
      return drawMoment(cx, cy, isSelected, load.magnitude, valueStr);
    }

    // Determine force vector direction (pointing towards node/member point)
    let dx = 0;
    let dy = 0;

    if (load.direction === 'global-vertical') {
      // Pointing down (positive acts downwards)
      dy = load.magnitude >= 0 ? 1 : -1;
    } else if (load.direction === 'global-horizontal') {
      // Pointing right (positive acts rightwards)
      dx = load.magnitude >= 0 ? 1 : -1;
    } else if (load.direction === 'local-transverse') {
      // Perpendicular to member (positive points "downward/rightward" of member axis)
      const forceAngle = memberAngle + Math.PI / 2;
      dx = Math.cos(forceAngle);
      dy = Math.sin(forceAngle);
      if (load.magnitude < 0) {
        dx = -dx;
        dy = -dy;
      }
    }

    const arrowLength = 32;
    const x1 = cx - dx * arrowLength;
    const y1 = cy - dy * arrowLength;
    // Keep a tiny gap at destination
    const x2 = cx - dx * 3;
    const y2 = cy - dy * 3;

    return drawArrow(x1, y1, x2, y2, isSelected, valueStr);
  };

  // UDL Render function
  const renderUDL = (load: IFrameLoad) => {
    if (load.attachedTo !== 'member' || !load.memberId) return null;
    const member = members.find(m => m.id === load.memberId);
    const startNode = nodes.find(n => n.id === member?.startNodeId);
    const endNode = nodes.find(n => n.id === member?.endNodeId);
    if (!member || !startNode || !endNode) return null;

    const isSelected = selectedId === load.id;
    const x1 = toPixelX(startNode.x);
    const y1 = toPixelY(startNode.y);
    const x2 = toPixelX(endNode.x);
    const y2 = toPixelY(endNode.y);

    const dx = x2 - x1;
    const dy = y2 - y1;

    
    // Perpendicular direction for ticks
    const angle = Math.atan2(dy, dx);
    const perpAngle = angle - Math.PI / 2;
    const tickLen = 14;

    const tdx = Math.cos(perpAngle) * tickLen;
    const tdy = Math.sin(perpAngle) * tickLen;

    const ux1 = x1 + tdx;
    const uy1 = y1 + tdy;
    const ux2 = x2 + tdx;
    const uy2 = y2 + tdy;

    // Draw 5 perpendicular arrows along the member length
    const arrowCount = 5;
    const arrows = [];
    for (let i = 0; i < arrowCount; i++) {
      const t = i / (arrowCount - 1);
      const mx = x1 + t * dx;
      const my = y1 + t * dy;
      const ax = mx + tdx;
      const ay = my + tdy;
      arrows.push(
        <line
          key={i}
          x1={ax}
          y1={ay}
          x2={mx + Math.cos(perpAngle) * 3}
          y2={my + Math.sin(perpAngle) * 3}
          stroke={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          strokeWidth={1.5}
        />
      );
    }

    const labelStr = `${Math.abs(load.magnitude)} kN/m`;

    return (
      <g
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (activeMode === 'select') {
            setSelectedId(load.id);
          }
        }}
      >
        {/* Click target helper */}
        <polygon
          points={`${x1},${y1} ${x2},${y2} ${ux2},${uy2} ${ux1},${uy1}`}
          fill="transparent"
        />

        {/* Outer parallel baseline */}
        <line
          x1={ux1}
          y1={uy1}
          x2={ux2}
          y2={uy2}
          stroke={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          strokeWidth={isSelected ? 2.5 : 1.5}
        />

        {/* Ticks/arrows */}
        {arrows}

        {/* UDL label text */}
        <text
          x={(ux1 + ux2) / 2 - Math.cos(perpAngle) * 8}
          y={(uy1 + uy2) / 2 - Math.sin(perpAngle) * 8}
          fill={isSelected ? 'var(--primary)' : 'var(--destructive)'}
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
          transform={`rotate(${(angle * 180) / Math.PI}, ${(ux1 + ux2) / 2}, ${(uy1 + uy2) / 2})`}
        >
          {labelStr}
        </text>
      </g>
    );
  };

  return (
    <g>
      {loads.map(load => {
        if (load.type === 'udl') {
          return <g key={load.id}>{renderUDL(load)}</g>;
        }
        return <g key={load.id}>{renderLoad(load)}</g>;
      })}
    </g>
  );
};
