---
name: lecture-development
description: Guides folder organization, slide deck creation/registration, layout selection, visual elements, highlighting, reusable components, and URL state synchronization.
---

# Lecture & Slide Deck Development Standard

This skill guides creating a new sessional lecture slide deck, structuring UI features, choosing slide layouts, applying interactive highlight states, integrating SVGs/charts, building reusable controls, and managing cross-window presentation synchronization.

---

## 1. Directory Topology

All sessional academic presentation files must conform to the project structure to maintain strict isolation of domains.

### 1.1 Global Directories
* **`src/cores/`**: Global utility libraries and services (e.g., logger, profiles, authentication). No calculation engines or UI.
* **`src/features/`**: Global presentation-agnostic UI features (e.g., slideshow player, gate, general quiz templates).
* **`src/routes/`**: React Router table configurations, middleware routing, and authorization guards.
* **`src/shared/`**: App-wide layouts, styles, components, and layout utilities.

### 1.2 Subject Directories (`src/subjects/`)
Each academic subject resides under `src/subjects/{subjectName}/` as an isolated sub-application:
```text
src/subjects/{subjectName}/
├── cores/         # Subject math: calculations, solvers, physics engines (pure TS)
├── features/      # Subject UI: interactive builders, charts, custom hooks/contexts
└── lectures/      # Subject slides: session-XXXX/lecture-Name/lecture.tsx
```

#### Subject Structure Rules:
1. **`cores/`**: framework-agnostic mathematical engines. Must contain unit tests in `__tests__/`.
2. **`features/`**: Reusable interactive widgets, components, and state controllers (custom hooks/contexts) for this subject.
3. **`lectures/`**: Slide decks (organized by session year) that compose layout templates and import components from `features/`.

---

## 2. Creating and Registering a Lecture

To add a new lecture slide deck and compile it dynamically into the portal registry:

### Step-by-Step Workflow
1. **Create the Lecture Directory**:
   `src/subjects/{subjectId}/lectures/session-{year}/lecture-{index}-{name}/`

2. **Define Portal Metadata**:
   Create a `metadata.ts` file in the new lecture directory:
   ```typescript
   import type { Lecture } from '@/config/lectures';

   export const metadata: Lecture = {
     id: 'unique-lecture-id', // Match router params
     title: 'Lecture Title',
     description: 'Brief description of the lecture topic.',
     slideNo: 1,              // Initial slide page index
     durationMins: 45,        // Estimated duration
     locked: false,           // Lock state for student view
     tags: ['tag1', 'tag2'],
   };
   ```

3. **Implement Slide Deck**:
   Create a `lecture.tsx` file in the new directory. It must export:
   * `slides`: A `Record<number, React.ComponentType<SlideProps>>` mapping slide numbers to React components.
   * `slideMetadata`: A `Record<number, SlideMetadata>` mapping slide numbers to slide information.

4. **Verify Dynamic Discovery**:
   - Save files. Vite automatically compiles the new metadata into `SUBJECTS` at build time.
   - Run typecheck and schema tests:
     ```bash
      npm run typecheck
      npm run lint
      npm run test
      ```

---

## 3. Slide Layout Selection & Configuration

Slide layouts determine the structural containers and grid flow of each page. Always delegate headers and footers to keep animations consistent.
* **layouts.md**: Refer to the detailed [Slide Layouts Reference Guide](file:///d:/Websites/nirafi-workspace/.agent/skills/lecture-development/references/layouts.md) for full configuration, props, and best practices.
  * *Cover Slide*: `<TitleV2Layout>`
  * *Section Divider*: `<TopicDividerLayout>`
  * *General Content*: `<FullWidthLayout>` or `<TwoColumnLayout>`
  * *Grids & Matrix*: `<GridLayout>`

---

## 4. Presentational Content Elements

Avoid raw HTML layout structures. Presentational elements support slide scaling, standard margins, and native highlighting.
* **presentational-elements.md**: Refer to the [Slide Presentational Elements Reference Guide](file:///d:/Websites/nirafi-workspace/.agent/skills/lecture-development/references/presentational-elements.md) for component options, Zod configurations, and layout margins.
  * *Text Blocks*: `<SlideParagraph>`
  * *List Items*: `<SlideBullet>` / `<SlideList>`
  * *Math & Equations*: `<SlideEquation>` / `<LatexFormula>`
  * *Tabular Data*: `<SlideTable>`
  * *Declarative Schemas*: `<SlideSchemaEngine>` parsing JSON config shapes.

---

## 5. Interactive Panels & State Synchronization

Classroom slides must adapt to Blog/mobile viewports and synchronize parameters in real-time across devices.
* **interactive-controls.md**: Refer to the [Interactive Controls & State Sync Reference Guide](file:///d:/Websites/nirafi-workspace/.agent/skills/lecture-development/references/interactive-controls.md) for slider controls, synced hooks, and viewport checklists.
  * *Animations & Reveals*: `<ClickHighlight>` (text, paint, strike variants) and `<ClickReveal>`
  * *Parameter Sandbox*: `<InteractiveCard>`, `<ParameterSlider>`, and `<CalculationOutput>`
  * *Real-Time Sync*: `useUrlSyncedState` hook for cross-window presenter-follower state sync
  * *Separation of Drawings/SVGs*: Keeping SVG markup outside slide files and parameterizing drawings.

---

## 6. Chart Components (Bklit UI)

To incorporate high-fidelity, animated charts from the Bklit UI library without editing the copied source files under `src/features/presentation/components/elements/bklit/`:
* **Aspect Ratio & Height Bounds**: Wrap the chart (e.g. `<CurvedLineChart>`) in a width-constrained container (e.g. `<div className="w-full max-w-[700px] mx-auto">`). Because the chart enforces a `2:1` aspect ratio internally, limiting its parent width automatically limits its height (e.g., to `350px`), preventing bottom viewport overflow on standard 16:9 screens.
* **Theme Color Consistency**: Chart colors automatically map to `--chart-1` through `--chart-5` custom variables. These variables are defined dynamically per-theme in `src/styles/charts.css` to match active lecture styles (e.g., green for Quantity Surveying, blue for Web Development). Do not hardcode colors in the chart invocation.

---

## 8. Visual Implementation Reference Blueprint

Refer to the blueprint code at [substructure-slides-example.tsx](file:///.agent/skills/lecture-development/examples/substructure-slides-example.tsx) to see how these elements, layout rules, state sync patterns, and dynamic shapes map to a live classroom calculator.

---

## 9. Comprehensive Slide & Component Compatibility Checklist

When authoring or modifying slides and interactive presentation widgets, always verify the following:

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
