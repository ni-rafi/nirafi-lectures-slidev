---
trigger: always_on
description: Core Architecture and File Size Rules
---

# Core Workspace Rules

## 1. Primary Rule
- Keep files under 200 lines when possible. The absolute hard limit is 250 lines unless explicitly justified.

## 2. Directory Topology
- `cores/`: App-wide global utility libraries and services. No subject-specific calculations or UI code.
- `services/`: Shared app-wide infrastructure models, authentication handlers, and database connections.
- `features/`: Reusable, presentation-agnostic app-wide UI features (e.g., slideshow player mechanisms, login gates, general quiz templates).
- `routes/`: React Router table configurations, middleware routing, and authorization guards.
- `shared/`: App-wide cross-cutting layouts and layout utility components.
- `subjects/`: Standalone directories for each course subject (e.g., `mechanics-of-solids/`, `quantity-surveying/`). Each subject folder contains:
  - `cores/`: Subject-specific pure calculations and mathematical engines (no UI or framework code).
  - `features/`: Reusable widgets, editors, charts, and state hooks/contexts specific to the subject.
  - `lectures/`: Session-specific slide decks that compose layouts and import features.

## 3. Dependency Injection (DI) & Coding Principles
- Use Dependency Injection (DI) via React Context Providers and custom hooks to resolve service instances. Register singletons at the app root context (e.g., `FirebaseContext.Provider`), and consume them inside components using dedicated hooks (e.g., `useFirebase()`).
- Use TypeScript interfaces to define contracts. Never bind components directly to concrete service classes without an interface.
- Adhere strictly to SOLID principles:
  - Single Responsibility: Keep components, hooks, and service classes small and focused.
  - Open/Closed: Extend calculations or actions via polymorphism.
  - Liskov Substitution: Implement service interfaces consistently.
  - Interface Segregation: Keep interfaces focused.
  - Dependency Inversion: Depend on abstractions (tokens/interfaces), not concretions.

## 4. Naming Conventions
- **Services**: Name in `camelCase` with the `Service` suffix (e.g., `firebaseService.ts`, `qsService.ts`). Do NOT use dot-separated suffixes like `.service.ts`.
- **Interfaces**: Begin with the letter `I` in PascalCase (e.g., `IFirebaseService.ts`, `IQSEngine.ts`).
- **Components**: PascalCase (e.g. `RegNoGate.tsx`, `SlideDeck.tsx`, `StepConcrete.tsx`).
- **Hooks**: Name in `camelCase` with the `use` prefix (e.g. `useUserContext.ts`).
- **Validation Schemas**: Put Zod schemas in `{serviceName}.schemas.ts` files, deriving types using `z.infer`.

## 5. Slide Layouts & Presentational Elements
- **Layout Consistency**: All slide layouts (e.g., `TitleLayout`, `FullWidthLayout`, `TwoColumnLayout`, `GridLayout` under `src/shared/layouts/`) must delegate their headers and footers to the dedicated `<LayoutHeader>` and `<LayoutFooter>` components in `src/shared/layouts/components/` to guarantee smooth, synchronized transition animations (using `.slide-header-title` and `.slide-layout-footer`).
- **Content Elements**: Standardize content representation inside slide structures. Avoid using raw HTML tags (`<ul>`, `<li>`, `<p>`, `shadowed borders`) for presentation slides. Instead, use semantic presentational elements under `src/features/presentation/components/elements/`:
  - Use `<SlideBullet>` for lists and bullets.
  - Use `<SlideParagraph>` for slide paragraph styling.
  - Use `<SlideEquation>` or `<LatexFormula>` for mathematical equations, adhering to flat, unshadowed container styles.
- **Lecture Organization**: Organize slide decks under `src/subjects/{subjectName}/lectures/session-{year}/` to enforce year-specific division. Keep slide structure presentation-only, importing estimate calculators or quizzes from subject `features/`.
- **Modularity & Drawing Parameterization**: Do not couple raw drawing markup (like SVG elements) directly inside slide files. Deconstruct complex slide designs into reusable, parameterized components that receive coordinates, dimensions, and states as type-safe props/JSON parameters. Keep sessional presentation components isolated, single-responsibility, and presentational.