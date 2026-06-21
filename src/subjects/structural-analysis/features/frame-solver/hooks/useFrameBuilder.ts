import { useState } from 'react';
import { INode } from '../types/frame';

// Canvas Coordinate Config
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;
export const X_ORIGIN = 80;
export const Y_ORIGIN = 370;
export const SCALE = 40; // 40 pixels = 1 meter

export const toPixelX = (x: number) => X_ORIGIN + x * SCALE;
export const toPixelY = (y: number) => Y_ORIGIN - y * SCALE;
export const toMeterX = (px: number) => parseFloat(((px - X_ORIGIN) / SCALE).toFixed(2));
export const toMeterY = (py: number) => parseFloat(((Y_ORIGIN - py) / SCALE).toFixed(2));

export const getSnappedPosition = (
  x: number,
  y: number,
  snapToGrid: boolean,
  gridSpacing: number,
  nodes: INode[],
  snapThresholdMeters = 0.25
) => {
  // 1. Snap to existing node first
  for (const node of nodes) {
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist < snapThresholdMeters) {
      return { x: node.x, y: node.y, snappedNode: node };
    }
  }

  // 2. Snap to grid
  if (snapToGrid) {
    const snappedX = Math.round(x / gridSpacing) * gridSpacing;
    const snappedY = Math.round(y / gridSpacing) * gridSpacing;
    return {
      x: parseFloat(snappedX.toFixed(2)),
      y: parseFloat(snappedY.toFixed(2)),
      snappedNode: null
    };
  }

  return {
    x: parseFloat(x.toFixed(2)),
    y: parseFloat(y.toFixed(2)),
    snappedNode: null
  };
};

export const useFrameBuilder = () => {
  const [drawingStartNode, setDrawingStartNode] = useState<INode | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  return {
    drawingStartNode,
    setDrawingStartNode,
    draggedNodeId,
    setDraggedNodeId,
    previewPosition,
    setPreviewPosition,
  };
};
