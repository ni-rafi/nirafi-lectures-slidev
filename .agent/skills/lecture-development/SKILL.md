---
name: lecture-development
description: Guides folder organization, slide deck creation/registration, layout selection, visual elements, highlighting, reusable components, and URL state synchronization.
---

# Lecture & Slide Deck Development Standard

This skill guides creating a new sessional lecture slide deck, structuring UI features, choosing slide layouts, applying interactive highlight states, integrating SVGs/charts, building reusable controls, and managing cross-window presentation synchronization.

---

## 0. Core Presentation Design & Modularity Principles

To maintain clean slide definitions and support multi-mode publishing (Slide, Scroll, and Blog Modes):
* **Visual-First Layouts**: Prefer visual representations (interactive charts, flowcharts, diagrams, and shapes) over heavy textual descriptions or flat bullet lists. Keep text minimal and use graphics to show rather than tell.
* **Integrated Interactive Drawings**: Do not show structural/engineering drawings on a separate page from the concept description. Integrate drawings directly into the slides where they are described (e.g., using `TwoColumnLayout`), adding click-to-reveal steps to synchronize bullet descriptions with highlights in the drawing component. Reuse the same drawing component on sandbox/calculation slides.
* **Progressive Highlights**: When explaining physical structures, cross-sections, elevations, or dimensional bounds, render the shape dynamically (using canvas or SVGs) and highlight components step-by-step using click reveals/highlights instead of static text tables or bullet lists.
* **Eye-catching Elements**: Use bold/large numbers for calculation outputs, paint-over highlighter animations (`<ClickHighlight variant="paint">`), and transition-linked graphics.
* **Data Reference Standards**: Always prioritize official project documentation (e.g., PWD scheduling specifications). Supplement with cross-checked publications from reputable publishers only when directly relevant, providing precise citations in the presentation context.
* **No Hardcoding on Slides**: Do not hardcode presentational layouts, large SVGs, or custom visual content directly inside individual slide components.
* **Modularity & Reusability**: Deconstruct complex slide visuals into isolated, reusable components with a granular file structure. Design every widget so it can be re-imported and reused across different lectures or outlines.
* **Single Responsibility Principle (SRP)**: Keep each element component small and focused on a single logical duty or drawing.
* **Separation of Concerns**: Keep presentational UI logic entirely separate from sessional orchestration logic. Do not mix data fetching, global stores, or raw side-effects inside elements.
* **Type Safety**: Define explicit, strict TypeScript interfaces for all component props. Reject any implicit `any` usage.
* **SVG Parameterization**: Do not embed raw SVG markup inside slide files. Instead, extract drawings into dedicated components, parameterizing coordinates, dimensions, and visual states using type-safe JSON/props inputs.

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
3. **`lectures/`**: Slide decks (organized by session year). For a given lecture, slide files must be structured into per-section subdirectories rather than a single flat file or large shared files:
   - **Section Folders**: Organize slides into subdirectories named after the lecture topic: `slides/section-{section-name}/` (e.g. `slides/section-sign-conventions/`).
   - **Filename Standard**: Individual slide components must be named after their topic (e.g. `ShearSignConvention.tsx`). Do NOT prefix filenames with slide numbers (like `Slide12_Shear.tsx`) to avoid renaming churn when slide orders shift.
   - **Section Barrel (`index.ts`)**: Each section subdirectory must contain an `index.ts` file that imports the topic-named components and exports them mapped to slide number aliases (e.g., `export { ShearSignConvention as Slide12 }`).
   - **Section Metadata**: Co-locate metadata in each section barrel under a `sectionMetadata` export, which matches the slide indices defined in that barrel.
   - **Section Drawings**: Section-specific, non-reusable SVGs or figures must reside in a `drawings/` subfolder directly inside that section's directory (e.g., `section-method-of-sections/drawings/PiecewiseIntervalDiagram.tsx`) rather than the subject-wide drawings directory.
   - **Orchestration**: The root `lecture.tsx` file imports the aliased slides and `sectionMetadata` from all section barrels and spreads/merges them into the main exports.

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
  * *Interactive Parameterized Quizzes*: `<QuizCardOrchestrator>` leveraging `parameterResolver` to evaluate registration-aware variables, rendering formulas when empty and checking correctness dynamically.

---

## 6. Chart Components (Bklit UI)

To incorporate high-fidelity, animated charts from the Bklit UI library without editing the copied source files under `src/features/presentation/components/elements/bklit/`:
* **Aspect Ratio & Height Bounds**: Wrap the chart (e.g. `<CurvedLineChart>`) in a width-constrained container (e.g. `<div className="w-full max-w-[700px] mx-auto">`). Because the chart enforces a `2:1` aspect ratio internally, limiting its parent width automatically limits its height (e.g., to `350px`), preventing bottom viewport overflow on standard 16:9 screens.
* **Theme Color Consistency**: Chart colors automatically map to `--chart-1` through `--chart-5` custom variables. These variables are defined dynamically per-theme in `src/styles/charts.css` to match active lecture styles (e.g., green for Quantity Surveying, blue for Web Development). Do not hardcode colors in the chart invocation.

---

## 7. Parameterized Structural Drawings

For plan-view grid alignments, foundation pile layouts, road pavement cross-sections, and cut/fill topography profiles:
* **drawings.md**: Refer to the [Interactive Drawing Canvases Reference Guide](file:///d:/Websites/nirafi-workspace/.agent/skills/lecture-development/references/drawings.md) for full coordinate mapping engines, canvas configurations, and props schemas.
  * *Building Drawings*: `<PlanDrawingCanvas>`, `<SectionDrawingCanvas>`
  * *Civil Drawings*: `<FoundationDrawingCanvas>`, `<RoadSectionCanvas>`, `<EarthworkProfileCanvas>`
* **Drawing Wrapper Height Boundaries**: Outer drawing containers must never hardcode fixed height constraints like `h-full` internally. Allow height to be configured dynamically or inherit sizing via parent flex boundaries (e.g. `flex-1` when stacked under vertical columns). This enables other stacked components (like formula cards or descriptions) to occupy remaining vertical space cleanly.
* **Vertical Space Optimization**: Keep SVG canvas containers bounded (e.g., changing container heights from `h-56` to `h-44` and cropping the viewBox to remove unnecessary margins) so that slides remain spacious on standard 16:9 presentation viewports without scrollbars or text cutoff.
* **Drawing Text Visibility**: Text labels inside SVG drawings must use a minimum font size of `11px` to `12px` (equivalent to standard browser `text-xs`/`text-sm` scales) to guarantee legibility on classroom projection screens.
* **Synced Click-Reveal Design**: All reusable drawings/figures must be designed to support dynamic active step overrides (like a `currentClick` or `activeStep` prop). This allows them to highlight layers and components progressively to synchronize with the sessional click-reveals of descriptions.

---

## 8. Visual Implementation Reference Blueprint

Refer to the blueprint code at [substructure-slides-example.tsx](file:///.agent/skills/lecture-development/examples/substructure-slides-example.tsx) to see how these elements, layout rules, state sync patterns, and dynamic shapes map to a live classroom calculator.

---

## 9. Comprehensive Slide & Component Compatibility Checklist

### A. New Reusable Item Addition Checklist
When adding a new reusable layout, presentational element, or interactive control:
- [ ] **No Hardcoded Styles**: Component conforms to dynamic theme tokens (no static slate/gray text or backgrounds).
- [ ] **Blog Mode Compliance**: Backgrounds and borders are stripped in Blog Mode, and layout stacks cleanly on mobile devices.
- [ ] **Single Responsibility Principle (SRP)**: Keep each element small and focused on a single logical duty or drawing.
- [ ] **Separation of UI & Logic**: Keep presentational UI logic separate from orchestration logic (no data fetching or store integrations in elements).
- [ ] **Type Safety & Parameterization**: Props interface is explicitly defined and exported. SVG coordinates, dimensions, and visual states are parameterized.
- [ ] **Skill & Reference Update**: Update `SKILL.md` and the appropriate reference document (`layouts.md`, `presentational-elements.md`, or `interactive-controls.md`) with the new component's description, prop signatures, code snippet, and best practices.

### B. Slide Creation Checklist
When authoring or modifying slides:
- [ ] **Visual-First Layouts**: Minimal text is used; layouts prefer visual graphics, dynamic flowcharts, or diagrams over flat bullet lists.
- [ ] **Integrated Interactive Drawings**: Drawings are integrated directly into the slides where they are described, using click-to-reveal step highlights synchronized with the text bullets. The same drawing component is reused on sandbox/calculation slides.
- [ ] **Progressive Highlights**: Physical structures, cross-sections, elevations, or dimensional bounds are rendered dynamically and highlighted step-by-step using click reveals/highlights instead of static text blocks.
- [ ] **Eye-catching Elements**: Use bold/large numbers for calculation outputs, paint-over highlighter animations (`<ClickHighlight variant="paint">`), and transition-linked graphics.
- [ ] **Data Reference Standards**: Official project documentation (e.g., PWD specifications) is prioritized, with precise sessional citations provided for estimation constants.
- [ ] **Modularity & Reusability**: Slide elements are deconstructed into reusable components rather than hardcoding layouts, SVGs, or custom content directly inside individual slide files.
- [ ] **Layout Delegation**: Headers/footers delegated to `<LayoutHeader>` and `<LayoutFooter>` to guarantee transitions.
- [ ] **Semantic Presentational Elements**: No raw HTML `<p>`, `<ul>`, `<li>`, or `<table>` tags are used; use `<SlideParagraph>`, `<SlideBullet>`, `<SlideTable>`, etc.
- [ ] **SVG & Drawings Separation**: No raw SVG markup is coupled directly inside the slide file. Drawings are imported as reusable components and driven by JSON parameters.
- [ ] **Drawing Wrapper Heights**: Outer drawing card containers do not define hardcoded `h-full` height constraints, allowing them to scale dynamically via parent flex boundaries when stacked with formulas/notes.
- [ ] **Cross-Window Sync**: All interactive parameters and values (inputs, sliders, dropdown choices) are declared via `useUrlSyncedState` (not `useState`).
- [ ] **Draggables**: Every draggable element is assigned a stable, explicit string for `syncKey`.
- [ ] **Theme Contrast**: Slide content is fully readable in both Light and Dark modes.


### C. Technical Compliance Details
#### Dynamic Theme Compliance
- [ ] **No Static Grays/Slates**: Verify that no container or component wraps content with static colors like `bg-slate-900`, `bg-gray-800`, or `border-white/10`.
- [ ] **Standard Design Tokens**: Use `bg-muted/60 dark:bg-muted/20 border border-border/40 rounded-xl` for slide containers, and standard button style tokens like `bg-muted border-border/50 text-foreground hover:bg-muted/80`.
- [ ] **Light Mode Contrast**: Test slide elements in both light and dark modes to guarantee text (e.g., inside morphing code headers or text inputs) remains readable.

#### Mode Adaptation (Slide vs. Blog Mode)
- [ ] **Strip Backgrounds**: Verify components strip backgrounds (`bg-transparent`), borders, and drop-shadows when `viewMode === 'blog'`.
- [ ] **No Hardcoded card classes in Lectures**: Ensure slide files inside `src/lectures/` do not define custom structural containers. Delegate them to reusable layouts and interactive cards.
- [ ] **Responsive Stacking**: Grid columns and parameter panels must fold vertically on mobile screen viewports (using `flex flex-col md:flex-row`).

#### State Synchronization
- [ ] **Cross-Window Sync**: Verify that any value that can change based on user interactions (inputs, preset buttons, sandbox parameters, toggles) is declared via `useUrlSyncedState`.
- [ ] **Stable syncKeys**: Ensure every draggable widget has a stable, explicit string declared for `syncKey`.
- [ ] **No Infinite Loops**: Verify that default values passed to hooks do not trigger infinite rendering loops. Avoid updating state parameters inside render paths.

