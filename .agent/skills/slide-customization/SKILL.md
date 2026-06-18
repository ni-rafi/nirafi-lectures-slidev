---
name: slide-customization
description: Guides customizing and using interactive elements like paragraphs, bullets, equations, tables, and click highlights in slide decks.
---

# Slide Customization and Interactive Highlighting Standard

This skill defines the patterns, markup, and styles for customizing slide body components (paragraphs, bullets, list items, tables, equations) and applying inline highlighting.

---

## 1. Interactive Highlighting (`<ClickHighlight>`)

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
