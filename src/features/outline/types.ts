import presenter from '@/config/presenter.json';

export type PresenterInfo = typeof presenter;

export interface CourseMetadata {
  courseCode: string;
  courseTitle: string;
  credit: string;
  category: string;
  courseType: string;
  yearSemester: string;
  teacher: PresenterInfo;
  session: string;
  usn: string;
}

export interface WeeklyScheduleRow {
  week: number;
  topic: string;
  contentCode: string;
  coCovered: string;
  tlStrategy: string[]; // e.g. ['TL 01', 'TL 02']
  assessmentStrategy: string[]; // e.g. ['CA 01', 'SA 01']
}

export interface OutcomeItem {
  id: number;
  description: string;
}

export interface ContentItem {
  id: number;
  title: string;
  description: string;
}

export interface StrategyLegend {
  code: string;
  strategy: string;
}

export interface ReferenceBook {
  id: number;
  title: string;
  author: string;
  edition?: string;
  publisher?: string;
  url?: string;
}

export interface CourseOutlineData {
  metadata: CourseMetadata;
  schedule: WeeklyScheduleRow[];
  outcomes: OutcomeItem[];
  rationale: string;
  contents: ContentItem[];
  tlLegends: StrategyLegend[];
  assessmentLegends: StrategyLegend[];
  references: ReferenceBook[];
}
