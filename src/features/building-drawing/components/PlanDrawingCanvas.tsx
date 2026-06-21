import React, { useRef, useState } from 'react';
import { PlanLayoutSchema, PlanColumn } from '../types/layoutSchema';
import { ColumnPlanPrimitive } from './atoms/plan/ColumnPlanPrimitive';
import { BeamPlanPrimitive } from './atoms/plan/BeamPlanPrimitive';
import { WallOpeningPrimitive } from './atoms/plan/WallOpeningPrimitive';
import { PlanGridlines } from './atoms/plan/PlanGridlines';
import { AnnotationOverlay } from './atoms/elements/AnnotationOverlay';
import { resolveGridIntersection } from '../engines/gridCoordinateEngine';
import { calculateColumnsGeometry, calculateBeamsGeometry, findNearestGridIntersection } from '../engines/planLayoutEngine';
import { calculateDynamicViewBox } from '../engines/viewportScaleEngine';
import { Point2D } from '../types/geometry';

interface PlanDrawingCanvasProps {
  schema: PlanLayoutSchema;
  activeElementId: string;
  onSelectElement: (id: string) => void;
  onChangeSchema: (schema: PlanLayoutSchema) => void;
}

export const PlanDrawingCanvas: React.FC<PlanDrawingCanvasProps> = ({
  schema,
  activeElementId,
  onSelectElement,
  onChangeSchema,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragState, setDragState] = useState<{
    columnId: string;
    startX: number;
    startY: number;
    initialOffset: { x: number; y: number };
  } | null>(null);

  // 1. Resolve calculated geometries from engines
  const calculatedColumns = calculateColumnsGeometry(schema.columns, schema.grid);
  const calculatedBeams = calculateBeamsGeometry(schema.beams, calculatedColumns, schema.grid);

  // 2. Viewbox auto scaling points
  const gridIntersections: Point2D[] = [];
  schema.grid.xAxes.forEach(x => {
    schema.grid.yAxes.forEach(y => {
      gridIntersections.push({ x: x.offset, y: y.offset });
    });
  });
  
  const allPoints = [
    ...gridIntersections,
    ...calculatedColumns.map(c => c.topLeft),
    ...calculatedColumns.map(c => ({ x: c.topLeft.x + c.width, y: c.topLeft.y + c.height })),
  ];
  const { viewBox } = calculateDynamicViewBox(allPoints, 60);

  // 3. SVG coordinates converter
  const getSVGCoords = (e: React.MouseEvent): Point2D => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const transformed = point.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const handleMouseDown = (e: React.MouseEvent, colId: string) => {
    const coords = getSVGCoords(e);
    const col = schema.columns.find(c => c.id === colId);
    if (!col) return;
    setDragState({
      columnId: colId,
      startX: coords.x,
      startY: coords.y,
      initialOffset: { ...col.alignmentOffset },
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const coords = getSVGCoords(e);
    const dx = coords.x - dragState.startX;
    const dy = coords.y - dragState.startY;

    const updatedColumns = schema.columns.map((col): PlanColumn => {
      if (col.id !== dragState.columnId) return col;

      if (e.shiftKey || e.altKey) {
        return {
          ...col,
          alignmentOffset: {
            x: Math.round(dragState.initialOffset.x + dx),
            y: Math.round(dragState.initialOffset.y + dy),
          },
        };
      } else {
        const center = resolveGridIntersection(col.gridPlacement.gridXId, col.gridPlacement.gridYId, schema.grid);
        const targetX = center.x + col.alignmentOffset.x + dx;
        const targetY = center.y + col.alignmentOffset.y + dy;

        const { gridXId, gridYId, distance } = findNearestGridIntersection(targetX, targetY, schema.grid);
        if (distance < 35) {
          return { ...col, gridPlacement: { gridXId, gridYId }, alignmentOffset: { x: 0, y: 0 } };
        } else {
          return {
            ...col,
            alignmentOffset: {
              x: Math.round(dragState.initialOffset.x + dx),
              y: Math.round(dragState.initialOffset.y + dy),
            },
          };
        }
      }
    });

    onChangeSchema({ ...schema, columns: updatedColumns });
  };

  const handleMouseUp = () => setDragState(null);

  return (
    <div className="relative w-full h-full select-none" onMouseLeave={handleMouseUp}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full bg-background border border-border/40 rounded-xl shadow-inner min-h-[360px]"
      >
        <PlanGridlines grid={schema.grid} />

        {calculatedBeams.map(beam => {
          const spec = schema.beams.find(b => b.id === beam.id);
          return (
            <BeamPlanPrimitive
              key={beam.id}
              geo={beam}
              isActive={activeElementId === beam.id}
              onSelect={onSelectElement}
              highlights={spec?.highlights}
              strokeColor={spec?.strokeColor}
            />
          );
        })}

        {schema.beams.map(beam => {
          const geom = calculatedBeams.find(b => b.id === beam.id);
          if (!geom || !beam.openings) return null;
          return beam.openings.map(op => (
            <WallOpeningPrimitive
              key={op.id}
              beamStart={geom.start}
              beamEnd={geom.end}
              relativeOffset={op.relativeOffset}
              clearanceWidth={op.clearanceWidth}
              type={op.type}
              thickness={geom.thickness}
            />
          ));
        })}

        {calculatedColumns.map(col => {
          const spec = schema.columns.find(c => c.id === col.id);
          return (
            <ColumnPlanPrimitive
              key={col.id}
              geo={col}
              isActive={activeElementId === col.id}
              onSelect={onSelectElement}
              onMouseDown={handleMouseDown}
              fillColor={spec?.fillColor}
              strokeColor={spec?.strokeColor}
            />
          );
        })}

        {activeElementId && (
          <>
            {calculatedColumns.find(c => c.id === activeElementId) && (() => {
              const col = calculatedColumns.find(c => c.id === activeElementId)!;
              return (
                <g>
                  <AnnotationOverlay p1={col.topLeft} p2={{ x: col.topLeft.x + col.width, y: col.topLeft.y }} offset={-20} text={`w: ${col.width}`} />
                  <AnnotationOverlay p1={{ x: col.topLeft.x + col.width, y: col.topLeft.y }} p2={{ x: col.topLeft.x + col.width, y: col.topLeft.y + col.height }} offset={20} text={`d: ${col.height}`} />
                </g>
              );
            })()}
            {calculatedBeams.find(b => b.id === activeElementId) && (() => {
              const beam = calculatedBeams.find(b => b.id === activeElementId)!;
              const span = Math.round(Math.sqrt((beam.end.x - beam.start.x) ** 2 + (beam.end.y - beam.start.y) ** 2));
              return <AnnotationOverlay p1={beam.start} p2={beam.end} offset={25} text={`Span: ${span}`} />;
            })()}
          </>
        )}
      </svg>
    </div>
  );
};
