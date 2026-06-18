import React, { useRef } from 'react';
import type { SlideDimensions } from '../../types';
import { useSlideScale } from '../../hooks/useSlideScale';
import { useSlideTheme } from '../../context/SlideThemeContext';

interface SlideContainerProps {
  children: React.ReactNode;
  /** Dimensions of the virtual canvas coordinate space */
  dimensions?: SlideDimensions;
  /** Scale factor override for this slide */
  zoom?: number;
  /** Scaling mode: 'fit' or '1:1' */
  scaleMode?: 'fit' | '1:1';
  /** Optimize styling for overview thumbnails */
  isThumbnail?: boolean;
}

const DEFAULT_DIMENSIONS: SlideDimensions = {
  width: 980,
  aspectRatio: 16 / 9,
};

/**
 * SlideContainer bounds the slide layouts to a fixed virtual aspect ratio
 * and applies CSS scale transformations to fit any display screen responsively.
 */
export const SlideContainer: React.FC<SlideContainerProps> = ({
  children,
  dimensions = DEFAULT_DIMENSIONS,
  zoom = 1,
  scaleMode = 'fit',
  isThumbnail = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fitScale = useSlideScale(containerRef, dimensions, zoom);
  const scale = scaleMode === '1:1' ? 1.0 : fitScale;

  const { resolvedTheme } = useSlideTheme();

  const virtualHeight = dimensions.width / dimensions.aspectRatio;

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  let customBackgroundValue: string | undefined = undefined;

  if (resolvedTheme.bgType === 'gradient') {
    customBackgroundValue = isDark
      ? `linear-gradient(135deg, oklch(0.18 0.04 ${resolvedTheme.accentHue}) 0%, oklch(0.12 0.02 ${resolvedTheme.accentHue}) 100%)`
      : `linear-gradient(135deg, oklch(0.95 0.05 ${resolvedTheme.accentHue}) 0%, oklch(0.99 0.01 ${resolvedTheme.accentHue}) 100%)`;
  } else if (resolvedTheme.bgType === 'custom' && resolvedTheme.customBgValue) {
    customBackgroundValue = resolvedTheme.customBgValue;
  }

  const canvasStyle: React.CSSProperties & Record<string, string | number> = {
    width: `${dimensions.width}px`,
    height: `${virtualHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    flexShrink: 0,
    '--slide-accent-hue': resolvedTheme.accentHue.toString(),
    '--slide-radius': `${resolvedTheme.borderRadius}px`,
    '--slide-font-sans': resolvedTheme.fontSans,
    '--slide-font-header': resolvedTheme.fontHeader,
    '--slide-bg-type': resolvedTheme.bgType,
    '--slide-custom-bg': resolvedTheme.customBgValue,
    '--slide-border-side': resolvedTheme.borderSide,
    '--slide-header-size': `${resolvedTheme.headerFontSize}px`,
  };

  if (customBackgroundValue) {
    canvasStyle.background = customBackgroundValue;
    canvasStyle['--background'] = customBackgroundValue;
  }

  const borderClass = 'rounded-2xl border border-border';

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
        isThumbnail ? 'bg-transparent p-0' : 'bg-muted/40 p-4 sm:p-6'
      }`}
      data-slide-container
    >
      {/* Centered Sandboxed virtual canvas sheet */}
      <div
        style={canvasStyle}
        className={`relative bg-background text-foreground overflow-hidden flex flex-col justify-between select-none ${
          isThumbnail ? '' : borderClass
        }`}
        data-slide-canvas
      >
        {children}
      </div>
    </div>
  );
};

export default SlideContainer;
