---
name: react-feature-standard
description: Standard structure and conventions for developing reusable React features and slide-deck lectures.
---

# React Feature & Lecture Development Standard

This skill defines the folder structure and guidelines for developing core reusable UI components inside `src/features/` and lecture slide decks inside `src/lectures/`.

---

## 1. Directory Structure

### 1.1 Core Features (`src/features/`)
Every core feature is presentation-agnostic and reusable. It must follow this structure:
```text
src/features/{featureName}/
├── components/       # Presentational components (Pure UI, props-driven)
├── hooks/            # Controllers, custom hooks (Zustand, state integration)
├── types/            # TypeScript interfaces internal to the feature
└── index.ts          # Barrel exports exposing only public components and hooks
```

#### Reusable Features Examples:
- **`presentation`**: Aspect-ratio slideshow viewer, keyboard arrows hook (`useKeyboardNav`), full-screen button, and layout wrapper templates (`TheoryLayout`, `QuizLayout`, `TitleLayout`).
- **`gate`**: Roll number validation dialog and guest log-in forms.
- **`quiz`**: Real-time Interactive Quiz card (submits scores to Firestore).
- **`qs-calculators`**: Civil Engineering math estimators (Concrete Wizard steps, BoQ spreadsheet).

### 1.2 Lectures (`src/lectures/`)
Slide decks are composed strictly of components, widgets, and layouts imported from `src/features/`. They are organized by subject code and session:
```text
src/lectures/{subjectCode}/session-{year}/
├── {lectureId}.tsx   # Lecture slide configurations and text content composed in JSX
└── index.ts          # Expose slide deck components
```

---

## 2. Coding Guidelines

### 2.1 UI vs. Orchestration Logic
* Components in `features/` must be **pure presentational UI**. They should receive data and handler callbacks strictly via standard React properties.
* Extract stateful orchestration, timers, and store integrations into custom hooks in `hooks/`.
* No API calls, Firebase initialization, or global subscriptions should occur inside presentation components.

### 2.2 Reusable Slide Layouts
To ensure a consistent visual look across all lectures, define layouts inside `src/features/presentation/components/layouts/`:
* **`TitleLayout`**: Widescreen cover page with title, subtitle, and backgrounds.
* **`TheoryLayout`**: Content view presenting headings, bullet points, text, and optional equations.
* **`SplitLayout`**: Double column layout for showing notes on the left and a calculator or quiz on the right.

---

## 3. Example Implementation

### Lecture Component Definition in JSX:
```tsx
// src/lectures/quantity-surveying/session-2026/ConcreteVolume.tsx
import React from 'react';
import { SlideDeck, Slide, TheoryLayout, SplitLayout } from '@/features/presentation';
import { StepConcrete, BoQSpreadsheet } from '@/features/qs-calculators';
import { InteractiveQuiz } from '@/features/quiz';

export const ConcreteVolumeLecture: React.FC = () => {
  return (
    <SlideDeck title="Concrete Volumetric Estimations">
      {/* Slide 1 */}
      <Slide layout="title">
        <TheoryLayout 
          title="Concrete Volumetric Estimations" 
          subtitle="CE-QS | Fall 2026 Semester"
          bullets={[
            "Learn volumetric calculations for concrete beams and columns",
            "Understand wastage coefficients",
            "Perform calculations in real-time"
          ]}
        />
      </Slide>

      {/* Slide 2 */}
      <Slide layout="interactive">
        <SplitLayout
          left={
            <div>
              <h3 className="text-lg font-bold">Calculation Wizard</h3>
              <p className="text-xs text-slate-500">Fill in dimensions in standard meters.</p>
              <StepConcrete />
            </div>
          }
          right={
            <BoQSpreadsheet />
          }
        />
      </Slide>

      {/* Slide 3 */}
      <Slide layout="assessment">
        <InteractiveQuiz 
          quizId="qs_2026_concrete_q1"
          question="What is the concrete volume for L=10m, W=0.3m, H=0.4m, and 5% wastage?"
          options={["1.200 m³", "1.260 m³", "1.320 m³", "1.140 m³"]}
          correctIndex={1}
        />
      </Slide>
    </SlideDeck>
  );
};
```
