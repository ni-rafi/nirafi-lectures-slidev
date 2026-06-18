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

Parameter adjusters (live sliders) must consistently follow a premium PowerPoint card aesthetic with an ash background and primary colored left border hook highlights:

```tsx
<div className="relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium space-y-4 text-left before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary">
  <div className="font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 border-b border-border/40 pb-1.5 uppercase select-none">
    Parameters (SI Meters)
  </div>
  {/* Sliders go here */}
</div>
```
