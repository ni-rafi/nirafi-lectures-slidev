// ─────────────────────────────────────────────────────────────────────────────
// Lecture Registry — single source of truth for the portal
// Add new lectures here; update slideNo when slides.md order changes.
// ─────────────────────────────────────────────────────────────────────────────

export interface Lecture {
  id: string;
  title: string;
  description: string;
  slideNo: number;       // Slidev slide number where this lecture starts
  durationMins: number;
  locked: boolean;
  tags: string[];
}

export interface Session {
  id: string;
  label: string;        // e.g. "Session 2026–27"
  lectures: Lecture[];
}

export interface Course {
  id: string;
  courseTitle: string;
  courseCode: string;
  description: string;
  iconEmoji: string;
  color: string;        // tailwind-compatible hex or gradient string
  sessions: Session[];
}

export type Subject = Course;

export const SUBJECTS: Course[] = [
  {
    id: 'quantity-surveying',
    courseTitle: 'Quantity Surveying',
    courseCode: 'CE-QS',
    description: 'Structural estimation, material take-off, and project costing for civil engineering works.',
    iconEmoji: '🏗️',
    color: '#f59e0b',
    sessions: [
      {
        id: 'session-2026',
        label: 'Session 2026–27',
        lectures: [
          {
            id: 'concrete',
            title: 'Concrete Volumetric Estimations',
            description: 'Estimate concrete volume with wastage factors for beams, columns, and slabs.',
            slideNo: 5,
            durationMins: 45,
            locked: false,
            tags: ['concrete', 'volumetric', 'SI units'],
          },
          {
            id: 'brickwork',
            title: 'Brickwork & Mortar Estimations',
            description: 'Calculate brick counts and mortar quantities for structural masonry walls.',
            slideNo: 9,
            durationMins: 40,
            locked: false,
            tags: ['brickwork', 'masonry', 'mortar'],
          },
          {
            id: 'steel',
            title: 'Steel Reinforcement Estimations',
            description: 'Calculate weight of reinforcement bar steel using standard diameter equations.',
            slideNo: 13,
            durationMins: 35,
            locked: false,
            tags: ['steel', 'reinforcement', 'rebar'],
          },
        ],
      },
    ],
  },
  {
    id: 'web-development',
    courseTitle: 'Web App Development',
    courseCode: 'CS-WAD',
    description: 'Modern web application development with Vue 3, TypeScript, Firebase, and Slidev.',
    iconEmoji: '💻',
    color: '#6366f1',
    sessions: [
      {
        id: 'session-2026',
        label: 'Session 2026–27',
        lectures: [
          {
            id: 'slidev_intro',
            title: 'Introduction to Slidev',
            description: 'Learn how to build developer presentations with Markdown, Vue, and Slidev.',
            slideNo: 2,
            durationMins: 30,
            locked: false,
            tags: ['slidev', 'markdown', 'vue'],
          },
          {
            id: 'vue_basics',
            title: 'Vue 3 Basics & Components',
            description: 'Deep dive into Vue 3 composition API, components, and reactivity.',
            slideNo: 0,  // not yet added to slides.md
            durationMins: 60,
            locked: true,
            tags: ['vue3', 'composition api', 'components'],
          },
        ],
      },
    ],
  },
];
