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
  lectureNumber?: string | number;
}

export interface Session {
  id: string;
  label: string;        // e.g. "Session 2026–27"
  lectures: Lecture[];
  usnCode?: string;
  session?: string;
}

export interface Course {
  id: string;
  courseTitle: string;
  courseCode: string;
  description: string;
  iconEmoji: string;
  color: string;        // tailwind-compatible hex or gradient string
  sessions: Session[];
  yearSemester?: string;
  creditHours?: string;
}

export type Subject = Course;

export interface SubjectMetadata {
  courseCode: string;
  courseTitle: string;
  yearSemester: string;
  creditHours: string;
}

export interface SessionMetadata {
  usnCode: string;
  session: string;
}

// Eagerly import all subject metadata
const subjectMetadataModules = import.meta.glob<{ subjectMetadata: SubjectMetadata }>(
  '/src/subjects/*/subjectMetadata.ts',
  { eager: true }
);

// Eagerly import all session metadata
const sessionMetadataModules = import.meta.glob<{ sessionMetadata: SessionMetadata }>(
  '/src/subjects/*/lectures/*/sessionMetadata.ts',
  { eager: true }
);

// Eagerly import all lecture metadata configs across the workspace
const metadataModules = import.meta.glob<{ metadata: Lecture }>(
  '/src/subjects/*/lectures/*/*/metadata.ts',
  { eager: true }
);

// Decorative details mapping for subject categories
const SUBJECT_DECORATIONS: Record<string, { description: string; iconEmoji: string; color: string }> = {
  'quantity-surveying': {
    description: 'Quantity take-off, Bill of Quantities (BoQ), material and resource scheduling, and budget management for civil engineering works.',
    iconEmoji: '🏗️',
    color: '#f59e0b',
  },
  'engineering-mechanics': {
    description: 'Dynamics, relative motion, cables, friction analysis, impulses, and mechanical work systems.',
    iconEmoji: '⚙️',
    color: '#ea580c',
  },
};

const COURSE_SHELLS: Record<string, Course> = {};

// 1. Populate COURSE_SHELLS using subjectMetadata.ts
Object.entries(subjectMetadataModules).forEach(([path, module]) => {
  const match = path.match(/\/subjects\/([^/]+)\/subjectMetadata\.ts$/);
  if (!match) return;
  const subjectId = match[1];
  if (!subjectId) return;
  const metadata = module.subjectMetadata;
  const decorations = SUBJECT_DECORATIONS[subjectId] || {
    description: '',
    iconEmoji: '📚',
    color: '#6b7280',
  };

  COURSE_SHELLS[subjectId] = {
    id: subjectId,
    courseTitle: metadata.courseTitle,
    courseCode: metadata.courseCode,
    description: decorations.description,
    iconEmoji: decorations.iconEmoji,
    color: decorations.color,
    yearSemester: metadata.yearSemester,
    creditHours: metadata.creditHours,
    sessions: [],
  };
});

// Helper to find session metadata
const findSessionMetadata = (subjectId: string, sessionId: string): SessionMetadata | null => {
  const targetPath = `/src/subjects/${subjectId}/lectures/${sessionId}/sessionMetadata.ts`;
  const module = sessionMetadataModules[targetPath];
  return module ? module.sessionMetadata : null;
};

// 2. Process modules to populate the COURSE_SHELLS with sessions and lectures
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
    const sessionMeta = findSessionMetadata(subjectId, sessionId);
    const yearMatch = sessionId.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : '';
    const nextYearShort = year ? String(Number(year) - 2000 + 1) : '';
    
    session = {
      id: sessionId,
      label: sessionMeta ? `Session ${sessionMeta.session}` : `Session ${year}–${nextYearShort}`,
      usnCode: sessionMeta?.usnCode,
      session: sessionMeta?.session,
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
