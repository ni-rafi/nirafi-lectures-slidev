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
   * **Layout Selection Standards**:
     * **Main Cover Slide (Slide 1)**: Use `<TitleV2Layout>` for the main cover page of the lecture.
     * **Topic/Section Opener Divider Slides**: Use `<TopicDividerLayout>` (imported from `@/shared/layouts/TopicDividerLayout`) for slides introducing a new topic or section within the deck. Do not use `<TitleLayout>` or `<TitleV2Layout>` for internal topic openers.
     * **Content Slides**: Use `<FullWidthLayout>` or `<TwoColumnLayout>` for regular content slides.

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

5. **Visual Design & Reference Principles**:
   - **Visual-First Layouts**: Minimize flat bullet points. Use interactive charts, visual SVGs, and stacked layouts.
   - **Cross-Section & Elevation Displays**: When discussing elevations, cross-sections, or spatial bounds, render the structural shape (using SVG or shape utilities) and highlight individual components/dimensions progressively using step-by-step click animations (`ClickReveal`, `<ClickHighlight at={step}>`) instead of textual lists.
   - **Eye-catching Elements**: Use bold/large numbers for outputs, paint-over annotations (`<ClickHighlight variant="paint">`), and transition-linked graphics.
   - **Data Reference Standards**: Always prioritize official project documentation (e.g., PWD scheduling specifications). Supplement with cross-checked publications from reputable publishers only when directly relevant, providing precise citations in the presentation context.
   - **Visual Implementation Blueprint**: Refer to the blueprint code at [substructure-slides-example.tsx](file:///d:/Websites/nirafi-workspace/.agent/skills/lecture-creation/examples/substructure-slides-example.tsx) to see how these points map:
     * *Dynamic Shapes & Cross-Sections*: See `<SubstructureEstimationSlide>` rendering footing steps (375mm & 250mm brick steps, CC base, BFS bedding) layered using React states that highlight structural parts progressively.
     * *Cubic vs Square Principles*: See `<SubstructurePrinciplesSlide>` showing three-dimensional bounding boxes vs two-dimensional flat surfaces depending on the active rule.
     * *Bold Numbers & Paint Highlighting*: Check `<CalculationOutput>` and `<ClickHighlight variant="paint">` usages highlighting critical dimensions and final take-off values in bold monospaced fonts.
     * *Interactive Parameter Adjustments*: Check how changing length/width sliders in the sandbox triggers real-time shape resizing and instant volume outputs.
     * *Click Step Animations*: Check standard navigation button maps (`currentStep`, `activeRule`, `activeLayer`) executing transition animations step-by-step to explain sessional calculations.
