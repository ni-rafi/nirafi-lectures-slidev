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

## 3. Slide Layouts & Presentational elements

### 3.1 Layout Selection Standards
To ensure a consistent look and smooth transitions, select the appropriate layout from `src/shared/layouts/`:
* **Main Cover Slide (Slide 1)**: Use `<TitleV2Layout>` for the main cover page.
* **Topic/Section Opener Divider Slides**: Use `<TopicDividerLayout>` (imported from `@/shared/layouts/TopicDividerLayout`) for slides introducing a new topic or section within the deck. Do not use `<TitleLayout>` or `<TitleV2Layout>` for internal topic dividers.
* **Content Slides**: Use `<FullWidthLayout>` or `<TwoColumnLayout>` for regular content slides.
* **Grid Layouts**: Use `<GridLayout>` for matrix structures like quiz galleries.

> [!IMPORTANT]
> **Header & Footer Delegation**: All layouts must delegate their headers and footers to the dedicated `<LayoutHeader>` and `<LayoutFooter>` components in `src/shared/layouts/components/` to guarantee smooth, synchronized transition animations (using `.slide-header-title` and `.slide-layout-footer`).

### 3.2 Semantic Presentational Elements
Standardize content representation. Do NOT use raw HTML tags (`<ul>`, `<li>`, `<p>`, `shadowed borders`) for presentation slides. Use semantic elements under `src/features/presentation/components/elements/`:
* Use `<SlideBullet>` for lists and bullets.
* Use `<SlideParagraph>` for slide paragraph styling.
* Use `<SlideEquation>` or `<LatexFormula>` for mathematical equations, adhering to flat, unshadowed container styles.
* Use `<SlideContent>` to automatically map a structured configuration array to paragraphs, lists, and equations.

---

## 4. Declarative Schema-Driven Customization

For standard lecture slides, customize content using the declarative **Slide Schema** configuration pattern rather than raw JSX. The polymorphic `<SlideSchemaEngine>` parses structured configurations and inflates layout elements automatically.

### 4.1 Schema Configurations
* **`rich-paragraph`**: Renders `<SlideParagraph>` with highlights.
  ```typescript
  element: {
    type: 'rich-paragraph',
    data: {
      fragments: [
        'Estimating concrete requires ',
        { highlight: 'isolating total volume', at: 1, variant: 'paint' },
        ' to prevent shortages.'
      ]
    }
  }
  ```
* **`list`**: Renders `<SlideList>` with stagger reveals.
  ```typescript
  element: {
    type: 'list',
    config: { revealMode: 'each-click' },
    data: {
      listTitle: 'Measurement Guidelines',
      items: [
        { title: 'Slab Thickness:', text: 'Maintain a 0.150m minimum bound.' },
        { title: 'Calculation Precision:', text: 'Round outputs to 3 decimals.' }
      ]
    }
  }
  ```
* **`table`**: Renders `<SlideTable>` with header reveals and cell-level highlights.
  ```typescript
  element: {
    type: 'table',
    config: { striped: true, bordered: true },
    data: {
      headers: [
        { label: 'Code', align: 'left' },
        { label: 'Qty', align: 'right' },
        { label: 'Rate ($)', align: 'right', revealAt: 2 }
      ],
      rows: [
        [ '1.1', <ClickHighlight at={1}>12.500</ClickHighlight>, <ClickReveal at={3}>120.00</ClickReveal> ]
      ]
    }
  }
  ```
* **`latex`**: Renders `<LatexFormula>` formula parts.
  ```typescript
  element: {
    type: 'latex',
    config: { title: 'Standard Formula' },
    data: {
      formulaParts: [
        'W = ',
        { highlight: '\\\\frac{d^2}{162} \\\\times L', at: 2, variant: 'text' }
      ]
    }
  }
  ```
* **`quiz`**: Renders classroom interactive assessments synced with Firebase.
  ```typescript
  element: {
    type: 'quiz',
    config: { quizId: 'brick_lec2_q1', quizType: 'numeric-input' },
    data: { question: 'What is the volume of a standard brick?', correctAnswer: '1900000' }
  }
  ```

> [!TIP]
> **Single Source of Truth**: Refer to the actual code definitions, schema examples, and copy-pasteable configurations directly in the Developer Guide source files under [src/features/docs/dev-guide/](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/):
> * Paragraphs: [ParagraphsSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/ParagraphsSection.tsx)
> * Lists: [ListsSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/ListsSection.tsx)
> * Tables: [TablesSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/TablesSection.tsx)
> * Formulas: [FormulasSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/FormulasSection.tsx)
> * Quizzes: [QuizzesSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/QuizzesSection.tsx)
> * Inputs: [InputsSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/InputsSection.tsx)
> * Schema Engine: [SchemaEngineSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/SchemaEngineSection.tsx)

---

## 5. Interactive Customization & Highlighting

### 5.1 Highlight Variants
Use `<ClickHighlight>` with the `variant` prop to customize interactive text highlighting:
* **`text`** (Default): Transitions the text color to primary (accent hue) and increases font weight to bold. This is strictly `inline` (not block or inline-block) to guarantee it flows naturally with normal paragraph text without collapsing whitespace.
* **`paint`**: An animated highlighter pen drawing effect. Draws a soft color background (e.g., yellow/amber) from left to right.
* **`rect`**: A soft, rounded rectangular border and background (like a subtle badge) wrapped around the target word or phrase.
* **`bold`**: Transitions font-weight to bold/emphasis.
* **`strike`**: Draws a line-through strikeout on activation. Used for comparing obsolete values or showing correction steps.

### 5.2 Layout & Inline Flow Rules
To prevent words from sticking together:
* **Always use `inline` display** for inline text highlights (`text`, `paint`, `strike`). Avoid `inline-block` or `transform: scale()` on running inline text since it alters baseline alignment and collapses adjacent space nodes.
* Add space characters directly inside or outside the component tags, ensuring standard JSX spacing:
  ```tsx
  <span>
    Estimating concrete requires{' '}
    <ClickHighlight at={1} variant="paint">isolating volumetric cubic meters</ClickHighlight>{' '}
    from internal constants.
  </span>
  ```

### 5.3 Click-Reveal Behaviors
* **Default Visibility (`revealMode: 'none'`)**: By default, paragraph blocks render statically immediately on slide load (at step 0). Use this for section headers, column headings, and descriptive text block introductions.
* **Inline Highlight Sequence**: If a paragraph contains `<ClickHighlight>` elements (e.g. at step 1, 2, etc.), leave the paragraph's `revealMode` at its default (`'none'`) so that the paragraph text is visible on load, and subsequent clicks only trigger the highlights in sequence.
* **Explicit Click Reveals**: If you explicitly want a paragraph to hide initially and reveal on click, specify a `revealAt` property (e.g. `revealAt={1}` or `revealAt="+1"`) or set `revealMode: 'all-click'`.

### 5.4 Separation of Drawings and SVGs
To maintain clean slide definitions and support reusability:
* **Separation of Concerns**: Drawings such as SVGs must be separated from slides. Do not couple raw SVG code inside the slide files.
* **Reusable Components**: Place drawings in reusable component locations (subject-specific drawings in `src/subjects/{subjectName}/features/components/` and global drawings in `src/shared/components/` or `src/features/presentation/components/elements/`).
* **Parameterization**: Pass dynamic properties (like dimensions or state) as JSON parameters/props to the drawing component rather than hardcoding values inside the drawing itself.

---

## 6. Reusable Parameter Panels & State Sync

### 6.1 Strict Reusability Rule
Handcoding custom CSS, double card frames, or tailwind layouts (like `bg-card`, `bg-muted/60`, or absolute decorative hooks) directly inside slide files is strictly prohibited. To support Blog Mode natively, all parameter panel containers, inputs, and outputs must be rendered using unified reusable components:
* Use `<InteractiveCard>` for wrapping parameter adjustment inputs.
* Use `<ParameterSlider>` for slider controls and values formatting.
* Use `<CalculationOutput>` for rendering the calculation results.

### 6.2 Mode Adaptation (Slide Mode vs. Blog Mode)
* **Background Elimination in Blog Mode**: When `viewMode === 'blog'`, all background colors (`bg-card`, `bg-muted`), drop-shadows, and powerpoint-style absolute hooks must be stripped (`bg-transparent`).
* **Context Awareness**: Components must consume `PresentationContext` to detect `viewMode === 'blog'`.
* **No Hardcoded card classes in Lectures**: Slide decks under `src/lectures/` must never write hardcoded presentation containers like `bg-card`, `bg-muted/60`, `shadow-sm`, or absolute corner hooks. They must delegate layout and backgrounds to reusable element components.

### 6.3 Responsiveness & Stacking Rules
To guarantee visual excellence on mobile viewports and tablets in Blog Mode:
1. **Vertical Stacking**: Multi-column layouts must stack vertically on mobile screens using responsive classes (`flex flex-col md:flex-row` or `grid grid-cols-1 md:grid-cols-2`). Never force side-by-side grids on screen widths `< 768px` in Blog Mode.
2. **Padding Scaling**: Presentation slide margins (e.g., `p-6` or `p-8`) must contract to standard mobile article paddings (`p-3 md:p-5`) to avoid text clipping and save vertical space.
3. **Text Autoscaling**: Outputs (like `<CalculationOutput>`) must use fluid size steps (`text-2xl md:text-3xl`) to remain clean on compact phone layouts.
4. **Input Accessibility**: Slider tracks must stretch to full width (`w-full`) with large touch targets, while labels stay wrapped (`flex-col sm:flex-row sm:justify-between`) to ensure readability on smaller screens.

### 6.4 Cross-Window State Synchronization (`useUrlSyncedState`)
To sync interactive parameters, physics values, and widget states across presenter and follower screens:
1. **Hook Invocation**: Use `useUrlSyncedState<T>(key, defaultValue)` instead of React's standard `useState`.
2. **Object and Array Synchronization**:
   - The storage system natively supports JSON serialization for complex values like options, presets, configurations, and structures.
   - **Crucial Rule for Objects/Arrays**: If passing an object literal or array literal as the `defaultValue` parameter, the hook automatically wraps it in a ref internally to prevent infinite re-render loops. However, it is a best practice to keep default parameters static or memoized.
3. **State Updaters**: The synced setter function supports both raw value inputs and functional updaters (`setState(prev => ({ ...prev, [key]: val }))`).
4. **Stable syncKey for Draggables**: Always provide a stable, unique `syncKey` string to draggable components (`<Draggable>` or `<DraggableArrow>`) to distinguish their positions inside the scoped slide space.

---

## 7. Chart Components (Bklit UI)

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
