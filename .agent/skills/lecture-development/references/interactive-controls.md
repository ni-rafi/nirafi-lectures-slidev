# Slide Interactive Controls & State Sync Reference Guide

This document lists every interactive control, animation utility, annotation element, and state sync helper available in the codebase, detailing their props, usages, and best practices.

---

## 1. Click Animation & Reveals

### ClickReveal
Hides children initially and fades/slides them into view on a specific sessional click step.
* **Props**:
  * `at: number | string` (Step index like `1`, or relative offset like `"+1"`)
  * `preset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none'`
  * `style?: React.CSSProperties`, `children?: React.ReactNode`
* **Example**:
  ```tsx
  <ClickReveal at={1} preset="up"><div>Revealed at step 1</div></ClickReveal>
  ```

### ClickRevealGroup
Enables auto-stagger reveals or ordered clicking sequences for nested child elements.
* **Props**:
  * `revealMode?: 'each-click' | 'auto-stagger' | 'none'`
  * `delayMs?: number` (stagger timing, default: `200`)
* **Example**:
  ```tsx
  <ClickRevealGroup revealMode="auto-stagger">
    <div>Step 1</div><div>Step 2</div>
  </ClickRevealGroup>
  ```

### ClickHighlight
Applies paintbrush, strikeout, or color transition outlines to running text or equations.
* **Props**:
  * `at: number` (activation click step)
  * `variant?: 'text' | 'paint' | 'rect' | 'bold' | 'strike'`
* **Example**:
  ```tsx
  <span>Measure <ClickHighlight at={2} variant="paint">thickness</ClickHighlight> here.</span>
  ```

### HoverTooltip
Standard tooltip bubble triggered by sessional hover gestures.
* **Props**:
  * `text: string`, `children: React.ReactNode`
* **Example**:
  ```tsx
  <HoverTooltip text="Standard brick joint is 10mm"><span>Mortar joint</span></HoverTooltip>
  ```

---

## 2. Parameter Control Panels

All parameter control widgets must reside inside standard card panels.

### InteractiveCard
A container card panel wrapper that adapts to Blog Mode by stripping backgrounds and absolute lines.
* **Props**:
  * `title?: string`, `variant?: 'default' | 'plain'`, `children: React.ReactNode`
* **Example**:
  ```tsx
  <InteractiveCard title="Inputs"><ParameterSlider ... /></InteractiveCard>
  ```

### ParameterSlider
Renders a slider bar with values formatting and responsive layout scaling.
* **Props**:
  * `label: string`, `value: number`, `unit: string`
  * `min: number`, `max: number`, `step?: number`, `onChange: (val: number) => void`
* **Example**:
  ```tsx
  <ParameterSlider label="Width" value={w} unit="m" min={0.5} max={3} onChange={setW} />
  ```

### CalculationOutput
Renders calculated results with monospaced bold text and responsive size transitions.
* **Props**:
  * `title: string`, `value: string | number`, `unit?: string`, `subtitle?: string`
* **Example**:
  ```tsx
  <CalculationOutput title="Volume" value={vol} unit="m³" />
  ```

---

## 3. Structural Annotations & Physics Sandbox

### SlideDimensionLines
Renders CAD-like dimension arrows and label boundaries on structural drawing elements.
* **Props**:
  * `el: VisualCanvasShape`, `scaleFactor: { pixelsPerUnit: number; unit: PhysicalUnit }`
  * `editable: boolean`, `onLabelClick?: (...) => void`
* **Example**:
  ```tsx
  <SlideDimensionLines el={footingShape} scaleFactor={{ pixelsPerUnit: 100, unit: 'm' }} editable={true} />
  ```

### BeamLoads & BeamSupports
Annotates beams with pin/roller/fixed supports and UDL/UVL/Moment loads.
* **Props**:
  * `el: VisualCanvasShape`, `stroke: string`, `fill: string`, `sw: number`, `transform: string`
* **Example**:
  ```tsx
  <BeamSupports el={pinSupportShape} stroke="currentColor" fill="none" sw={2} transform="translate(100,200)" />
  ```

### ShapeMorph & PhysicsSandbox
Interpolates SVG paths dynamically or acts as a sessional 2D rigid-body collision simulator.
* **Props**:
  * `targetPath: string` (for `ShapeMorph`)
  * `gravity?: number`, `shapes: ShapeData[]` (for `PhysicsSandbox`)
* **Example**:
  ```tsx
  <ShapeMorph targetPath="M 0 0 L 100 100 Z" duration={500} />
  ```

---

## 4. State Sync Hook

### useUrlSyncedState
Synchronizes interactive parameters in real-time across student screens and sessional presentation displays.
* **Usage**:
  ```typescript
  import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
  
  const [thickness, setThickness] = useUrlSyncedState<number>('slab_thickness', 0.150);
  ```
* **Best Practices**:
  * Keep keys unique across the presentation.
  * Memoize object/array defaults to avoid render loops.

---

## 5. Live Classroom Quizzes

### QuizCardOrchestrator
Renders interactive sessional multiple-choice or numeric-input assessments synced with Firebase.
* **Props**:
  * `quizId: string` (Must match the sessional active quiz key in database)
  * `questionText: string`
  * `quizType?: 'numeric-input' | 'multiple-choice'`
  * `correctAnswer?: string`
* **Example**:
  ```tsx
  import { QuizCardOrchestrator } from '@/features/quiz';

  <QuizCardOrchestrator
    quizId="concrete_lec1_q1"
    questionText="What is the unit weight of RCC?"
    quizType="numeric-input"
    correctAnswer="2400"
  />
  ```

