import React, { useContext, useState, useEffect } from 'react';
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { useClickStepsContext } from '@/features/presentation/context/ClickStepsContext';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { ParameterSlider, LatexFormula, SlideParagraph, SlideBullet, ClickReveal, ClickHighlight } from '@/features/presentation/components/elements';

export const CurveCalculusSandbox: React.FC = () => {
  const clickContext = useClickStepsContext();
  const { currentClick } = clickContext;
  const presentation = useContext(PresentationContext);
  const viewMode = presentation?.viewMode || 'present';

  const isScrollOrBlog = viewMode === 'scroll' || viewMode === 'blog';

  // Override states for manual presenter interaction
  const [userX, setUserX] = useState<number | null>(null);
  const [userTab, setUserTab] = useState<'slope' | 'area' | null>(null);

  // Reset overrides when presenter advances click steps
  useEffect(() => {
    setUserX(null);
    setUserTab(null);
  }, [currentClick]);

  // Synchronize parameter x for sandbox mode
  const [sandboxX, setSandboxX] = useUrlSyncedState<number>('curve_x_val', 8.0);
  const [activeTab, setActiveTab] = useUrlSyncedState<'slope' | 'area'>('curve_tab_mode', 'slope');

  // Math equations for f(x) = -0.05*x^2 + 0.8*x + 1.0
  const f = (x: number) => -0.05 * x * x + 0.8 * x + 1.0;
  const df = (x: number) => -0.1 * x + 0.8;
  const integral = (x: number) => (-0.05 / 3) * Math.pow(x, 3) + 0.4 * x * x + x;

  // Determine slide stage based on currentClick in presentation mode
  // Click 0: Slope tangent at x = 8.0 (flatter, peak)
  // Click 1: Slope tangent at x = 3.0 (steeper, rising)
  // Click 2: Shading area at x = 5.0 (rising)
  // Click 3: Shading area at x = 10.0 (fully integrated)
  // Click 4+: Sandbox mode (free play)
  const isSandbox = isScrollOrBlog || currentClick >= 4;
  
  let currentX = 8.0;
  let showSlope = true;
  let showArea = false;
  let showShading = false;
  let stageTitle = "Differentiation (Tangents & Slopes)";
  let stageDesc = "Let's inspect how slopes and areas behave along a curve geometrically.";

  if (!isSandbox) {
    if (currentClick === 0) {
      currentX = userX !== null ? userX : 8.0;
      showSlope = userTab !== null ? userTab === 'slope' : true;
      showArea = userTab !== null ? userTab === 'area' : false;
      showShading = userTab !== null ? userTab === 'area' : false;
      stageTitle = "Differentiation: Tangent Slope at Peak (x = 8.0)";
      stageDesc = "The derivative represents the slope of the tangent line. Near the peak (x = 8.0), the curve flattens out, meaning the slope dy/dx approaches zero.";
    } else if (currentClick === 1) {
      currentX = userX !== null ? userX : 3.0;
      showSlope = userTab !== null ? userTab === 'slope' : true;
      showArea = userTab !== null ? userTab === 'area' : false;
      showShading = userTab !== null ? userTab === 'area' : false;
      stageTitle = "Differentiation: Changing Slope (x = 3.0)";
      stageDesc = "Moving left along the curve (x = 3.0), the slope is steeper. This confirms that the derivative dy/dx changes continuously along a non-linear curve.";
    } else if (currentClick === 2) {
      currentX = userX !== null ? userX : 5.0;
      showSlope = userTab !== null ? userTab === 'slope' : false;
      showArea = userTab !== null ? userTab === 'area' : true;
      showShading = userTab !== null ? userTab === 'area' : true;
      stageTitle = "Integration: Defining Area Under the Curve";
      stageDesc = "Integrating a function represents accumulating the physical area bounded between the function's curve and the baseline (x-axis).";
    } else if (currentClick === 3) {
      currentX = userX !== null ? userX : 10.0;
      showSlope = userTab !== null ? userTab === 'slope' : false;
      showArea = userTab !== null ? userTab === 'area' : true;
      showShading = userTab !== null ? userTab === 'area' : true;
      stageTitle = "Integration: Definite Integral Shading";
      stageDesc = "Shading the entire bounded region. The definite integral calculates this net area directly between the limits.";
    }
  } else {
    currentX = userX !== null ? userX : sandboxX;
    const currentTab = userTab !== null ? userTab : activeTab;
    showSlope = currentTab === 'slope';
    showArea = currentTab === 'area';
    showShading = currentTab === 'area';
    stageTitle = currentTab === 'slope' ? "Sandbox Mode: Slope Explorer" : "Sandbox Mode: Area Accumulator";
    stageDesc = "Use the slider to drag coordinate X and observe the derivative and integral values update in real time.";
  }

  const yVal = f(currentX);
  const slopeVal = df(currentX);
  const areaVal = integral(currentX);

  // SVG dimensions mapping
  const getSvgX = (x: number) => 40 + x * 28; // x in [0, 10] -> [40, 320]
  const getSvgY = (y: number) => 150 - y * 28; // y in [0, 5] -> [10, 150]

  // Generate curve path points
  const stepsCount = 50;
  const curvePoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= stepsCount; i++) {
    const x = (i / stepsCount) * 10;
    curvePoints.push({ x, y: f(x) });
  }
  const curvePathD = `M ${getSvgX(curvePoints[0]!.x)} ${getSvgY(curvePoints[0]!.y)} ` + 
    curvePoints.map(pt => `L ${getSvgX(pt.x)} ${getSvgY(pt.y)}`).join(' ');

  // Generate area shaded path points
  const areaPoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= stepsCount; i++) {
    const x = (i / stepsCount) * currentX;
    areaPoints.push({ x, y: f(x) });
  }
  const areaPathD = areaPoints.length > 0 
    ? `M ${getSvgX(0)} ${getSvgY(0)} ` + 
      areaPoints.map(pt => `L ${getSvgX(pt.x)} ${getSvgY(pt.y)}`).join(' ') + 
      ` L ${getSvgX(currentX)} ${getSvgY(0)} Z`
    : '';

  // Calculate tangent line points (length +/- 1.5 in x-direction)
  const tx1 = Math.max(0, currentX - 2.0);
  const ty1 = yVal + slopeVal * (tx1 - currentX);
  const tx2 = Math.min(10, currentX + 2.0);
  const ty2 = yVal + slopeVal * (tx2 - currentX);

  const handleSliderChange = (val: number) => {
    setUserX(val);
    if (isSandbox) {
      setSandboxX(val);
    }
  };

  const handleTabToggle = (mode: 'slope' | 'area') => {
    setUserTab(mode);
    if (isSandbox) {
      setActiveTab(mode);
    }
  };

  return (
    <TwoColumnLayout
      title={stageTitle}
      leftWidth="52%"
      leftContent={
        <div className="flex flex-col items-center justify-between h-full space-y-4">
          {/* Registry clicks to control presentation sequence */}
          {!isScrollOrBlog && (
            <>
              <ClickReveal at={1} className="hidden">{' '}</ClickReveal>
              <ClickReveal at={2} className="hidden">{' '}</ClickReveal>
              <ClickReveal at={3} className="hidden">{' '}</ClickReveal>
              <ClickReveal at={4} className="hidden">{' '}</ClickReveal>
            </>
          )}
          <div className="w-full relative h-[210px] bg-muted/10 border border-border/40 rounded-xl flex items-center justify-center p-3">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 360 180">
              {/* Axes baseline */}
              <line x1="30" y1="150" x2="340" y2="150" className="stroke-muted-foreground/45" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="160" className="stroke-muted-foreground/45" strokeWidth="1.5" />

              {/* Gridlines */}
              {[2, 4, 6, 8, 10].map(val => (
                <g key={val}>
                  <line x1={getSvgX(val)} y1="150" x2={getSvgX(val)} y2="154" className="stroke-muted-foreground/30" strokeWidth="1" />
                  <text x={getSvgX(val)} y="165" textAnchor="middle" className="text-[8px] font-mono fill-muted-foreground">{val}</text>
                </g>
              ))}
              {[1, 2, 3, 4, 5].map(val => (
                <g key={val}>
                  <line x1="36" y1={getSvgY(val)} x2="40" y2={getSvgY(val)} className="stroke-muted-foreground/30" strokeWidth="1" />
                  <text x="28" y={getSvgY(val) + 3} textAnchor="end" className="text-[8px] font-mono fill-muted-foreground">{val}</text>
                </g>
              ))}

              {/* Shaded Area under the curve */}
              {showShading && areaPathD && (
                <path d={areaPathD} className="fill-orange-500/25 stroke-orange-500/10 transition-all duration-300" />
              )}

              {/* Plotted Curve */}
              <path d={curvePathD} className="fill-none stroke-blue-500" strokeWidth="2.5" />

              {/* Definite Integral Bounds labels */}
              {showArea && (
                <g className="animate-in fade-in duration-300">
                  <line x1={getSvgX(0)} y1={getSvgY(0)} x2={getSvgX(0)} y2={getSvgY(f(0))} className="stroke-orange-500/60" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1={getSvgX(currentX)} y1={getSvgY(0)} x2={getSvgX(currentX)} y2={getSvgY(yVal)} className="stroke-orange-500/60" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={getSvgX(currentX / 2)} y={getSvgY(0) - 10} textAnchor="middle" className="text-[12px] font-bold fill-orange-400 animate-pulse">Area</text>
                </g>
              )}

              {/* Tangent line (Slope) */}
              {showSlope && (
                <line 
                  x1={getSvgX(tx1)} 
                  y1={getSvgY(ty1)} 
                  x2={getSvgX(tx2)} 
                  y2={getSvgY(ty2)} 
                  className="stroke-red-500 transition-all duration-200" 
                  strokeWidth="2" 
                />
              )}

              {/* Coordinate Point */}
              <circle 
                cx={getSvgX(currentX)} 
                cy={getSvgY(yVal)} 
                r="5" 
                className="fill-red-500 stroke-white dark:stroke-slate-950 transition-all duration-200" 
                strokeWidth="1.5" 
              />

              {/* Hovering coordinate readout */}
              <g transform={`translate(${getSvgX(currentX)}, ${getSvgY(yVal) - 12})`} className="transition-all duration-200">
                <rect x="-35" y="-12" width="70" height="15" rx="3" className="fill-slate-950/80 stroke-slate-800" strokeWidth="0.5" />
                <text x="0" y="-2" textAnchor="middle" className="text-[7px] font-mono fill-white font-bold">
                  ({currentX.toFixed(1)}, {yVal.toFixed(2)})
                </text>
              </g>
            </svg>
          </div>

          <div className="w-full p-2.5 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-xl text-[10.5px] leading-normal text-left">
            <span className="font-bold text-indigo-500 block mb-0.5">Calculus Theorem:</span>
            <div className="space-y-1">
              <SlideBullet icon={<span className="text-red-500 font-bold">Slope:</span>}>
                <span>
                  {"The derivative \\(f'(x) = \\frac{dy}{dx}\\) represents the tangent slope. At the peak, \\(f'(x) = 0\\)."}
                </span>
              </SlideBullet>
              <SlideBullet icon={<span className="text-orange-500 font-bold">Area:</span>}>
                <span>
                  {"The definite integral \\(F(x) = \\int_0^x f(t) \\, dt\\) is the cumulative area under the curve."}
                </span>
              </SlideBullet>
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <SlideParagraph variant="plain" className="text-xs text-muted-foreground leading-normal text-left">
              {stageDesc}
            </SlideParagraph>

            <div className="bg-muted/30 border border-border/40 rounded-xl p-3 space-y-2 text-left">
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Equations</div>
              <div className="flex flex-col gap-1.5 font-mono text-xs text-foreground bg-background/40 p-2.5 rounded-lg border border-border/30">
                <div className="flex justify-between items-center border-b border-border/10 pb-1">
                  <span className="text-muted-foreground text-[10px]">Function:</span>
                  <LatexFormula math="f(x) = -0.05x^2 + 0.8x + 1" />
                </div>
                {showSlope && (
                  <div className="flex justify-between items-center border-b border-border/10 py-1 text-red-500">
                    <span className="text-muted-foreground text-[10px]">Derivative (Slope):</span>
                    <LatexFormula math="f'(x) = -0.1x + 0.8" />
                  </div>
                )}
                {showArea && (
                  <div className="flex justify-between items-center pt-1 text-orange-500">
                    <span className="text-muted-foreground text-[10px]">Integral (Area):</span>
                    <LatexFormula math="\int_0^x f(t) \, dt = -\frac{0.05}{3}x^3 + 0.4x^2 + x" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-left">
            {/* Interactive controls (always visible) */}
            <div className="bg-muted/40 border border-border/30 rounded-xl p-3 space-y-3 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                <span className="text-[9.5px] uppercase font-bold text-muted-foreground tracking-wider">Interactive Controls</span>
                <div className="flex gap-1 bg-background/50 p-0.5 rounded-md border border-border/30">
                  <button 
                    onClick={() => handleTabToggle('slope')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${showSlope ? 'bg-red-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Slope
                  </button>
                  <button 
                    onClick={() => handleTabToggle('area')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${showArea ? 'bg-orange-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Area
                  </button>
                </div>
              </div>

              <ParameterSlider
                label="Coordinate X Position"
                min={0.0}
                max={10.0}
                step={0.1}
                value={currentX}
                onChange={handleSliderChange}
                unit=""
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
              <div className={`p-2.5 rounded-xl border transition-all ${showSlope ? 'bg-red-500/[0.04] border-red-500/35' : 'bg-muted/10 border-border/20 opacity-35'}`}>
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider block">Slope (dy/dx)</span>
                <div className="text-lg font-black font-mono text-foreground mt-0.5">
                  <ClickHighlight variant="paint" at={isSandbox ? 0 : currentClick}>
                    {slopeVal.toFixed(3)}
                  </ClickHighlight>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${showArea ? 'bg-orange-500/[0.04] border-orange-500/35' : 'bg-muted/10 border-border/20 opacity-35'}`}>
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider block">Shaded Area</span>
                <div className="text-lg font-black font-mono text-foreground mt-0.5">
                  <ClickHighlight variant="paint" at={isSandbox ? 0 : currentClick}>
                    {areaVal.toFixed(3)}
                  </ClickHighlight>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default CurveCalculusSandbox;
