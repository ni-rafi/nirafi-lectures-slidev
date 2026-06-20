// ─────────────────────────────────────────────────────────────────────────────
// Lecture Registry — single source of truth for the portal
// Automatically aggregated via Vite eager globbing.
// ─────────────────────────────────────────────────────────────────────────────

export interface Lecture {
  id: string;
  title: string;
  description: string;
  slideNo: number;       // Slidev slide number where this lecture starts
  durationMins: number;
  locked: boolean;
  tags: string[];
  quizzes?: Record<string, 'stealth' | 'placeholder'>;
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

// Eagerly import all lecture metadata configs across the workspace
const metadataModules = import.meta.glob<{ metadata: Lecture }>(
  '/src/subjects/*/lectures/*/*/metadata.ts',
  { eager: true }
);

// Course shells map. Each subject is defined by its course config shell.
const COURSE_SHELLS: Record<string, Course> = {
  'quantity-surveying': {
    id: 'quantity-surveying',
    courseTitle: 'Quantity Surveying',
    courseCode: 'CEE 0731 2224',
    description: 'Quantity take-off, Bill of Quantities (BoQ), material and resource scheduling, and budget management for civil engineering works.',
    iconEmoji: '🏗️',
    color: '#f59e0b',
    sessions: [],
  },

  'engineering-mechanics': {
    id: 'engineering-mechanics',
    courseTitle: 'Engineering Mechanics II',
    courseCode: 'CEE 0541 1233',
    description: 'Dynamics, relative motion, cables, friction analysis, impulses, and mechanical work systems.',
    iconEmoji: '⚙️',
    color: '#ea580c',
    sessions: [],
  },
};

// Process modules to populate the COURSE_SHELLS
Object.entries(metadataModules).forEach(([path, module]) => {
  const match = path.match(/\/subjects\/([^/]+)\/lectures\/((?:session-)?\d{4}(?:-\d{2,4})?)\//);
  if (!match) return;

  const subjectId = match[1];
  const sessionId = match[2];
  if (!subjectId || !sessionId) return;

  const course = COURSE_SHELLS[subjectId];
  if (!course) return;

  // Find or create session
  let session = course.sessions.find((s: Session) => s.id === sessionId);
  if (!session) {
    const yearMatch = sessionId.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : '';
    const nextYearShort = year ? String(Number(year) - 2000 + 1) : '';
    session = {
      id: sessionId,
      label: `Session ${year}–${nextYearShort}`,
      lectures: [],
    };
    course.sessions.push(session);
  }

  // Push the lecture metadata
  session.lectures.push(module.metadata);
});

// Sort lectures by slideNo within each session for consistent order
Object.values(COURSE_SHELLS).forEach((course) => {
  course.sessions.forEach((session) => {
    session.lectures.sort((a, b) => a.slideNo - b.slideNo);
  });
});

// Export aggregated subjects list
export const SUBJECTS: Course[] = Object.values(COURSE_SHELLS).filter(
  (course) => course.sessions.length > 0
);
