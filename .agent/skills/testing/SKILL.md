---
name: testing
description: Guides implementing unit tests for core logics, slide registry schema validations, and fixing test regressions.
---

# Skill: Testing and Regression Prevention

This skill guides fixing test failures and setting up unit, schema, and regression tests.

## 1. Fixing Test Imports
- Never import `describe`, `it`, or `test` from `"node:test"`.
- Always import them from `"vitest"`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  ```
- Node's strict assertion library (`"node:assert/strict"`) can still be used if needed, but prefer Vitest's `expect` matchers.

## 2. Dynamic Slide Registry Schema Verification
To ensure all previous presentations remain compatible and functional without introducing browser dependencies:
- Do not mount UI components in DOM environments.
- Instead, dynamically import and validate the slide deck structures statically.
- Implement tests that crawl all registered slide decks and validate:
  1. That every slide index in `slides` matches an entry in `slideMetadata` (and vice-versa).
  2. That metadata fields conform to the required schema (using Zod validation).

## 3. Pure Logic & Calculation Unit Testing
- For calculations (both app-wide and lecture-specific), test cases should focus on correctness of math:
  - Verify boundary inputs (zero, negative numbers).
  - Verify SI unit conversions.
  - Verify correct rounding to 3 decimal places.
- Place tests in a nested `__tests__` folder relative to the code (e.g., `calculations/__tests__/concrete.test.ts`).

## 4. Verification Workflow
- Run `npm run test` (or `npm.cmd run test -- --run` on Windows) to verify all tests pass.
- Run `npm run typecheck` to verify no TypeScript compilation errors exist.
- Run `npm run lint` to verify that all files conform to eslint rules.
