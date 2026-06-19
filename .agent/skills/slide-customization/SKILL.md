---
name: slide-customization
description: Guides customizing and using interactive elements like paragraphs, bullets, equations, tables, and click highlights in slide decks.
---

# Slide Customization and Interactive Highlighting Standard

This skill defines the patterns, markup, and styles for customizing slide body components (paragraphs, bullets, list items, tables, equations) and applying inline highlighting.

---

## 0. Declarative Schema-Driven Customization (Recommended)

For standard lecture slides, customize content using the declarative **Slide Schema** configuration pattern rather than raw JSX. The polymorphic `<SlideSchemaEngine>` parses structured configurations and inflates layout elements automatically:

### 0.1 Element Types in Schema

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
> **Single Source of Truth**: When building slides or writing schemas, the AI agent and developers can inspect the actual code definitions, schema examples, and copy-pasteable configurations directly in the Developer Guide source files under [src/features/docs/dev-guide/](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/):
> * For paragraph options & formatting: [ParagraphsSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/ParagraphsSection.tsx)
> * For list reveal modes & item properties: [ListsSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/ListsSection.tsx)
> * For table alignment, cell highlights, & column reveals: [TablesSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/TablesSection.tsx)
> * For math formula structures: [FormulasSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/FormulasSection.tsx)
> * For classroom quizzes: [QuizzesSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/QuizzesSection.tsx)
> * For slider inputs & calculators: [InputsSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/InputsSection.tsx)
> * For schema engine registry and parser definitions: [SchemaEngineSection.tsx](file:///d:/Websites/nirafi-lectures-slidev/src/features/docs/dev-guide/SchemaEngineSection.tsx)
>
> If you are an AI coding assistant, **always view the relevant guide file** to inspect the supported properties, variables, and UI layouts before implementing slide changes or composing new slides. Humans can also access these interactively by running `npm run dev` and navigating to the Workspace Hub's **Developer Guide** (`?tab=dev`).

---

## 1. Interactive Highlighting (Hybrid/JSX Reference)

Highlighting should be native and fluid, supporting both inline text flow and custom designs (paintbrush highlights, soft rectangular badges, text coloring, and strike-throughs).

### 1.1 Highlight Variants
Use the `variant` prop to change the styling and layout behaviour of the highlight:

* **`text`** (Default): Transitions the text color to primary (accent hue) and increases font weight to bold. This is strictly `inline` (not block or inline-block) to guarantee it flows naturally with normal paragraph text without collapsing whitespace.
* **`paint`**: An animated highlighter pen drawing effect. It draws a soft color background (e.g., yellow/amber) behind the text from left to right on activation.
* **`rect`**: A soft, rounded rectangular border and background (like a subtle badge) wrapped around the target word or phrase.
* **`bold`**: Transitions font-weight to bold/emphasis.
* **`strike`**: Draws a line-through strikeout on activation. Used for comparing obsolete values or showing correction steps.

### 1.2 Layout & Inline Flow Rules
To prevent words from sticking together (e.g., preventing `metersfrom` rendering issues):
* **Always use `inline` display** for inline text highlights (`text`, `paint`, `strike`). Avoid `inline-block` or `transform: scale()` on running inline text since it alters baseline alignment and collapses adjacent space nodes.
* Add space characters directly inside or outside the component tags, ensuring standard JSX spacing:
  ```tsx
  {/* Correct spacing: flows normally and preserves spaces */}
  <span>
    Estimating concrete requires{' '}
    <ClickHighlight at={1} variant="paint">isolating volumetric cubic meters</ClickHighlight>{' '}
    from internal constants.
  </span>
  ```

---

## 2. Component Guidelines & Examples

### 2.1 Native Highlighting in Paragraphs and Bullets
Slide paragraph and bullet components accept `React.ReactNode` in their `text` or `children` properties. Wrap target words in JSX.

```tsx
<SlideParagraph
  title="Calculation Principle"
  text={
    <span>
      Estimating structural concrete requires{' '}
      <ClickHighlight at={1} variant="text">
        isolating total volumetric cubic meters
      </ClickHighlight>{' '}
      from internal rebar steel displacement constants.
    </span>
  }
/>
```

### 2.2 Table Highlight Integration
Table cells natively accept `React.ReactNode`. You can highlight specific cells, numbers, or headers by nesting `<ClickHighlight>` inside the `rows` cell arrays:

```tsx
<SlideTable
  headers={['Item No', 'Description', 'Qty', 'Unit']}
  rows={[
    [
      '1.1',
      'Concrete cast in situ for columns',
      <ClickHighlight at={2} variant="paint">12.500</ClickHighlight>,
      'm³'
    ]
  ]}
/>
```

### 2.3 Math & Equation Step Highlights
Instead of editing mathematical strings in raw LaTeX (which breaks KaTeX parser), split the formulation into sub-components or wrap relevant parts of the layout using `<ClickHighlight>` nested with `<LatexFormula>` nodes:

```tsx
<div className="flex items-center gap-1.5 justify-center py-2 select-text">
  <LatexFormula math="V = L \times W \times H \times" />
  <ClickHighlight at={2} variant="text">
    <LatexFormula math="(1 + \text{wastage})" />
  </ClickHighlight>
</div>
```

---

## 3. Sandbox Parameter Panels

> [!IMPORTANT]
> **Strict Reusability Rule**: Handcoding custom CSS, double card frames, or tailwind layouts (like `bg-card`, `bg-muted/60`, or absolute decorative hooks) directly inside slide files is strictly prohibited. To support Blog Mode natively, all parameter panel containers, inputs, and outputs must be rendered using unified reusable components:
> * Use `<InteractiveCard>` for wrapping parameter adjustment inputs.
> * Use `<ParameterSlider>` for slider controls and values formatting.
> * Use `<CalculationOutput>` for rendering the calculation results.
>
> Refer to the [reusable-components skill guide](file:///.agent/skills/reusable-components/SKILL.md) for detailed components interfaces and mode adaptation patterns.

---

## 4. Chart Components (Bklit UI)

To incorporate high-fidelity, animated charts from the Bklit UI library without editing the copied source files under `src/features/presentation/components/elements/bklit/`:
* **Aspect Ratio & Height Bounds**: Wrap the chart (e.g. `<CurvedLineChart>`) in a width-constrained container (e.g. `<div className="w-full max-w-[700px] mx-auto">`). Because the chart enforces a `2:1` aspect ratio internally, limiting its parent width automatically limits its height (e.g., to `350px`), preventing bottom viewport overflow on standard 16:9 screens.
* **Theme Color Consistency**: Chart colors automatically map to `--chart-1` through `--chart-5` custom variables. These variables are defined dynamically per-theme in `src/styles/charts.css` to match active lecture styles (e.g., green for Quantity Surveying, blue for Web Development). Do not hardcode colors in the chart invocation.

