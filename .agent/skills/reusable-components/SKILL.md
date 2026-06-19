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

---

## 4. Cross-Window State Synchronization (`useUrlSyncedState`)

To sync interactive parameters, physics values, and widget states across presenter and follower screens:
1. **Hook Invocation**: Use `useUrlSyncedState<T>(key, defaultValue)` instead of React's standard `useState`.
2. **Object and Array Synchronization**:
   - The storage system natively supports JSON serialization for complex values like options, presets, configurations, and structures.
   - **Crucial Rule for Objects/Arrays**: If passing an object literal or array literal as the `defaultValue` parameter, the hook automatically wraps it in a ref internally to prevent infinite re-render loops. However, it is a best practice to keep default parameters static or memoized.
3. **State Updaters**: The synced setter function supports both raw value inputs and functional updaters (`setState(prev => ({ ...prev, [key]: val }))`).
4. **Stable syncKey for Draggables**: Always provide a stable, unique `syncKey` string to draggable components (`<Draggable>` or `<DraggableArrow>`) to distinguish their positions inside the scoped slide space.

#### Code Pattern Example (Dynamic State Syncing):
```tsx
import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';

// 1. Sync simple values (e.g. primitives)
const [preset, setPreset] = useUrlSyncedState<'flowchart' | 'star'>('preset_choice', 'flowchart');
const [physicsEnabled, setPhysicsEnabled] = useUrlSyncedState<boolean>('physics_enabled', false);

// 2. Sync objects/records (e.g., custom presets, morph layouts)
const [shapeOverrides, setShapeOverrides] = useUrlSyncedState<Record<string, string>>('shape_overrides', {});

// 3. Sync positions on draggable elements
<Draggable syncKey="calc_drag_box" initialPos={{ x: 100, y: 150 }} className="...">
  {children}
</Draggable>
```

---

## 5. Comprehensive Slide & Component Compatibility Checklist

When authoring or modifying slides and interactive presentation widgets, always verify the following rules:

### A. Dynamic Theme Compliance
- [ ] **No Static Grays/Slates**: Verify that no container or component wraps content with static colors like `bg-slate-900`, `bg-gray-800`, or `border-white/10`.
- [ ] **Standard Design Tokens**: Use `bg-muted/60 dark:bg-muted/20 border border-border/40 rounded-xl` for slide containers, and standard button style tokens like `bg-muted border-border/50 text-foreground hover:bg-muted/80`.
- [ ] **Light Mode Contrast**: Test slide elements in both light and dark modes to guarantee text (e.g., inside morphing code headers or text inputs) remains readable.

### B. Mode Adaptation (Slide vs. Blog Mode)
- [ ] **Strip Backgrounds**: Verify components strip backgrounds (`bg-transparent`), borders, and drop-shadows when `viewMode === 'blog'`.
- [ ] **No Hardcoded card classes in Lectures**: Ensure slide files inside `src/lectures/` do not define custom structural containers. Delegate them to reusable layouts and interactive cards.
- [ ] **Responsive Stacking**: Grid columns and parameter panels must fold vertically on mobile screen viewports (using `flex flex-col md:flex-row`).

### C. State Synchronization
- [ ] **Cross-Window Sync**: Verify that any value that can change based on user interactions (inputs, preset buttons, sandbox parameters, toggles) is declared via `useUrlSyncedState`.
- [ ] **Stable syncKeys**: Ensure every draggable widget has a stable, explicit string declared for `syncKey`.
- [ ] **No Infinite Loops**: Verify that default values passed to hooks do not trigger infinite rendering loops. Avoid updating state parameters inside render paths.

### D. Layout Consistency
- [ ] **Header & Footer Delegation**: Ensure headers and footers are delegated to `<LayoutHeader>` and `<LayoutFooter>` to preserve view-transition morphing animation effects.
- [ ] **Semantic Elements**: Ensure list items use `<SlideBullet>`, paragraphs use `<SlideParagraph>`, and equations use `<LatexFormula>` or `<SlideEquation>` (no raw HTML equivalents like `<p>` or `<li>`).


