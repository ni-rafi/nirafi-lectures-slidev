---
name: reusable-components
description: Guides creating and utilizing mode-aware reusable components for interactive slide controls, sliders, and outputs that adapt between Slide Mode and Blog Mode.
---

# Reusable Components and Mode Adaptation Standard

This skill defines the development and usage patterns of reusable components (such as interactive control cards, parameter sliders, and calculation output badges) that natively adapt their styling between presentation modes (Slide/Scroll vs. Blog).

---

## 1. Core Principles

1. **No Hardcoded card classes in Lectures**: Slide decks under `src/lectures/` must never write hardcoded presentation containers like `bg-card`, `bg-muted/60`, `shadow-sm`, or absolute corner hooks. They must delegate layout and backgrounds to reusable element components.
2. **Context Awareness**: Components must consume `PresentationContext` to detect `viewMode === 'blog'`.
3. **Background Elimination in Blog Mode**: When `viewMode === 'blog'`, all background colors (`bg-card`, `bg-muted`), drop-shadows, and powerpoint-style absolute hooks must be stripped.
4. **Variant Support**: Reusable components must support standard layout or style variants (e.g., `info`, `success`, `calculation`, `plain`) through a defined type interface.

---

## 2. Reusable Component Pattern Examples

### 2.1 Interactive Control Card (`<InteractiveCard>`)
Wraps parameter adjusters and sliders.

```tsx
import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface InteractiveCardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'plain';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ title, children, variant = 'default' }) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  let cardClasses = '';
  if (isBlog) {
    cardClasses = 'w-full border border-border/50 rounded-xl p-4 bg-transparent';
  } else if (variant === 'plain') {
    cardClasses = 'w-full p-4 border border-border/40 rounded-xl bg-transparent';
  } else {
    cardClasses = 'relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary';
  }

  return (
    <div className={cardClasses}>
      {title && (
        <div className={`font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 select-none ${
          (!isBlog && variant !== 'plain') ? 'border-b border-border/40 pb-1.5 uppercase' : ''
        }`}>
          {title}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
```

### 2.2 Parameter Slider Row (`<ParameterSlider>`)
Renders slider tracks with label values.

```tsx
import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface ParameterSliderProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({ label, value, unit, min, max, step = 1, onChange }) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  return (
    <div className={`flex flex-col gap-1.5 p-3 rounded-xl border ${
      isBlog ? 'bg-transparent border-border/30' : 'bg-card border-border/60 shadow-xs'
    }`}>
      <label className="text-muted-foreground font-sans text-xs flex justify-between items-center select-none">
        <span>{label}</span>
        <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">
          {value}{unit}
        </span>
      </label>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />
    </div>
  );
};
```

### 2.3 Calculation Output Card (`<CalculationOutput>`)
Displays calculated results cleanly.

```tsx
import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface CalculationOutputProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
}

export const CalculationOutput: React.FC<CalculationOutputProps> = ({ title, value, unit = '', subtitle }) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  return (
    <div className={`flex flex-col items-center justify-center h-full p-6 border rounded-xl shadow-xs transition-shadow ${
      isBlog ? 'bg-transparent border-border/50 shadow-none' : 'bg-card border-border/60 hover:shadow-md'
    }`}>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 select-none">
        {title}
      </span>
      <span className="text-3xl font-extrabold text-primary select-all">
        {value} {unit}
      </span>
      {subtitle && (
        <span className="text-[10px] text-muted-foreground/80 mt-1 select-none">
          {subtitle}
        </span>
      )}
    </div>
  );
};
```

---

## 3. Responsiveness & Stacking Rules

To guarantee visual excellence on mobile viewports and tablets in Blog Mode:
1. **Vertical Stacking**: Multi-column layouts must stack vertically on mobile screens using responsive classes (`flex flex-col md:flex-row` or `grid grid-cols-1 md:grid-cols-2`). Never force side-by-side grids on screen widths `< 768px` in Blog Mode.
2. **Padding Scaling**: Presentation slide margins (e.g., `p-6` or `p-8`) must contract to standard mobile article paddings (`p-3 md:p-5`) to avoid text clipping and save vertical space.
3. **Text Autoscaling**: Outputs (like `<CalculationOutput>`) must use fluid size steps (`text-2xl md:text-3xl`) to remain clean on compact phone layouts.
4. **Input Accessibility**: Slider tracks must stretch to full width (`w-full`) with large touch targets, while labels stay wrapped (`flex-col sm:flex-row sm:justify-between`) to ensure readability on smaller screens.

