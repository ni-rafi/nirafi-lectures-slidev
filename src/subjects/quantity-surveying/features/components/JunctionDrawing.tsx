import React from 'react';
import { PlanDrawingCanvas } from '@/features/building-drawing/components/PlanDrawingCanvas';
import { PlanLayoutSchema } from '@/features/building-drawing/types/layoutSchema';
import { AnnotationOverlay } from '@/features/building-drawing/components/atoms/elements/AnnotationOverlay';

interface JunctionDrawingProps {
  type: 't-junction' | 'l-corner';
  showHighlight?: boolean;
  clickedJunction?: boolean;
  onJunctionClick?: () => void;
  className?: string;
}

export const JunctionDrawing: React.FC<JunctionDrawingProps> = ({
  type,
  showHighlight = false,
  onJunctionClick,
  className = '',
}) => {
  const isTJunction = type === 't-junction';

  // Construct coordinates matching the layouts using GridSystem.
  const schema: PlanLayoutSchema = isTJunction
    ? {
        grid: {
          xAxes: [
            { id: '1', offset: 20, label: '1' },
            { id: '2', offset: 110, label: '2' },
            { id: '3', offset: 200, label: '3' },
          ],
          yAxes: [
            { id: 'A', offset: 60, label: 'A' },
            { id: 'B', offset: 160, label: 'B' },
          ],
        },
        columns: [],
        beams: [
          {
            id: 'main-wall',
            startNodeId: '1-A',
            endNodeId: '3-A',
            thickness: 40,
          },
          {
            id: 'cross-wall',
            startNodeId: '2-A',
            endNodeId: '2-B',
            thickness: 40,
            highlights: showHighlight
              ? [
                  {
                    startFraction: 0.0,
                    endFraction: 0.2, // 20px overlap of 100px total span (from y=60 to y=160)
                    strokeClass: 'stroke-destructive fill-destructive',
                  },
                ]
              : [],
          },
        ],
        slabs: [],
      }
    : {
        grid: {
          xAxes: [
            { id: '1', offset: 20, label: '1' },
            { id: '2', offset: 120, label: '2' },
          ],
          yAxes: [
            { id: 'A', offset: 60, label: 'A' },
            { id: 'B', offset: 160, label: 'B' },
          ],
        },
        columns: [],
        beams: [
          {
            id: 'h-wall',
            startNodeId: '1-A',
            endNodeId: '2-A',
            thickness: 40,
          },
          {
            id: 'v-wall',
            startNodeId: '2-A',
            endNodeId: '2-B',
            thickness: 40,
          },
        ],
        slabs: [],
      };

  return (
    <div className={`relative h-64 bg-muted/40 rounded-lg border border-border/30 flex flex-col items-center justify-center p-2 ${className}`}>
      <div className="w-full h-full">
        <PlanDrawingCanvas
          schema={schema}
          activeElementId=""
          onSelectElement={() => {}}
          onChangeSchema={() => {}}
          className="w-full h-full bg-transparent border-none min-h-[220px]"
        >
          {isTJunction ? (
            <>
              {/* Text labels */}
              <text x="50" y="30" className="fill-muted-foreground font-sans font-bold" fontSize="9" textAnchor="middle">Horizontal Main Wall</text>
              <text x="145" y="125" className="fill-muted-foreground/60 font-sans font-bold" fontSize="9" textAnchor="middle">Cross Wall</text>
              
              {/* Dimension line overlay on vertical wall */}
              <AnnotationOverlay
                p1={{ x: 90, y: 160 }}
                p2={{ x: 130, y: 160 }}
                offset={15}
                text="B"
                colorClass="stroke-destructive fill-destructive"
              />
              
              {/* Flashing interactive point helper */}
              <g
                transform="translate(110, 60)"
                onClick={onJunctionClick}
                className="cursor-pointer"
              >
                <circle r="8" className="fill-primary animate-ping" opacity="0.4" />
                <circle r="4" className="fill-primary" />
              </g>
            </>
          ) : (
            <>
              {/* Surplus outer corner area (emerald) */}
              {showHighlight && (
                <rect x="120" y="40" width="20" height="20" className="fill-emerald-500 stroke-emerald-500" fillOpacity={0.25} strokeWidth="1" strokeDasharray="3,1" />
              )}
              {/* Deficit inner corner gap area (amber) */}
              {showHighlight && (
                <rect x="100" y="60" width="20" height="20" className="fill-amber-500 stroke-amber-500" fillOpacity={0.25} strokeWidth="1" strokeDasharray="3,1" />
              )}
              
              {/* Text labels */}
              <text x="70" y="30" className="fill-muted-foreground font-sans font-bold" fontSize="9" textAnchor="middle">Main Wall</text>
              <text x="155" y="120" className="fill-muted-foreground/60 font-sans font-bold" fontSize="9" textAnchor="middle">Cross Wall</text>
              
              {showHighlight && (
                <>
                  <text x="130" y="53" className="fill-emerald-600 dark:fill-emerald-400 font-bold" fontSize="8" textAnchor="middle">S (+)</text>
                  <text x="110" y="73" className="fill-amber-600 dark:fill-amber-400 font-bold" fontSize="8" textAnchor="middle">D (-)</text>
                </>
              )}
              
              {/* Dimension line overlay on wall width */}
              <AnnotationOverlay
                p1={{ x: 100, y: 160 }}
                p2={{ x: 140, y: 160 }}
                offset={15}
                text="B"
                colorClass="stroke-primary fill-primary"
              />
            </>
          )}
        </PlanDrawingCanvas>
      </div>

      {isTJunction && showHighlight && (
        <div className="absolute top-2 right-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] p-2 rounded-md font-mono animate-fadeIn z-10">
          <strong>Double-counted:</strong>
          <br />
          Deduction = 0.5 &times; B
        </div>
      )}
    </div>
  );
};
