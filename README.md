# nirafi-workspace: Civil Engineering Lecture Slides & Calculations Platform

A centralized platform containing interactive lecture decks for civil engineering (and web development) topics, backed by a modular, unit-tested calculation engine, Firebase Firestore integration, an adaptive slide layout component library, and a declarative schema-driven slide engine.

> **Interactive documentation lives inside the app.** After signing in, open the **Workspace Hub & Guides** at the `/docs` route for a live User Guide and Developer Guide — each developer section ships a split live-preview + editable code playground so you can see and tweak every component in place.

## Key Features

### 1. Presentation Component Library (Adaptive Layouts)
A set of mode-aware presentation components that automatically adapt their rendering between **Slide/Presenter Mode** and **Blog Mode** (stacking columns vertically, stripping backgrounds, shadows, and absolute positioning for scroll-oriented reading):
- **Layouts**: `<SlideTwoColumns>`, `<SlideGrid>` (1-4 columns, auto-collapsing on mobile).
- **Text & Lists**: `<SlideParagraph>`, `<SlideBullet>`, `<SlideList>` (supporting `each-click`, `all-click`, and `auto-stagger` reveals).
- **Accents**: `<SlideQuote>`, `<SlideBadge>`, `<SlideCallout>` (info, warning, error, success variants).
- **Visuals**: `<SlideImage>` (flat, caption-ready image component), `<SlideTimeline>`, `<SlideStepProgress>`.
- **Comparisons**: `<SlideCompare>` side-by-side panels and `<ClickHighlight>` spotlights.

### 2. Declarative Schema-Driven Slide Engine (`<SlideSchemaEngine>`)
Eliminate boilerplate component creation by writing slides as plain, type-safe configuration objects (`SlideSchema[]`). The engine parses each slide's `layout` and `props` and inflates the correct adaptive elements (rich paragraphs, LaTeX formulas, tables, calculators) inside responsive layout wireframes. For complex interactive pages, a **hybrid strategy** mixes schema-driven slides with raw React "sandbox" components inside the same deck registry. See the in-app Developer Guide → *Schema Engine* and *Lecture Composition*.

### 3. Visual Shape Builder Playground
A multi-page, admin-only visual designer (routed under `/playground/:subjectId/:sessionId/:lectureId/shapes`) for composing vector shape scenes — supports custom polygons, corner radius controls, snapping, dimension lines, beam loads/supports, and per-shape color/dimension inspectors. Designer state is persisted to Firestore, and the canvas exports shapes back into the schema engine.

### 4. Interactive Calculations & URL Syncing (`useUrlSyncedState`)
- Synchronize estimate values and calculation parameters directly with the browser URL query parameters (e.g., `?s3.length=6.000`).
- Scoped automatically by slide index (e.g., `s3.thickness` vs `s4.thickness`) to prevent variable collisions when navigating slides.
- Integrates cleanly with `<InteractiveCard>`, `<ParameterSlider>`, and `<CalculationOutput>` components.

### 5. Step-by-Step Table Reveals & Animations
- **Dynamic Columns**: Adds column headers and cell columns on specific click steps using the `revealAt` property inside table header objects.
- **Smooth Transition CSS**: Hidden columns use zero-width, zero-padding, zero-border, and hidden overflow styling, sliding open and fading in seamlessly via a CSS transition-all curve.
- **Cell Data Filling**: Fills specific table cells on click using nested `<ClickReveal>` triggers.
- **Cell Highlights**: Spotlights key quantities or calculations using `<ClickHighlight>`.

### 6. Course Portal, Roles & Lecture Dashboard
- **Subject & Session Selectors**: Centralized dashboard routing to filter lectures by specific subjects, academic sessions, and individual lecture decks.
- **Roll-Number Identification Gate**: Students identify via roll number before accessing any deck; lecture access is further gated by an activation/lock status (admins bypass locks).
- **Role-Based Routes**: Admin-only surfaces (class analytics dashboard, the shape builder playground) are guarded and redirect unauthorized users back to the portal.
- **Flexible View Modes**: Toggles any loaded lecture deck dynamically between **Slide Mode** (presentation-style viewport) and **Blog Mode** (full-height vertical reading mode) for print or scroll access.
- **Document Exporting & PDF Prints**: Custom styling templates allowing slide cards to be exported smoothly to static PDFs or printable lecture handouts.

---

## Directory Layout

```text
├── .agent/         # AI Agent rules & skills (AGENTS.md)
├── export/         # Slide export artifacts (tsx-txt)
├── src/
│   ├── assets/     # Logos and static images
│   ├── components/ # Shared UI primitives (shadcn-based)
│   ├── config/     # App configuration
│   ├── context/    # Global React contexts (user, lecture status)
│   ├── cores/      # Pure business logic (QS calculations, user validations)
│   ├── features/   # Domain feature modules
│   │   ├── docs/               # In-app User & Developer guides (live playgrounds)
│   │   ├── gate/               # Roll-number identification gate
│   │   ├── portal/             # Lecture dashboard & admin class views
│   │   ├── presentation/       # Slide player, schema engine, elements, tools
│   │   │   ├── components/elements/   # Adaptive slide elements (table, grid, shapes)
│   │   │   ├── components/slides/     # SlideSchemaEngine
│   │   │   ├── components/tools/      # Timer, recorder, shape builder playground
│   │   │   ├── context/               # ClickSteps & theme state contexts
│   │   │   └── hooks/                 # useUrlSyncedState and slide hooks
│   │   ├── quantity-surveying/ # QS interactive calculator widgets
│   │   └── quiz/              # Live quiz cards & hooks
│   ├── lectures/   # Lecture deck content, organized by subject/session
│   ├── routes/     # Route map & path constants
│   ├── services/   # Infrastructure (Firebase auth, Firestore repositories)
│   └── shared/     # App-wide layouts and shared components
├── package.json    # Project dependencies & scripts
└── README.md       # Project overview and documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Run Local Development Server
Starts the Vite dev server for the interactive presentation portal, slide viewer, in-app docs, and shape builder.
```bash
npm run dev
```

### Build for Production
Runs type checks, then compiles files and builds the static HTML bundle.
```bash
npm run build
```

---

## Testing & Code Quality

### Run Unit Tests (Vitest)
Executes structural calculation and utility test suites.
```bash
npm run test
```

### Run ESLint & Type Checks
```bash
npm run lint
npm run typecheck
```
