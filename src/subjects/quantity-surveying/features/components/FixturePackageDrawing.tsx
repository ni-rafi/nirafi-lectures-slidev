import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface FixturePackageProps {
  toiletType?: 'Indian' | 'EuropeanFloor' | 'EuropeanWallHung';
  basinType?: 'None' | 'Counter' | 'Pedestal';
  hasMirror?: boolean;
  hasTowelRail?: boolean;
  hasSoapTray?: boolean;
  hasSmartSoap?: boolean;
  hasSmartDryer?: boolean;

  // Compatibility props
  fixtureType?: 'Indian' | 'European';
  hasCistern?: boolean;
  hasPushShower?: boolean;
  hasLowBibcock?: boolean;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'toilet' | 'basin' | 'accessories' | 'smart' | 'indian' | 'european';
  className?: string;
}

export const FixturePackageDrawing: React.FC<FixturePackageProps> = ({
  toiletType,
  basinType = 'None',
  hasMirror = false,
  hasTowelRail = false,
  hasSoapTray = false,
  hasSmartSoap = false,
  hasSmartDryer = false,

  fixtureType = 'Indian',
  hasCistern = false,
  hasPushShower = false,
  hasLowBibcock = false,
  showAnnotation = true,
  activeHighlight = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  // Resolve toilet type
  const resolvedToilet = toiletType || (fixtureType === 'European' ? 'EuropeanFloor' : 'Indian');

  // Highlight calculations
  const isToiletActive =
    activeHighlight === 'none' ||
    activeHighlight === 'toilet' ||
    activeHighlight === 'indian' ||
    activeHighlight === 'european';
  const isBasinActive = activeHighlight === 'none' || activeHighlight === 'basin';
  const isAccessoriesActive = activeHighlight === 'none' || activeHighlight === 'accessories';
  const isSmartActive = activeHighlight === 'none' || activeHighlight === 'smart';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  const cx = 120; // Toilet center x
  const cy = 130; // base y
  const floorY = cy + 40; // 170

  const bcx = 280; // Basin center x
  const bcy = 110; // Basin height

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Bathroom Assembly Configuration
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 550 220"
        className="overflow-visible select-none"
      >
        {/* Wall & Floor Background guide lines */}
        <line
          x1="20"
          y1={floorY}
          x2="370"
          y2={floorY}
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-muted-foreground/30"
        />
        <line
          x1="60"
          y1="20"
          x2="60"
          y2={floorY}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3,3"
          className="text-muted-foreground/30"
        />

        {/* Toilet Layer */}
        <g opacity={isToiletActive ? '1' : '0.15'} className="transition-all duration-300">
          {/* Indian Pan */}
          {resolvedToilet === 'Indian' && (
            <g>
              <ellipse
                cx={cx}
                cy={floorY}
                rx="45"
                ry="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <ellipse
                cx={cx}
                cy={floorY}
                rx="35"
                ry="14"
                fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.1))"
                stroke="currentColor"
                strokeWidth="1"
              />
              {/* Footrests */}
              <rect
                x={cx - 32}
                y={floorY - 12}
                width="10"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                rx="2"
              />
              <rect
                x={cx + 22}
                y={floorY - 12}
                width="10"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                rx="2"
              />
              {/* P-Trap representation */}
              <path
                d={`M ${cx},${floorY + 5} v 18 c 0,8 -15,8 -15,0 v -8`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3,2"
                className="text-muted-foreground/60"
              />
              <text x={cx - 42} y={floorY + 34} className="font-mono text-[11px] fill-muted-foreground">
                P-Trap
              </text>
            </g>
          )}

          {/* European Floor Commode */}
          {resolvedToilet === 'EuropeanFloor' && (
            <g>
              <path
                d={`M ${cx - 22},${floorY} L ${cx - 18},${cy + 10} C ${cx - 32},${cy + 10} ${cx - 32},${cy - 20} ${cx - 22},${cy - 20} H ${cx + 22} C ${cx + 32},${cy - 20} ${cx + 32},${cy + 10} ${cx + 18},${cy + 10} L ${cx + 22},${floorY} Z`}
                fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.05))"
                stroke="var(--chart-1, #3b82f6)"
                strokeWidth="2"
              />
              <ellipse
                cx={cx}
                cy={cy - 20}
                rx="22"
                ry="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx={cx - 15} cy={floorY - 6} r="2" fill="currentColor" />
              <circle cx={cx + 15} cy={floorY - 6} r="2" fill="currentColor" />
            </g>
          )}

          {/* European Wall-Hung Commode */}
          {resolvedToilet === 'EuropeanWallHung' && (
            <g>
              {/* Wall hidden support frame */}
              <rect
                x="25"
                y="40"
                width="35"
                height="130"
                fill="none"
                stroke="currentColor"
                strokeDasharray="3,3"
                strokeWidth="1"
                className="text-muted-foreground/50"
              />
              <text x="22" y="32" className="font-mono text-[11px] fill-muted-foreground">
                Frame
              </text>

              {/* Float Commode Bowl */}
              <path
                d={`M 60,${cy - 15} H ${cx + 18} C ${cx + 26},${cy - 15} ${cx + 26},${cy + 15} ${cx + 12},${cy + 22} L 60,${cy + 25} Z`}
                fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.05))"
                stroke="var(--chart-1, #3b82f6)"
                strokeWidth="2"
              />
              <ellipse
                cx={cx}
                cy={cy - 15}
                rx="20"
                ry="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {/* Gap beneath showing wall-hung */}
              <line
                x1="60"
                y1={floorY}
                x2={cx + 30}
                y2={floorY}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                className="text-muted-foreground/30"
              />
            </g>
          )}

          {/* Standard Flushing Cistern (For floor commode or Indian pan if enabled) */}
          {hasCistern && resolvedToilet !== 'EuropeanWallHung' && (
            <g>
              <rect
                x="35"
                y="35"
                width="30"
                height="45"
                fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.08))"
                stroke="currentColor"
                strokeWidth="1.5"
                rx="3"
              />
              <line x1="50" y1="35" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="58" cy="48" r="2.5" fill="var(--chart-2, #eab308)" />
              {resolvedToilet === 'Indian' ? (
                <path
                  d={`M 50,80 V ${cy - 10} Q 50,${cy + 10} ${cx - 36},${cy + 10}`}
                  fill="none"
                  stroke="var(--chart-2, #eab308)"
                  strokeWidth="2"
                />
              ) : (
                <path
                  d={`M 50,80 V ${cy - 10} H ${cx - 20}`}
                  fill="none"
                  stroke="var(--chart-2, #eab308)"
                  strokeWidth="2"
                />
              )}
              <text x="22" y="28" className="font-mono text-[11px] fill-muted-foreground font-semibold">
                Cistern
              </text>
            </g>
          )}

          {/* Wall-hung concealed cistern representation */}
          {resolvedToilet === 'EuropeanWallHung' && (
            <g>
              {/* Concealed cistern tank inside the frame */}
              <rect
                x="30"
                y="45"
                width="25"
                height="35"
                fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.1))"
                stroke="var(--chart-2, #eab308)"
                strokeWidth="1"
                strokeDasharray="2,1"
                rx="2"
              />
              {/* Flush bend pipe */}
              <path
                d={`M 42,80 V ${cy - 8} H 60`}
                fill="none"
                stroke="var(--chart-2, #eab308)"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              {/* Dual Flush Plate on Wall */}
              <rect x="59" y="60" width="3" height="10" fill="currentColor" />
              <rect x="62" y="62" width="2" height="6" fill="var(--chart-2, #eab308)" />
            </g>
          )}

          {/* Accessories: Push Shower */}
          {hasPushShower && (
            <g transform={`translate(${cx + 50}, 80)`} className="text-chart-2">
              <path d="M 0,0 C 4,-8 8,-4 8,4 L 4,12 h -4 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <line x1="4" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="1" />
              <path d={`M 2,10 C 2,20 -15,35 -15,60`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,1" />
              <rect x="-2" y="4" width="4" height="4" fill="currentColor" rx="1" />
              <text x="12" y="8" className="font-mono text-[11px] fill-muted-foreground font-semibold">
                Shower
              </text>
            </g>
          )}

          {/* Accessories: Low-Level Bib-cock */}
          {hasLowBibcock && (
            <g transform={`translate(${cx - 55}, 110)`} className="text-chart-3">
              <path d="M -12,0 H 8 v 8 M 0,0 v 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="4" y="-4" width="3" height="4" fill="currentColor" />
              <circle cx="8" cy="11" r="1" fill="var(--chart-1, #3b82f6)" />
              <circle cx="8" cy="16" r="0.7" fill="var(--chart-1, #3b82f6)" />
              <text x="-25" y="-8" className="font-mono text-[11px] fill-muted-foreground font-semibold">
                Bib-cock
              </text>
            </g>
          )}
        </g>

        {/* Basin Layer */}
        <g opacity={isBasinActive ? '1' : '0.15'} className="transition-all duration-300">
          {basinType === 'Pedestal' && (
            <g>
              {/* Pedestal Stand */}
              <path
                d={`M ${bcx - 10},${floorY} L ${bcx - 8},${bcy + 15} H ${bcx + 8} L ${bcx + 10},${floorY} Z`}
                fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              {/* Basin Bowl */}
              <ellipse
                cx={bcx}
                cy={bcy + 5}
                rx="25"
                ry="10"
                fill="var(--chart-3-opacity, rgba(16, 185, 129, 0.05))"
                stroke="var(--chart-3, #10b981)"
                strokeWidth="1.8"
              />
              <path
                d={`M ${bcx - 24},${bcy + 7} C ${bcx - 20},${bcy + 22} ${bcx + 20},${bcy + 22} ${bcx + 24},${bcy + 7}`}
                fill="none"
                stroke="var(--chart-3, #10b981)"
                strokeWidth="1.5"
              />
              {/* Tap / Faucet */}
              <path d={`M ${bcx},${bcy - 12} v 8 M ${bcx},${bcy - 12} q 5,-4 8,0`} fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x={bcx - 30} y={bcy + 34} className="font-mono text-[11px] fill-muted-foreground font-semibold">
                Pedestal Basin
              </text>
            </g>
          )}

          {basinType === 'Counter' && (
            <g>
              {/* Vanity Counter Slab */}
              <rect
                x={bcx - 35}
                y={bcy + 8}
                width="70"
                height="8"
                fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.15))"
                stroke="currentColor"
                strokeWidth="1.2"
                rx="1"
              />
              {/* Vanity Supporting Brackets */}
              <line x1={bcx - 30} y1={bcy + 16} x2={bcx - 22} y2={bcy + 32} stroke="currentColor" strokeWidth="1.2" />
              <line x1={bcx + 30} y1={bcy + 16} x2={bcx + 22} y2={bcy + 32} stroke="currentColor" strokeWidth="1.2" />
              {/* Bowl sitting on counter */}
              <ellipse
                cx={bcx}
                cy={bcy + 4}
                rx="22"
                ry="8"
                fill="var(--chart-3-opacity, rgba(16, 185, 129, 0.05))"
                stroke="var(--chart-3, #10b981)"
                strokeWidth="1.8"
              />
              {/* Faucet */}
              <path d={`M ${bcx},${bcy - 12} v 8 M ${bcx},${bcy - 12} q 5,-4 8,0`} fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x={bcx - 32} y={bcy + 34} className="font-mono text-[11px] fill-muted-foreground font-semibold">
                Counter Basin
              </text>
            </g>
          )}
        </g>

        {/* Accessories Layer */}
        <g opacity={isAccessoriesActive ? '1' : '0.15'} className="transition-all duration-300 text-chart-2">
          {/* Mirror */}
          {hasMirror && basinType !== 'None' && (
            <g>
              <rect
                x={bcx - 20}
                y="35"
                width="40"
                height="45"
                fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.05))"
                stroke="currentColor"
                strokeWidth="1.5"
                rx="2"
              />
              {/* Mirror Reflection Line */}
              <line x1={bcx - 10} y1="42" x2={bcx + 15} y2="67" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              <text x={bcx - 16} y="30" className="font-mono text-[11px] fill-muted-foreground">
                Mirror
              </text>
            </g>
          )}

          {/* Towel Rail */}
          {hasTowelRail && (
            <g>
              <line x1="330" y1="90" x2="365" y2="90" stroke="currentColor" strokeWidth="2.5" />
              <rect x="328" y="87" width="2" height="6" fill="currentColor" />
              <rect x="365" y="87" width="2" height="6" fill="currentColor" />
              {/* Draped towel representation */}
              <path d="M 336,90 v 25 h 22 v -25" fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.1))" stroke="currentColor" strokeWidth="0.8" />
              <text x="320" y="81" className="font-mono text-[11px] fill-muted-foreground">
                Rail
              </text>
            </g>
          )}

          {/* Soap Tray */}
          {hasSoapTray && basinType !== 'None' && (
            <g transform={`translate(${bcx - 45}, ${bcy + 2})`}>
              <ellipse cx="0" cy="0" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="-4" y="-3" width="8" height="2" fill="var(--chart-2, #eab308)" rx="1" />
              <text x="-12" y="-6" className="font-mono text-[11px] fill-muted-foreground">
                Tray
              </text>
            </g>
          )}
        </g>

        {/* Smart Upgrades Layer */}
        <g opacity={isSmartActive ? '1' : '0.15'} className="transition-all duration-300 text-chart-4">
          {/* Smart IR Soap Dispenser */}
          {hasSmartSoap && basinType !== 'None' && (
            <g transform={`translate(${bcx + 28}, ${bcy - 20})`}>
              <rect x="-6" y="-12" width="12" height="20" fill="var(--chart-4-opacity, rgba(168, 85, 247, 0.1))" stroke="currentColor" strokeWidth="1.2" rx="2" />
              {/* Spout */}
              <path d="M -6,0 h -6 v 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* IR beam indicator */}
              <line x1="-10" y1="5" x2="-10" y2="15" stroke="var(--chart-4, #a855f7)" strokeWidth="0.8" strokeDasharray="1,1" />
              <circle cx="-10" cy="18" r="1.5" fill="var(--chart-4, #a855f7)" />
              <text x="10" y="-5" className="font-mono text-[11px] fill-muted-foreground font-semibold">
                IR Soap
              </text>
            </g>
          )}

          {/* HEPA Hand Dryer */}
          {hasSmartDryer && (
            <g transform="translate(385, 65)">
              <rect x="0" y="0" width="30" height="35" fill="var(--chart-4-opacity, rgba(168, 85, 247, 0.1))" stroke="currentColor" strokeWidth="1.5" rx="3" />
              <circle cx="15" cy="8" r="3" fill="currentColor" />
              <path d="M 8,28 q 7,5 14,0" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Air outlet & hot waves */}
              <path d="M 10,38 q 2,8 0,15 M 15,38 q 2,8 0,15 M 20,38 q 2,8 0,15" fill="none" stroke="var(--chart-4, #a855f7)" strokeWidth="1" />
              <text x="-4" y="-8" className="font-mono text-[11px] fill-muted-foreground font-semibold">
                Dryer
              </text>
            </g>
          )}
        </g>

        {/* Annotations & PWD Composite Billing Rules */}
        {showAnnotation && (
          <g className="font-mono text-[11px] fill-muted-foreground font-bold transition-all duration-300">
            {/* PWD Pack components highlights */}
            <rect
              x="420"
              y="10"
              width="125"
              height="100"
              fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
              stroke="currentColor"
              strokeWidth="0.5"
              rx="3"
              className="text-muted-foreground/30"
            />
            <text x="426" y="24" className="fill-foreground text-[11px] font-extrabold">
              Billing Units:
            </text>
            <text x="428" y="38" className="fill-chart-1 text-[11px]">
              • WC Pack: Set
            </text>
            <text x="428" y="50" className={basinType !== 'None' ? 'fill-chart-3 text-[11px]' : 'fill-muted-foreground text-[11px]'}>
              • Basin Pack: Set
            </text>
            <text x="428" y="62" className={hasMirror || hasTowelRail || hasSoapTray ? 'fill-chart-2 text-[11px]' : 'fill-muted-foreground text-[11px]'}>
              • Fittings: Nos.
            </text>
            <text x="428" y="74" className={hasSmartSoap || hasSmartDryer ? 'fill-chart-4 text-[11px]' : 'fill-muted-foreground text-[11px]'}>
              • Sensors: Nos.
            </text>
            <text x="426" y="98" className="fill-primary text-[11px] font-extrabold">
              Take-off: Standard PWD
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default FixturePackageDrawing;

