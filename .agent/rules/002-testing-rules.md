---
trigger: always_on
description: Linter and Testing Rules
---

# Testing and Linter Rules

## 1. Type Safety
- TypeScript strict mode must be enabled and followed.
- Explicit type `any` is strictly prohibited. If a type cannot be known, use `unknown` or define an interface.
- Solve all compiler errors and warnings prior to checking in.

## 2. Unit Testing
- Every mathematical/logical file inside `cores/` and lecture subdirectories must have companion unit tests.
- Place unit tests inside a nested `__tests__` folder (e.g. `cores/quantity-surveying/__tests__/` or `session-XXXX/calculations/__tests__/`).
- Run tests using `npm run test` (Vitest framework).

## 3. Linting
- All files must be checked and pass ESLint checks cleanly.
- Run checks using `npm run lint`.

## 4. Database Schema Verification
- Database operations must enforce pre-flight validation via Zod schemas.
- Verify Zod parser calls (`.parse()`) reject invalid payloads.

## 5. Slide Registry & Regression Prevention
- Avoid DOM-based UI rendering in test suites to prevent heavy browser environments and speed up test execution.
- Maintain a dynamic test suite that auto-crawls all registered slide decks, validating exact alignment of `slides` and `slideMetadata` keys, and enforcing structural integrity of metadata fields (like title, type, and section) using Zod schemas.

