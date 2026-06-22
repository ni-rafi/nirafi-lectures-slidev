import React, { useContext, useState } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface FootingDrawingCanvasProps {
  width: number;       // footing width in meters (e.g. 1.5)
  length: number;      // footing length in meters (e.g. 1.5)
  depth: number;       // excavation depth in meters (e.g. 1.8)
  ccThickness: number; // concrete cushion thickness in meters (e.g. 0.075)
  sandThickness?: number; // sand cushion thickness in meters (e.g. 0.075)
  activeHighlight?: 'excavation' | 'sand' | 'bfs' | 'lean' | 'rcc' | 'none';
  className?: string;
}

export const FootingDrawingCanvas: React.FC<FootingDrawingCanvasProps> = ({
  width,
  length,
  depth,
  ccThickness,
  sandThickness = 0.075,
  activeHighlight = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';
  const [viewMode, setViewMode] = useState<'section' | 'plan'>('section');

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/40 bg-muted/10 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-xs select-none w-full h-full justify-center min-h-[300px]';

  // Scales or constants for SVG coordinates
  const svgW = 400;
  const svgH = 280;

  const nglY = 50;
  const bottomY = 240;

  // Visual widths and offsets
  const footingPixW = 150;
  const footingLeft = (svgW - footingPixW) / 2;
  const footingRight = footingLeft + footingPixW;

  const sandOffset = 20; // represents 3" (75mm) projection
  const trenchLeft = footingLeft - sandOffset;
  const trenchRight = footingRight + sandOffset;
  const trenchPixW = trenchRight - trenchLeft;

  // Layer heights in pixels (Cross Section)
  const sandH = 15;
  const bfsH = 15;
  const leanH = 15;
  const rccBaseH = 45;

  const sandY = bottomY - sandH;
  const bfsY = sandY - bfsH;
  const leanY = bfsY - leanH;
  const rccBaseY = leanY - rccBaseH;

  // Helper to determine opacity/stroke based on activeHighlight
  const getHighlightStyle = (layer: typeof activeHighlight, defaultFill: string) => {
    if (activeHighlight === 'none') {
      return { fill: defaultFill, opacity: 1, stroke: 'currentColor', strokeWidth: 1 };
    }
    const isActive = activeHighlight === layer;
    return {
      fill: isActive ? 'var(--primary)' : defaultFill,
      opacity: isActive ? 1 : 0.25,
      stroke: isActive ? 'var(--primary)' : 'currentColor',
      strokeWidth: isActive ? 2 : 0.75,
    };
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Header and View Selector */}
      <div className="flex justify-between items-center mb-3 w-full px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Footing Visualizer
          </span>
          <span className="font-mono text-primary text-[11px] font-bold">
            {width.toFixed(2)}m × {length.toFixed(2)}m × {depth.toFixed(2)}m
          </span>
        </div>
        <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/50">
          <button
            onClick={() => setViewMode('section')}
            className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md transition-all ${viewMode === 'section'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Cross Section
          </button>
          <button
            onClick={() => setViewMode('plan')}
            className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md transition-all ${viewMode === 'plan'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Top Plan
          </button>
        </div>
      </div>

      {viewMode === 'section' ? (
        <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible text-muted-foreground max-h-[240px]">
          {/* Natural Ground Level (NGL) */}
          <line
            x1="10"
            y1={nglY}
            x2={svgW - 10}
            y2={nglY}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text x="15" y={nglY - 6} fill="currentColor" className="text-[9px] font-bold tracking-wider">
            NATURAL GROUND LEVEL (NGL)
          </text>

          {/* Ground lines (hatched styling on sides) */}
          <path d={`M 10,${nglY} L 30,${nglY + 10} M 30,${nglY} L 50,${nglY + 10}`} stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
          <path d={`M ${svgW - 50},${nglY} L ${svgW - 30},${nglY + 10} M ${svgW - 30},${nglY} L ${svgW - 10},${nglY + 10}`} stroke="currentColor" strokeWidth="0.75" opacity="0.3" />

          {/* 1. Earthwork Excavation Trench */}
          <rect
            x={trenchLeft}
            y={nglY}
            width={trenchPixW}
            height={bottomY - nglY}
            {...getHighlightStyle('excavation', 'transparent')}
            strokeDasharray={activeHighlight === 'excavation' ? 'none' : '3,3'}
          />
          {activeHighlight === 'excavation' && (
            <text x="200" y={(nglY + bottomY) / 2} fill="var(--primary-foreground)" className="text-[10px] font-black text-center" textAnchor="middle">
              Excavation Volume: {(width + 0.15).toFixed(2)}m × {(length + 0.15).toFixed(2)}m × {depth.toFixed(2)}m
            </text>
          )}

          {/* 2. Sand Cushion Layer (Bottom-most) */}
          <rect
            x={trenchLeft}
            y={sandY}
            width={trenchPixW}
            height={sandH}
            {...getHighlightStyle('sand', 'var(--chart-2)')}
            rx="1"
          />
          <text x="200" y={sandY + 11} fill={activeHighlight === 'sand' ? 'var(--primary-foreground)' : 'currentColor'} className="text-[8px] font-bold" textAnchor="middle">
            Sand Cushion ({sandThickness * 1000}mm)
          </text>

          {/* 3. Brick Flat Soling (BFS) */}
          <rect
            x={footingLeft}
            y={bfsY}
            width={footingPixW}
            height={bfsH}
            {...getHighlightStyle('bfs', 'var(--chart-4)')}
            rx="1"
          />
          <text x="200" y={bfsY + 11} fill={activeHighlight === 'bfs' ? 'var(--primary-foreground)' : 'currentColor'} className="text-[8px] font-bold" textAnchor="middle">
            Brick Flat Soling (BFS)
          </text>

          {/* 4. Lean Concrete layer */}
          <rect
            x={footingLeft}
            y={leanY}
            width={footingPixW}
            height={leanH}
            {...getHighlightStyle('lean', 'var(--chart-5)')}
            rx="1"
          />
          <text x="200" y={leanY + 11} fill={activeHighlight === 'lean' ? 'var(--primary-foreground)' : 'currentColor'} className="text-[8px] font-bold" textAnchor="middle">
            Lean Concrete ({ccThickness * 1000}mm)
          </text>

          {/* 5. RCC Footing Base */}
          <rect
            x={footingLeft}
            y={rccBaseY}
            width={footingPixW}
            height={rccBaseH}
            {...getHighlightStyle('rcc', 'var(--chart-1)')}
            rx="2"
          />
          <text x="200" y={rccBaseY + 26} fill={activeHighlight === 'rcc' ? 'var(--primary-foreground)' : '#ffffff'} className="text-[9px] font-extrabold" textAnchor="middle">
            RCC Footing Base (400mm)
          </text>

          {/* Column Stub */}
          <rect
            x={200 - 20}
            y={30}
            width={40}
            height={rccBaseY - 30}
            {...getHighlightStyle('rcc', 'var(--chart-1)')}
            rx="1"
          />
          <text x="200" y="42" fill={activeHighlight === 'rcc' ? 'var(--primary-foreground)' : '#ffffff'} className="text-[8px] font-bold" textAnchor="middle">
            Column
          </text>

          {/* Dimension Line Indicators */}
          <line x1={trenchLeft - 15} y1={nglY} x2={trenchLeft - 15} y2={bottomY} stroke="currentColor" strokeWidth="1" />
          <path d={`M ${trenchLeft - 18},${nglY} L ${trenchLeft - 12},${nglY}`} stroke="currentColor" strokeWidth="1" />
          <path d={`M ${trenchLeft - 18},${bottomY} L ${trenchLeft - 12},${bottomY}`} stroke="currentColor" strokeWidth="1" />
          <text x={trenchLeft - 22} y={(nglY + bottomY) / 2 + 3} fill="currentColor" className="text-[9px] font-mono text-right" textAnchor="end">
            {depth.toFixed(2)}m Depth
          </text>

          <line x1={footingLeft} y1={bottomY + 20} x2={footingRight} y2={bottomY + 20} stroke="currentColor" strokeWidth="1" />
          <path d={`M ${footingLeft},${bottomY + 17} L ${footingLeft},${bottomY + 23}`} stroke="currentColor" strokeWidth="1" />
          <path d={`M ${footingRight},${bottomY + 17} L ${footingRight},${bottomY + 23}`} stroke="currentColor" strokeWidth="1" />
          <text x="200" y={bottomY + 32} fill="currentColor" className="text-[9px] font-mono" textAnchor="middle">
            {width.toFixed(2)}m Footing Width
          </text>
        </svg>
      ) : (
        <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible text-muted-foreground max-h-[240px]">
          {/* Plan View Concentric Rectangles */}

          {/* 1. Outermost Sand Cushion / Excavation Boundary */}
          <rect
            x={200 - 90}
            y={140 - 90}
            width={180}
            height={180}
            {...getHighlightStyle(
              activeHighlight === 'excavation' ? 'excavation' : 'sand',
              'var(--chart-2)'
            )}
            strokeDasharray={activeHighlight === 'excavation' ? 'none' : '3,3'}
            rx="4"
          />
          <text x="200" y="62" fill="currentColor" className="text-[8px] font-extrabold" textAnchor="middle">
            Excavation Bounds / Sand Bed: {(width + 0.15).toFixed(2)}m × {(length + 0.15).toFixed(2)}m
          </text>

          {/* 2. Concrete Cushion / BFS / RCC Footing Base */}
          <rect
            x={200 - 75}
            y={140 - 75}
            width={150}
            height={150}
            {...getHighlightStyle(
              activeHighlight === 'bfs' ? 'bfs' : activeHighlight === 'lean' ? 'lean' : 'rcc',
              'var(--chart-1)'
            )}
            rx="2"
          />
          <text x="200" y="112" fill="#ffffff" className="text-[8px] font-extrabold" textAnchor="middle">
            Footing Base: {width.toFixed(2)}m × {length.toFixed(2)}m
          </text>

          {/* 3. Column Stub */}
          <rect
            x={200 - 15}
            y={140 - 15}
            width={30}
            height={30}
            {...getHighlightStyle('rcc', 'var(--chart-1)')}
            rx="1"
          />
          <text x="200" y="143" fill="#ffffff" className="text-[8px] font-black" textAnchor="middle">
            Col
          </text>

          {/* Dimension Line Indicators */}
          <line x1={200 - 90} y1={245} x2={200 + 90} y2={245} stroke="currentColor" strokeWidth="1" />
          <path d={`M ${200 - 90},242 L ${200 - 90},248`} stroke="currentColor" strokeWidth="1" />
          <path d={`M ${200 + 90},242 L ${200 + 90},248`} stroke="currentColor" strokeWidth="1" />
          <text x="200" y="257" fill="currentColor" className="text-[9px] font-mono" textAnchor="middle">
            {(width + 0.15).toFixed(2)}m Trench Width
          </text>
        </svg>
      )}
    </div>
  );
};

export default FootingDrawingCanvas;
