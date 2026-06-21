# Slide Layouts Reference Guide

This document lists every sessional slide layout available in the `src/shared/layouts/` directory, detailing their purpose, TypeScript props, interactive usage examples, and design best practices.

---

## 1. TitleV2Layout (Premium Cover Page)

Renders the sessional cover slide for a course, displaying logo, course credentials, credit hours, teacher details, and academic session information.

### Props Interface
```typescript
interface PresenterInfo {
  name: string;
  title: string;
  department: string;
  institution: string;
}

interface TitleV2LayoutProps {
  courseCode: string;
  courseTitle: string;
  subtitle?: string; // Default: 'Course Syllabus & Syllabus Outline'
  yearSemester: string;
  creditHours: string;
  usnCode: string;
  teacher?: PresenterInfo; // Defaults to config/presenter.json
  session: string;
  lectureNumber?: string | number;
}
```

### Usage Example
```tsx
import { TitleV2Layout } from '@/shared/layouts/TitleV2Layout';

const Slide1: React.FC = () => (
  <TitleV2Layout
    courseCode="CE 204"
    courseTitle="Quantity Surveying & Valuation"
    subtitle="Introduction to Substructure Estimating"
    yearSemester="2nd Year/1st Semester"
    creditHours="3.0"
    usnCode="CO-QS-204"
    session="2023-2024"
    lectureNumber={2}
  />
);
```

### Best Practices
* Always use this layout as **Slide 1** of any new lecture deck.
* Provide an integer for `lectureNumber` so it formats automatically as "Lecture 02".
* Avoid overriding the `teacher` prop unless a guest lecturer is teaching the sessional.

---

## 2. TitleLayout (General Cover & Session Opener)

Renders a standard centered title, sessional subtitle, and presenter copyright. Used for sessional cover pages or sessional introductions.

### Props Interface
```typescript
interface TitleLayoutProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode; // Optional explanatory paragraph
  footer?: React.ReactNode; // Overrides the default presenter footer
}
```

### Usage Example
```tsx
import { TitleLayout } from '@/shared/layouts/TitleLayout';

const Slide1: React.FC = () => (
  <TitleLayout
    title="Structural Concrete Estimating"
    subtitle="Topic 3: Foundation and Column Footings"
    footer="CE-QS Academic Department"
  />
);
```

---

## 3. TopicDividerLayout (Section Divider)

Used inside a deck to mark sessional section boundaries. Renders a centered title with a large topic watermark in the background.

### Props Interface
```typescript
interface TopicDividerLayoutProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  topicNumber?: string; // e.g. "01", "02"
  description?: React.ReactNode;
}
```

### Usage Example
```tsx
import { TopicDividerLayout } from '@/shared/layouts/TopicDividerLayout';

const Slide5: React.FC = () => (
  <TopicDividerLayout
    topicNumber="03"
    title="Reinforced Cement Concrete (RCC)"
    description="Understanding wet mortar calculations, density limits, and wastage factors."
  />
);
```

### Best Practices
* Do NOT use `<TitleV2Layout>` or `<TitleLayout>` for internal topic separators. Use this layout to maintain sessional consistency.
* Keep `topicNumber` as a two-digit string.

---

## 4. FullWidthLayout (Widescreen Content Layout)

Provides a widescreen grid container (90% width) for massive content elements like drawings, charts, spreadsheets, or code editors.

### Props Interface
```typescript
interface FullWidthLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  bgVariant?: 'default' | 'calculation' | 'gallery';
  footer?: React.ReactNode;
}
```

### Usage Example
```tsx
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';

const Slide3: React.FC = () => (
  <FullWidthLayout title="Earthwork excavation cross-section analysis" footer="Page 3 of 10">
    <div className="w-full h-[400px]">
      {/* High-fidelity visual elements here */}
    </div>
  </FullWidthLayout>
);
```

---

## 5. TwoColumnLayout (Side-by-Side Split Panel)

Splits the slide area into two columns with an optional custom divider width. Ideal for parameter input panels side-by-side with outputs or charts.

### Props Interface
```typescript
interface TwoColumnLayoutProps {
  title: React.ReactNode;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: string; // Default: "50%"
  bgVariant?: 'default' | 'calculation' | 'gallery';
  footer?: React.ReactNode;
}
```

### Usage Example
```tsx
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';

const Slide4: React.FC = () => (
  <TwoColumnLayout
    title="Earthwork Calculator Sandbox"
    leftWidth="40%"
    leftContent={<div>Parameter Controls</div>}
    rightContent={<div>Visual SVG Drawing and BoQ Outputs</div>}
  />
);
```

### Best Practices
* Standardize `leftWidth` as a percentage (e.g. `"40%"` or `"45%"`). The right side automatically adjusts to fill the remaining area.
* Avoid forcing layout items side-by-side using custom CSS; `TwoColumnLayout` automatically folds to vertical stacks in Blog Mode.

---

## 6. GridLayout (Multi-card Matrix Layout)

Arranges child elements into a multi-column flex/grid container supporting 2, 3, or 4 columns.

### Props Interface
```typescript
interface GridLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  cols?: number; // Supports: 2, 3, 4 (Default: 3)
  bgVariant?: 'default' | 'calculation' | 'gallery';
  footer?: React.ReactNode;
}
```

### Usage Example
```tsx
import { GridLayout } from '@/shared/layouts/GridLayout';

const Slide7: React.FC = () => (
  <GridLayout title="Excavation Machinery Variations" cols={3}>
    <div>Excavator Card</div>
    <div>Backhoe Loader Card</div>
    <div>Dump Truck Card</div>
  </GridLayout>
);
```

---

## 7. ThankYouLayout (Closing Slide)

Renders the standard closing/acknowledgment screen with a stylized call-to-action for questions.

### Props Interface
```typescript
interface ThankYouLayoutProps {
  title?: string; // Default: 'Thank You'
  subtitle?: string; // Default: 'Do you have any question?'
}
```

### Usage Example
```tsx
import { ThankYouLayout } from '@/shared/layouts/ThankYouLayout';

const LastSlide: React.FC = () => (
  <ThankYouLayout
    title="Thank You"
    subtitle="Let's proceed to the lab exercise!"
  />
);
```
