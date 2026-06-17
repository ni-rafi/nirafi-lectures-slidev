---
trigger: always_on
description: Core Architecture and File Size Rules
---

# Core Workspace Rules

## 1. Primary Rule
- Keep files under 200 lines when possible. The absolute hard limit is 250 lines unless explicitly justified.

## 2. Directory Topology
- `cores/`: Isolated, pure mathematics/business logic files. Absolutely no UI code, React, or framework imports here.
- `services/`: Shared infrastructure models, authentication handlers, and database connections. Pure TypeScript, no UI components.
- `features/`: Reusable, presentation-agnostic core application features (e.g., slideshow player mechanisms, identification gates, quiz templates, and estimation forms).
- `lectures/`: Specific lecture slide decks (organized by subject and session) that compose layout templates and interactive components imported from `features/`.
- `routes/`: React Router table configurations, middleware routing, and authorization guards.
- `shared/`: App-wide cross-cutting layouts and layout utility components.

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
- **Components**: PascalCase (e.g. `RollNumberGate.tsx`, `SlideDeck.tsx`, `StepConcrete.tsx`).
- **Hooks**: Name in `camelCase` with the `use` prefix (e.g. `useUserContext.ts`).
- **Validation Schemas**: Put Zod schemas in `{serviceName}.schemas.ts` files, deriving types using `z.infer`.


