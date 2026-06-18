import React, { useId, useEffect, useRef, useState } from 'react';
import { useClickStepsContext } from '../../context/ClickStepsContext';

export type HighlightVariant = 'bg' | 'paint' | 'marker' | 'rect' | 'text' | 'bold' | 'scale' | 'strike' | 'all';

export interface ClickHighlightProps {
  children: React.ReactNode;
  /** Timing threshold: relative "+1" or absolute step index */
  at?: number | string;
  /**
   * Highlight style:
   * - `marker`  — organic hand-drawn brush stroke shape (SVG path, sweeps left→right)
   * - `paint`   — smooth bottom-strip sweep gradient
   * - `rect`    — solid bordered badge
   * - `text`    — primary color + bold
   * - `bold`    — bold only
   * - `strike`  — animated line-through
   * - `scale`   — slight scale-up pop
   * - `bg`      — flat amber background
   * - `all`     — bold + primary + bg
   */
  variant?: HighlightVariant;
  className?: string;

  // ── Custom styling overrides ─────────────────────────────────────────────
  /** Border style (applies a visible border when provided) */
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  /** Border color (CSS color string) */
  borderColor?: string;
  /** Border width (e.g. "2px") */
  borderWidth?: string;
  /** Background fill mode override */
  bgStyle?: 'solid' | 'paint' | 'none';
  /**
   * Fill color for marker/paint/bg variants.
   * Accepts any CSS color string — rgba() recommended for transparency.
   * Defaults:
   *   marker → rgba(234, 179, 8, 0.45)
   *   paint  → rgba(234, 179, 8, 0.35)
   *   bg     → rgba(250, 204, 21, 0.30)
   */
  bgColor?: string;
  /** Active text color override */
  textColor?: string;
  /** Active font-weight override */
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  /** Active scale factor, e.g. 1.05 */
  scale?: number;
  /** Active text decoration override */
  textDecoration?: 'line-through' | 'underline' | 'none';
  /** Transition duration in ms (default: 450 for marker/paint, 300 for others) */
  transitionDuration?: number;
}

/**
 * Three modes cover every state of the marker's clipPath rect:
 *  - `'forward'`  : SMIL animates width 0 → 300; on cached re-renders fill="freeze"
 *                   keeps rect at 300 automatically.
 *  - `'reverse'`  : SMIL animates width 300 → 0; on cached re-renders fill="freeze"
 *                   keeps rect at 0 automatically.
 *  - `'empty'`    : rect width=0, no SMIL (component never been activated).
 *
 * We never need a `static-full` mode because forwarding the same URL to the
 * browser after the animation completes simply reuses the cached final state.
 */
type MarkerAnimateMode = 'forward' | 'reverse' | 'empty';

function buildMarkerSvgUrl(
  color: string,
  mode: MarkerAnimateMode,
  durationMs: number,
  key: number,
): string {
  const pathD =
    'M5,15 C14,5 32,2 62,7 C88,12 112,4 143,7 C170,10 196,3 226,7 ' +
    'C252,11 274,4 295,10 C300,12 302,16 299,21 L297,37 ' +
    'C288,46 264,49 236,45 C208,41 183,48 155,44 ' +
    'C127,40 102,49 73,44 C48,40 24,47 7,42 C2,40 -1,37 2,31 Z';

  // Unique id per activation/deactivation busts browser data URL cache.
  const cid = `mk${key}`;
  const ease = `calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"`;

  let clipRect: string;
  switch (mode) {
    case 'forward':
      clipRect =
        `<rect x="0" y="0" height="52">` +
        `<animate attributeName="width" from="0" to="300" dur="${durationMs}ms" fill="freeze" ${ease}/></rect>`;
      break;
    case 'reverse':
      clipRect =
        `<rect x="0" y="0" height="52" width="300">` +
        `<animate attributeName="width" from="300" to="0" dur="${durationMs}ms" fill="freeze" ${ease}/></rect>`;
      break;
    default: // 'empty'
      clipRect = `<rect x="0" y="0" height="52" width="0"/>`;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 52" preserveAspectRatio="none">` +
    `<defs><clipPath id="${cid}">${clipRect}</clipPath></defs>` +
    `<path clip-path="url(#${cid})" d="${pathD}" fill="${color}"/></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * ClickHighlight wraps phrasing content or nested components and applies
 * highlighting styles once the slide's active click step reaches its activation step.
 */
export const ClickHighlight: React.FC<ClickHighlightProps> = ({
  children,
  at = '+1',
  variant = 'text',
  className = '',
  borderStyle,
  borderColor,
  borderWidth,
  bgStyle,
  bgColor,
  textColor,
  fontWeight,
  scale,
  textDecoration,
  transitionDuration,
}) => {
  const id = useId();
  const { currentClick, registerClick, deregisterClick } = useClickStepsContext();
  const [activationStep, setActivationStep] = useState<number | null>(null);

  // Three refs manage marker animation state without triggering re-renders:
  //   animKeyRef          — increments on each false→true activation
  //   reverseKeyRef       — increments on each true→false deactivation
  //   hasEverBeenActiveRef— distinguishes "never activated" from "was active, now back"
  //   prevActiveRef       — previous isActive value for transition detection
  const animKeyRef = useRef(0);
  const reverseKeyRef = useRef(0);
  const hasEverBeenActiveRef = useRef(false);
  const prevActiveRef = useRef(false);

  useEffect(() => {
    const step = registerClick(id, at);
    setActivationStep(step);
    return () => { deregisterClick(id); };
  }, [id, at, registerClick, deregisterClick]);

  if (activationStep === null) {
    return <span className="transition-all duration-300">{children}</span>;
  }

  const isActive = currentClick >= activationStep;

  const isInlineBlock = variant === 'scale' || scale !== undefined;
  let highlightClasses = `transition-all ${isInlineBlock ? 'inline-block' : 'inline'} `;

  const defaultDuration =
    variant === 'marker' || variant === 'paint' ? 500 : 300;
  const duration = transitionDuration ?? defaultDuration;

  const style: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Each wrapped line segment renders its own independent background+padding
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  };

  // ── Marker: organic SVG brush-stroke shape ────────────────────────────────
  // The SVG is always rendered at full size (100% × 130%). The SMIL <animate>
  // inside the clipPath draws the stroke left→right when isActive flips true.
  // Swapping the data URL triggers a fresh SMIL animation start — no overlays.
  if (variant === 'marker') {
    const markerColor = bgColor || 'rgba(234, 179, 8, 0.45)';
    // Detect transitions and bump cache-busting keys in-render.
    // isActive=true  on the first render after activation   → forward, new animKey
    // isActive=false on the first render after deactivation → reverse, new reverseKey
    // All subsequent renders in the same state reuse the same key so the
    // browser serves the cached SVG (SMIL fill="freeze" keeps final rect position).
    if (isActive && !prevActiveRef.current) {
      animKeyRef.current += 1;
      hasEverBeenActiveRef.current = true;
    } else if (!isActive && prevActiveRef.current) {
      reverseKeyRef.current += 1;
    }
    prevActiveRef.current = isActive;

    // Mode selection:
    //   active           → always 'forward'  (first play animates; cache keeps it at 300)
    //   inactive + ever active → always 'reverse'  (first play animates; cache keeps it at 0)
    //   inactive + never active → 'empty'  (no SMIL needed, just hide)
    const markerMode: MarkerAnimateMode =
      isActive ? 'forward' :
      hasEverBeenActiveRef.current ? 'reverse' :
      'empty';
    const markerKey = isActive ? animKeyRef.current : reverseKeyRef.current;

    const svgUrl = buildMarkerSvgUrl(markerColor, markerMode, duration, markerKey);

    style.backgroundImage = svgUrl;
    style.backgroundRepeat = 'no-repeat';
    style.backgroundPosition = 'left center';
    // SVG always occupies full width; 130% height bleeds above/below the line.
    style.backgroundSize = '100% 130%';
    // Only transition opacity (fade-in of the text emphasis), not background.
    style.transitionProperty = 'opacity, color, font-weight';

    if (isActive) {
      style.fontWeight = fontWeight ?? '600';
      if (textColor) style.color = textColor;
    } else {
      highlightClasses += ' opacity-75';
    }

    return (
      <span
        className={`${highlightClasses}${className}`}
        style={style}
        data-click-highlight
        data-step={activationStep}
      >
        {children}
      </span>
    );
  }

  // ── All other variants ────────────────────────────────────────────────────
  if (isActive) {
    highlightClasses += className;

    // Font weight
    if (fontWeight) {
      style.fontWeight = fontWeight;
    } else if (variant === 'bold' || variant === 'text' || variant === 'rect' || variant === 'all') {
      style.fontWeight = 'bold';
    } else if (variant === 'paint' || variant === 'scale') {
      style.fontWeight = '600';
    }

    // Text color
    if (textColor) {
      style.color = textColor;
    } else if (variant === 'text') {
      highlightClasses += ' text-primary';
    } else if (variant === 'rect') {
      highlightClasses += ' text-primary dark:text-primary-foreground/90';
    }

    // Scale
    if (scale !== undefined) {
      style.transform = `scale(${scale})`;
    } else if (variant === 'scale') {
      style.transform = 'scale(1.05)';
    }

    // Background
    const finalBgStyle = bgStyle || (variant === 'paint' ? 'paint' : variant === 'bg' || variant === 'all' || variant === 'rect' ? 'solid' : 'none');
    if (finalBgStyle === 'paint') {
      const c = bgColor || 'rgba(234, 179, 8, 0.35)';
      style.backgroundImage = `linear-gradient(120deg, ${c} 0%, ${c} 100%)`;
      style.backgroundRepeat = 'no-repeat';
      style.backgroundSize = '100% 88%';
      style.backgroundPosition = '0 92%';
      style.transitionProperty = 'background-size, color, opacity';
    } else if (finalBgStyle === 'solid') {
      if (variant === 'rect') {
        highlightClasses += ' bg-primary/10';
      } else {
        style.backgroundColor = bgColor || 'rgba(250, 204, 21, 0.3)';
      }
    }

    // Border
    const finalBorderStyle = borderStyle || (variant === 'rect' ? 'solid' : 'none');
    if (finalBorderStyle !== 'none') {
      style.borderStyle = finalBorderStyle;
      style.borderColor = borderColor || (variant === 'rect' ? 'color-mix(in oklch, var(--primary) 30%, transparent)' : 'currentColor');
      style.borderWidth = borderWidth || '1px';
      highlightClasses += ' px-1.5 py-0.5 rounded';
    }

    // Text decoration / strike
    const finalDecoration = textDecoration || (variant === 'strike' ? 'line-through' : 'none');
    if (finalDecoration === 'line-through') {
      style.backgroundImage = 'linear-gradient(to right, currentColor 100%, transparent 0%)';
      style.backgroundRepeat = 'no-repeat';
      style.backgroundSize = '100% 2px';
      style.backgroundPosition = '0 50%';
      style.transitionProperty = 'background-size, color, opacity';
      highlightClasses += ' text-muted-foreground';
    } else if (finalDecoration === 'underline') {
      style.textDecoration = 'underline';
    }
  } else {
    // Inactive (pre-activation) state
    highlightClasses += ' opacity-70 font-normal';

    const finalBgStyle = bgStyle || (variant === 'paint' ? 'paint' : 'none');
    if (finalBgStyle === 'paint') {
      const c = bgColor || 'rgba(234, 179, 8, 0.35)';
      style.backgroundImage = `linear-gradient(120deg, ${c} 0%, ${c} 100%)`;
      style.backgroundRepeat = 'no-repeat';
      style.backgroundSize = '0% 88%';
      style.backgroundPosition = '0 92%';
      style.transitionProperty = 'background-size, opacity';
    }

    const finalDecoration = textDecoration || (variant === 'strike' ? 'line-through' : 'none');
    if (finalDecoration === 'line-through') {
      style.backgroundImage = 'linear-gradient(to right, currentColor 100%, transparent 0%)';
      style.backgroundRepeat = 'no-repeat';
      style.backgroundSize = '0% 2px';
      style.backgroundPosition = '0 50%';
      style.transitionProperty = 'background-size, opacity';
    }

    const finalBorderStyle = borderStyle || (variant === 'rect' ? 'solid' : 'none');
    if (finalBorderStyle !== 'none') {
      style.borderStyle = 'solid';
      style.borderColor = 'transparent';
      style.borderWidth = borderWidth || '1px';
      highlightClasses += ' px-1.5 py-0.5 rounded';
    }
  }

  return (
    <span
      className={`${highlightClasses} ${className}`}
      style={style}
      data-click-highlight
      data-step={activationStep}
    >
      {children}
    </span>
  );
};

export default ClickHighlight;
