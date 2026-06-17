import React, { useRef } from 'react';
import { useDrawingBoard } from '../../hooks/useDrawingBoard';
import { SvgElementsRenderer } from './SvgElementsRenderer';

interface DrawingBoardProps {
  isActive: boolean;
  color: string;
  brushWidth: number;
  activeTool: 'select' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle';
  onActiveToolChange: (tool: 'select' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle') => void;
  lectureId: string;
  slideNo: number;
  clearTrigger: number;
}

const WIDTH = 980;
const HEIGHT = 551.25;

export const DrawingBoard: React.FC<DrawingBoardProps> = (props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const {
    elements,
    currentElement,
    selectedId,
    setSelectedId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleElementDown,
  } = useDrawingBoard({
    ...props,
    svgRef,
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      onPointerDown={(e) => {
        if (props.activeTool === 'select') {
          setSelectedId(null);
        } else {
          handlePointerDown(e);
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 25,
        width: '100%',
        height: '100%',
        pointerEvents: props.isActive ? 'auto' : 'none',
        touchAction: 'none',
      }}
      className="overflow-visible"
    >
      <SvgElementsRenderer
        elements={elements}
        currentElement={currentElement}
        activeTool={props.activeTool}
        selectedId={selectedId}
        onElementDown={handleElementDown}
      />
    </svg>
  );
};

export default DrawingBoard;
