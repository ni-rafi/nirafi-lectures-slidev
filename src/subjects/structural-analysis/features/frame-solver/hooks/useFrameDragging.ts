import React from 'react';
import { useFrameWorkspace } from '../context/FrameWorkspaceContext';
import { INode } from '../types/frame';
import {
  toMeterX,
  toMeterY,
  getSnappedPosition,
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from './useFrameBuilder';

interface UseFrameDraggingProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  drawingStartNode: INode | null;
  setDrawingStartNode: (node: INode | null) => void;
  draggedNodeId: string | null;
  setDraggedNodeId: (id: string | null) => void;
  setPreviewPosition: (pos: { x: number; y: number } | null) => void;
}

export const useFrameDragging = ({
  svgRef,
  drawingStartNode,
  setDrawingStartNode,
  draggedNodeId,
  setDraggedNodeId,
  setPreviewPosition
}: UseFrameDraggingProps) => {
  const {
    nodes,
    activeMode,
    snapToGrid,
    gridSpacing,
    selectedSupportType,
    selectedLoadType,
    selectedLoadDirection,
    addNode,
    addMember,
    addSupport,
    addLoad,
    setNodes,
    setSelectedElementId
  } = useFrameWorkspace();

  const getMouseCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { px: 0, py: 0, mx: 0, my: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const py = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
    const mx = toMeterX(px);
    const my = toMeterY(py);
    return { px, py, mx, my };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only handle left clicks
    if (e.button !== 0) return;

    const { mx, my } = getMouseCoords(e);
    const snapResult = getSnappedPosition(mx, my, snapToGrid, gridSpacing, nodes);

    if (activeMode === 'draw-member') {
      e.stopPropagation();
      let startNode = snapResult.snappedNode;
      if (!startNode) {
        startNode = addNode(snapResult.x, snapResult.y);
      }
      setDrawingStartNode(startNode);
      setPreviewPosition({ x: startNode.x, y: startNode.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const { mx, my } = getMouseCoords(e);
    const snapResult = getSnappedPosition(mx, my, snapToGrid, gridSpacing, nodes);

    if (activeMode === 'draw-member' && drawingStartNode) {
      setPreviewPosition({ x: snapResult.x, y: snapResult.y });
    } else if (activeMode === 'select' && draggedNodeId) {
      setNodes(prev =>
        prev.map(n =>
          n.id === draggedNodeId
            ? { ...n, x: snapResult.x, y: snapResult.y }
            : n
        )
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    const { mx, my } = getMouseCoords(e);
    const snapResult = getSnappedPosition(mx, my, snapToGrid, gridSpacing, nodes);

    if (activeMode === 'draw-member' && drawingStartNode) {
      e.stopPropagation();
      let endNode = snapResult.snappedNode;
      if (!endNode) {
        endNode = addNode(snapResult.x, snapResult.y);
      }
      if (drawingStartNode.id !== endNode.id) {
        addMember(drawingStartNode.id, endNode.id);
      }
      setDrawingStartNode(null);
      setPreviewPosition(null);
    }

    if (draggedNodeId) {
      setDraggedNodeId(null);
    }
  };

  const handleMouseLeave = () => {
    if (drawingStartNode) {
      setDrawingStartNode(null);
      setPreviewPosition(null);
    }
    if (draggedNodeId) {
      setDraggedNodeId(null);
    }
  };

  // Node event handlers to wire up drag and click
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMode === 'select') {
      setDraggedNodeId(nodeId);
      setSelectedElementId(nodeId);
    } else if (activeMode === 'add-support') {
      addSupport(nodeId, selectedSupportType);
      setSelectedElementId(`support_${nodeId}`); // focus support
    } else if (activeMode === 'add-load' && selectedLoadType !== 'udl') {
      addLoad({
        type: selectedLoadType,
        magnitude: selectedLoadType === 'point' ? 10 : 5, // default defaults
        direction: selectedLoadDirection,
        attachedTo: 'node',
        nodeId
      });
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleNodeMouseDown,
    getMouseCoords
  };
};
