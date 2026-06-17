# React Slide Presentation Feature Roadmap

This document outlines the presentation features to be migrated and implemented natively inside our React 19 codebase. Each feature references the original Slidev documentation for requirements and details.

---

## 1. Core Presentation Engine
- [x] **Slide Zoom & Scale**
  - Adapts slides to window aspect ratios without layout breaks using a custom `ResizeObserver` listener and CSS transforms.
  - Details: [zoom-slide.md](../../docs-slidev/features/zoom-slide.md) (Implemented: `useSlideScale.ts` & `SlideContainer.tsx`)
- [x] **Canvas Size Configuration**
  - Support standard 16:9 widescreen or custom aspects scaled automatically.
  - Details: [canvas-size.md](../../docs-slidev/features/canvas-size.md) (Implemented: `SlideContainer.tsx` with aspect-ratio bounding boxes)
- [x] **Global Layer Templates**
  - Persistent headers, footers, page numbering, and progress indicators across slide pages.
  - Details: [global-layers.md](../../docs-slidev/features/global-layers.md) (Implemented: `GlobalTop.tsx`, `GlobalBottom.tsx` overlays)
- [x] **SEO & Metadata**
  - Render descriptive headers and update browser tab titles dynamically.
  - Details: [seo-meta.md](../../docs-slidev/features/seo-meta.md) (Implemented: `PageMetadata.tsx` side effect component)

---

## 2. Animation & Interaction
- [x] **Click Steps (v-click)**
  - Reveal sub-elements on a slide incrementally before changing slide.
  - Details: [click-marker.md](../../docs-slidev/features/click-marker.md) (Implemented: `ClickStepsContext.tsx`, `useClickSteps.ts`, `ClickReveal.tsx`, and `ClickRevealGroup.tsx`)
- [x] **Draggable Elements**
  - Interactive components that can be dragged on-screen (e.g. for drag-and-drop Estimator exercises).
  - Details: [draggable.md](../../docs-slidev/features/draggable.md) (Implemented: `Draggable.tsx` pointer coordinator & `DraggableArrow.tsx`)
- [x] **Drawing & Annotation Board**
  - Let presenters draw or highlight key slide areas with cursor/stylus.
  - Details: [drawing.md](../../docs-slidev/features/drawing.md) (Implemented: `DrawingBoard.tsx` & `DrawingToolbar.tsx`)

---

## 3. High-Quality Code Display & Playground
- [x] **Code Block Line Numbering**
  - Display prefix numbers for raw code examples.
  - Details: [code-block-line-numbers.md](../../docs-slidev/features/code-block-line-numbers.md) (Implemented: `CodeBlock.tsx` startLine offsets)
- [x] **Line-level Highlighting**
  - Focus attention on specific lines inside a code snippet.
  - Details: [line-highlighting.md](../../docs-slidev/features/line-highlighting.md) (Implemented: `CodeBlock.tsx` click-synced opacity focus states)
- [x] **Shiki Magic Move**
  - Perform fluid morphing transitions between code iterations.
  - Details: [shiki-magic-move.md](../../docs-slidev/features/shiki-magic-move.md) (Implemented: `CodeMagicMove.tsx` animations)
- [x] **Monaco Run & Write Playground**
  - Embed dynamic execution terminals and text editors inside slides.
  - Details: [monaco-editor.md](../../docs-slidev/features/monaco-editor.md), [monaco-run.md](../../docs-slidev/features/monaco-run.md), [monaco-write.md](../../docs-slidev/features/monaco-write.md) (Implemented: `CodePlayground.tsx` runners & diff comparison grids)

---

## 4. Mathematics & Diagram Rendering
- [ ] **LaTeX Formulas**
  - High-fidelity formatting of mathematical formulas (crucial for structural calculations).
  - Details: [latex.md](../../docs-slidev/features/latex.md)
- [ ] **Mermaid Diagram Flowcharts**
  - Render dynamic layouts and flowcharts.
  - Details: [mermaid.md](../../docs-slidev/features/mermaid.md)
- [ ] **Icon Libraries**
  - Integrate icons sets directly in Markdown layouts.
  - Details: [icons.md](../../docs-slidev/features/icons.md)

---

## 5. Presenter Tools
- [ ] **Presentation Timer**
  - Elapsed and budget countdown trackers for lecturers.
  - Details: [timer.md](../../docs-slidev/features/timer.md)
- [ ] **Screen & Audio Recorder**
  - Save lectures as webm records directly from the viewer dashboard.
  - Details: [recording.md](../../docs-slidev/features/recording.md)
