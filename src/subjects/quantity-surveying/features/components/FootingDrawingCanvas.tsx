import React, { useContext } from 'react';
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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isParallel = containerWidth > 580;

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full gap-4'
    : 'relative border border-border/40 bg-muted/10 dark:bg-muted/5 rounded-xl p-3 flex flex-col items-center shadow-xs select-none w-full h-full justify-center gap-2 min-h-[380px]';

  // Scales or constants for SVG coordinates
  const svgW = 400;
  const svgH = 210; // Slightly shorter height for parallel stacking

  const nglY = 30;
  const bottomY = 175;

  // Visual widths and offsets
  const footingPixW = 150;
  const footingLeft = (svgW - footingPixW) / 2;
  const footingRight = footingLeft + footingPixW;

  const sandOffset = 20; // represents 3" (75mm) projection
  const trenchLeft = footingLeft - sandOffset;
  const trenchRight = footingRight + sandOffset;
  const trenchPixW = trenchRight - trenchLeft;

  // Layer heights in pixels (Cross Section)
  const sandH = 12;
  const bfsH = 12;
  const leanH = 12;
  const rccBaseH = 35;

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
      opacity: isActive ? 1 : 0.2,
      stroke: isActive ? 'var(--primary)' : 'currentColor',
      strokeWidth: isActive ? 1.5 : 0.75,
    };
  };

  return (
    <div ref={containerRef} className={`${containerClasses} ${className}`}>
      {/* Top Header */}
      <div className="flex justify-between items-center w-full px-1">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Footing Visualizer (Plan &amp; Section)
          </span>
          <span className="font-mono text-primary text-[11px] font-bold">
            {width.toFixed(2)}m × {length.toFixed(2)}m × {depth.toFixed(2)}m
          </span>
        </div>
      </div>

      <div className={`flex w-full items-stretch justify-center ${isParallel ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
        {/* 1. Cross Section View */}
        <div className={isParallel ? 'w-1/2 flex flex-col items-center' : 'w-full flex flex-col items-center'}>
          <span className="text-[8px] uppercase font-extrabold text-muted-foreground/70 tracking-widest mb-0.5 self-start pl-1">
            Elevation / Cross Section View
          </span>
          <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} className={`overflow-visible text-muted-foreground ${isParallel ? 'max-h-[200px]' : 'max-h-[155px]'}`}>
            {/* Natural Ground Level (NGL) */}
            <line
              x1="10"
              y1={nglY}
              x2={svgW - 10}
              y2={nglY}
              stroke="currentColor"
              strokeWidth="1.25"
              strokeDasharray="4,4"
            />
            <text x="15" y={nglY - 5} fill="currentColor" className="text-[8px] font-bold tracking-wider opacity-85">
              NATURAL GROUND LEVEL (NGL)
            </text>

            {/* Ground lines (hatched styling on sides) */}
            <path d={`M 10,${nglY} L 25,${nglY + 8} M 25,${nglY} L 40,${nglY + 8}`} stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
            <path d={`M ${svgW - 40},${nglY} L ${svgW - 25},${nglY + 8} M ${svgW - 25},${nglY} L ${svgW - 10},${nglY + 8}`} stroke="currentColor" strokeWidth="0.75" opacity="0.2" />

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
              <text x="200" y={(nglY + bottomY) / 2} fill="var(--primary-foreground)" className="text-[9px] font-black text-center" textAnchor="middle">
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
              rx="0.5"
            />
            <text x="200" y={sandY + 9} fill={activeHighlight === 'sand' ? 'var(--primary-foreground)' : 'currentColor'} className="text-[7.5px] font-bold" textAnchor="middle">
              Sand Cushion ({sandThickness * 1000}mm)
            </text>

            {/* 3. Brick Flat Soling (BFS) */}
            <rect
              x={footingLeft}
              y={bfsY}
              width={footingPixW}
              height={bfsH}
              {...getHighlightStyle('bfs', 'var(--chart-4)')}
              rx="0.5"
            />
            <text x="200" y={bfsY + 9} fill={activeHighlight === 'bfs' ? 'var(--primary-foreground)' : 'currentColor'} className="text-[7.5px] font-bold" textAnchor="middle">
              Brick Flat Soling (BFS)
            </text>

            {/* 4. Lean Concrete layer */}
            <rect
              x={footingLeft}
              y={leanY}
              width={footingPixW}
              height={leanH}
              {...getHighlightStyle('lean', 'var(--chart-5)')}
              rx="0.5"
            />
            <text x="200" y={leanY + 9} fill={activeHighlight === 'lean' ? 'var(--primary-foreground)' : '#ffffff'} className="text-[7.5px] font-bold" textAnchor="middle">
              Lean Concrete ({ccThickness * 1000}mm)
            </text>

            {/* 5. RCC Footing Base */}
            <rect
              x={footingLeft}
              y={rccBaseY}
              width={footingPixW}
              height={rccBaseH}
              {...getHighlightStyle('rcc', 'var(--chart-1)')}
              rx="1"
            />
            <text x="200" y={rccBaseY + 21} fill={activeHighlight === 'rcc' ? 'var(--primary-foreground)' : '#ffffff'} className="text-[8px] font-extrabold" textAnchor="middle">
              RCC Footing Base
            </text>

            {/* Column Stub */}
            <rect
              x={200 - 15}
              y={15}
              width={30}
              height={rccBaseY - 15}
              {...getHighlightStyle('rcc', 'var(--chart-1)')}
              rx="0.5"
            />

            {/* Dimension Line Indicators */}
            <line x1={trenchLeft - 10} y1={nglY} x2={trenchLeft - 10} y2={bottomY} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M ${trenchLeft - 13},${nglY} L ${trenchLeft - 7},${nglY}`} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M ${trenchLeft - 13},${bottomY} L ${trenchLeft - 7},${bottomY}`} stroke="currentColor" strokeWidth="0.75" />
            <text x={trenchLeft - 16} y={(nglY + bottomY) / 2 + 3} fill="currentColor" className="text-[8px] font-mono text-right" textAnchor="end">
              {depth.toFixed(2)}m Depth
            </text>

            <line x1={footingLeft} y1={bottomY + 12} x2={footingRight} y2={bottomY + 12} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M ${footingLeft},${bottomY + 9} L ${footingLeft},${bottomY + 15}`} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M ${footingRight},${bottomY + 9} L ${footingRight},${bottomY + 15}`} stroke="currentColor" strokeWidth="0.75" />
            <text x="200" y={bottomY + 22} fill="currentColor" className="text-[8px] font-mono" textAnchor="middle">
              {width.toFixed(2)}m Footing Base
            </text>
          </svg>
        </div>

        {/* 2. Top Plan View */}
        <div className={`flex flex-col items-center ${isParallel ? 'w-1/2 border-l border-border/10 pl-3 pt-0' : 'w-full border-t border-border/10 pt-2 pl-1'}`}>
          <span className={`text-[8px] uppercase font-extrabold text-muted-foreground/70 tracking-widest mb-0.5 self-start pl-1 ${isParallel ? 'lg:pl-3' : ''}`}>
            Top Plan View (Base Projections)
          </span>
          <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH - 30}`} className={`overflow-visible text-muted-foreground ${isParallel ? 'max-h-[175px]' : 'max-h-[125px]'}`}>
            {/* 1. Outermost Sand Cushion / Excavation Boundary */}
            <rect
              x={200 - 70}
              y={95 - 70}
              width={140}
              height={140}
              {...getHighlightStyle(
                activeHighlight === 'excavation' ? 'excavation' : 'sand',
                'var(--chart-2)'
              )}
              strokeDasharray={activeHighlight === 'excavation' ? 'none' : '3,3'}
              rx="3"
            />
            <text x="200" y="18" fill="currentColor" className="text-[7.5px] font-extrabold" textAnchor="middle">
              Excavation Bounds / Sand Bed: {(width + 0.15).toFixed(2)}m × {(length + 0.15).toFixed(2)}m
            </text>

            {/* 2. Concrete Cushion / BFS / RCC Footing Base */}
            <rect
              x={200 - 55}
              y={95 - 55}
              width={110}
              height={110}
              {...getHighlightStyle(
                activeHighlight === 'bfs' ? 'bfs' : activeHighlight === 'lean' ? 'lean' : 'rcc',
                'var(--chart-1)'
              )}
              rx="1.5"
            />
            <text x="200" y="73" fill="#ffffff" className="text-[7.5px] font-extrabold" textAnchor="middle">
              Footing Base: {width.toFixed(2)}m × {length.toFixed(2)}m
            </text>

            {/* 3. Column Stub */}
            <rect
              x={200 - 12}
              y={95 - 12}
              width={24}
              height={24}
              {...getHighlightStyle('rcc', 'var(--chart-1)')}
              rx="0.5"
            />
            <text x="200" y="98" fill="#ffffff" className="text-[7px] font-black" textAnchor="middle">
              Col
            </text>

            {/* Dimension Line Indicators */}
            <line x1={200 - 70} y1={172} x2={200 + 70} y2={172} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M ${200 - 70},169 L ${200 - 70},175`} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M ${200 + 70},169 L ${200 + 70},175`} stroke="currentColor" strokeWidth="0.75" />
            <text x="200" y="181" fill="currentColor" className="text-[8px] font-mono" textAnchor="middle">
              {(width + 0.15).toFixed(2)}m Trench Width
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FootingDrawingCanvas;
