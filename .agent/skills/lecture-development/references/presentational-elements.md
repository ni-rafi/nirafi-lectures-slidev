# Slide Presentational Elements Reference Guide

This document lists every presentational element available in `src/features/presentation/components/elements/`, detailing their TypeScript props, usage examples, and best practices.

---

## 1. Text & Layout Blocks

### SlideParagraph
Standard text blocks with borders, highlights, and sessional layout variants.
* **Props**:
  * `title?: string`, `text?: ReactNode`, `children?: ReactNode`
  * `paragraphs?: Array<ReactNode | string>`
  * `revealMode?: 'each-click' | 'all-click' | 'auto-stagger' | 'none'`
  * `variant?: 'info' | 'warning' | 'error' | 'success' | 'callout' | 'plain' | 'default'`
* **Example**:
  ```tsx
  <SlideParagraph title="Note" text="Round decimals to 3 places." variant="info" />
  ```
* **Best Practice**: Use `variant="info"` or `variant="warning"` for warnings/notes.

### SlideBullet & SlideList
Bullet list items with reveal steps.
* **Props**:
  * `text: ReactNode`, `revealAt?: number | string`
  * `items: Array<{ title?: string; text: ReactNode; icon?: string }>` (for `SlideList`)
  * `revealMode?: 'none' | 'each-click'` (for `SlideList`)
* **Example**:
  ```tsx
  <SlideList revealMode="each-click" items={[{ text: "BFS bedding" }, { text: "CC footing" }]} />
  ```

### SlideTwoColumns & SlideGrid
Splits slide content in sub-grid sections.
* **Props**:
  * `left: ReactNode`, `right: ReactNode`, `ratio?: '50-50'|'40-60'|'60-40'`
  * `cols?: 2 | 3 | 4` (for `SlideGrid`)
* **Example**:
  ```tsx
  <SlideTwoColumns left={<p>Left</p>} right={<p>Right</p>} ratio="40-60" />
  ```

### SlideCallout & SlideBadge
Highlight labels and alert boxes.
* **Props**:
  * `title?: string`, `variant?: 'info' | 'warning' | 'error' | 'success' | 'default'`
  * `children?: ReactNode`
* **Example**:
  ```tsx
  <SlideCallout variant="warning">Excavation requires bracing.</SlideCallout>
  ```

### SlideQuote
Displays block quotes or student advice.
* **Props**:
  * `quote: string`, `author?: string`, `citation?: string`
* **Example**:
  ```tsx
  <SlideQuote quote="Measure twice, cut once." author="Proverb" />
  ```

### SlideImage
Renders standard web images with auto-scale layout.
* **Props**:
  * `src: string`, `alt?: string`, `caption?: string`, `maxWidth?: string`
* **Example**:
  ```tsx
  <SlideImage src="/img.png" caption="Excavation site" maxWidth="400px" />
  ```

---

## 2. Mathematical & Tabular Components

### SlideEquation & LatexFormula
Equations and inline math formatting using KaTeX.
* **Props**:
  * `math: string`, `revealAt?: number | string`
* **Example**:
  ```tsx
  <SlideEquation math="V = L \times W \times H" />
  ```

### SlideTable
Tables with reveal columns and inline cell-level highlights.
* **Props**:
  * `headers: Array<string | { label: string; align?: 'left'|'center'|'right'; revealAt?: number }>`
  * `rows: Array<Array<ReactNode>>`
  * `striped?: boolean`, `bordered?: boolean`
* **Example**:
  ```tsx
  <SlideTable headers={['Step', 'Qty']} rows={[['1.1', <ClickHighlight at={1}>12.500</ClickHighlight>]]} />
  ```

### FormulaBreakdown
Breaks down math formulas into sessional stages.
* **Props**:
  * `title?: string`
  * `steps: Array<{ label: string; formula: string; explanation: string }>`
* **Example**:
  ```tsx
  <FormulaBreakdown steps={[{ label: "Volume", formula: "L * W * H", explanation: "Total soil" }]} />
  ```

---

## 3. Code & Diagram Components

### CodeBlock & CodePlayground & CodeMagicMove
Syntax highlights and live sandbox editors.
* **Props**:
  * `code: string`, `language?: string`, `title?: string`
  * `files?: Record<string, string>` (for `CodePlayground`)
* **Example**:
  ```tsx
  <CodeBlock code="const a = 12.5;" language="typescript" />
  ```

### MermaidDiagram
Renders flowcharts and network graphs.
* **Props**:
  * `chart: string`, `className?: string`
* **Example**:
  ```tsx
  <MermaidDiagram chart="graph TD; A-->B;" />
  ```

---

## 4. Visual Progress & Canvas Components

### SlideStepProgress & SlideTimeline
Visual progress indicators for sessional tasks.
* **Props**:
  * `currentStep: number`, `steps: string[]`
  * `items: Array<{ title: string; date?: string; text: string }>` (for `SlideTimeline`)
* **Example**:
  ```tsx
  <SlideStepProgress currentStep={2} steps={['Excavation', 'CC base', 'Brickwork']} />
  ```

### SlideCompare
Slider-driven before-after slide comparison view.
* **Props**:
  * `leftImage: string`, `rightImage: string`, `leftLabel?: string`, `rightLabel?: string`
* **Example**:
  ```tsx
  <SlideCompare leftImage="/excavation.png" rightImage="/backfill.png" />
  ```

### SlideVisualCanvas
Canvas container for complex interactive SVGs or shapes.
* **Props**:
  * `width?: number`, `height?: number`, `children: ReactNode`
* **Example**:
  ```tsx
  <SlideVisualCanvas width={800} height={400}>
    <rect x={10} y={10} width={100} height={100} fill="red" />
  </SlideVisualCanvas>
  ```

### SlideIcon
Dynamic sessional icons loader.
* **Props**:
  * `name: string`, `className?: string`
* **Example**:
  ```tsx
  <SlideIcon name="Shovel" className="h-6 w-6 text-primary" />
  ```

---

## 5. Syllabus & Course Outline Components

Syllabus components are imported from `@/features/outline/components/` and decouple course details from presentation layout structures.

### HighlightableList
Displays learning outcomes, dynamically highlighting covered items based on presentation steps.
* **Props**:
  * `items: Array<{ id: number; description: string }>`
  * `highlightedIds?: number[]`
  * `listTitle?: string`
  * `badgePrefix?: string` (Default: `'CO'`)
* **Example**:
  ```tsx
  <HighlightableList items={[{ id: 1, description: 'Compute concrete grade volumes.' }]} highlightedIds={[1]} />
  ```

### MasterDetailPanel
Renders a split list of chapters (master) and detailed outline descriptions (detail).
* **Props**:
  * `items: Array<{ id: number; title: string; description: string }>`
  * `activeIds?: number[]`
  * `panelTitle?: string`, `detailHeader?: string`, `badgePrefix?: string`
* **Example**:
  ```tsx
  <MasterDetailPanel items={[{ id: 1, title: 'Earthwork', description: 'Excavation volumes...' }]} activeIds={[1]} />
  ```

### InteractiveScheduleTable
Generates calendar outlines with sessional milestones and strategy tooltips.
* **Props**:
  * `part: 1 | 2`
  * `schedule: any[]`, `tlLegends: any[]`, `assessmentLegends: any[]`, `outcomes: any[]`, `contents: any[]`
* **Example**:
  ```tsx
  <InteractiveScheduleTable part={1} schedule={weeks} tlLegends={strategies} ... />
  ```

### ReferenceLegends & ReferenceBooksList
Displays glosseries/legends side-by-side or recommended course textbooks.
* **Props**:
  * `leftLegends: any[]`, `rightLegends: any[]` (for `ReferenceLegends`)
  * `references: Array<{ id: number; title: string; author: string; edition: string; publisher: string }>` (for `ReferenceBooksList`)
* **Example**:
  ```tsx
  <ReferenceBooksList title="Textbooks" references={booksArray} />
  ```

