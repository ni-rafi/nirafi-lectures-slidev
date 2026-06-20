---
name: lecture-creation
description: Guides creating and dynamically registering a new lecture slide deck with metadata.
---

# Skill: Creating and Dynamically Registering a Lecture

This skill guides creating a new lecture, writing its slide components, and adding the required metadata so it is dynamically compiled into the portal registry.

## Step-by-Step Workflow

1. **Create the Lecture Directory**:
   Add a new directory inside the session folder of your subject:
   `src/subjects/{subjectId}/lectures/session-{year}/lecture-{index}-{name}/`

2. **Define Portal Metadata**:
   Create a `metadata.ts` file in the new lecture directory:
   ```typescript
   import type { Lecture } from '@/config/lectures';

   export const metadata: Lecture = {
     id: 'unique-lecture-id', // Match router params
     title: 'Lecture Title',
     description: 'Brief description of the lecture topic.',
     slideNo: 1,              // Initial slide page index
     durationMins: 45,        // Estimated duration
     locked: false,           // Lock state for student view
     tags: ['tag1', 'tag2'],
   };
   ```

3. **Implement Slide Deck**:
   Create a `lecture.tsx` file in the new directory. It must export:
   * `slides`: A `Record<number, React.ComponentType<SlideProps>>` mapping slide numbers to React components.
   * `slideMetadata`: A `Record<number, SlideMetadata>` mapping slide numbers to slide information.

4. **Verify Dynamic Discovery**:
   - Save all files. Vite will automatically discover the new metadata and aggregate it into `SUBJECTS` at build time.
   - Run linter and typescript verification:
     ```bash
     npm run lint
     npm run typecheck
     ```
   - Run slide registry tests:
     ```bash
     npm run test
     ```
