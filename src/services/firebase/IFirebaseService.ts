import type { QuizResponsePayload, FeedbackPayload, UserPayload, ThemeConfigPayload, ThemePreferences, SessionStatusPayload, QuizState, SubjectSubmissions, PlaygroundCanvasPayload } from './firebase.schemas';

export type { QuizResponsePayload, FeedbackPayload, UserPayload, ThemeConfigPayload, ThemePreferences, SessionStatusPayload, QuizState, SubjectSubmissions, PlaygroundCanvasPayload };

export interface IFirebaseService {
  initializeFirebase(): void;
  anonymousSignIn(): Promise<string>;
  submitQuizResponse(payload: QuizResponsePayload): Promise<void>;
  submitFeedback(payload: FeedbackPayload): Promise<void>;
  getUserProfile(uid: string): Promise<UserPayload | null>;
  setUserProfile(uid: string, profile: Omit<UserPayload, 'id'>): Promise<UserPayload>;
  getThemeConfig(id: string): Promise<ThemeConfigPayload | null>;
  setThemeConfig(id: string, config: Omit<ThemeConfigPayload, 'id'>): Promise<ThemeConfigPayload>;
  deleteThemeConfig(id: string): Promise<void>;
  getSessionStatus(id: string): Promise<SessionStatusPayload | null>;
  setSessionStatus(id: string, payload: Omit<SessionStatusPayload, 'id'>): Promise<SessionStatusPayload>;
  subscribeSessionStatuses(callback: (statuses: SessionStatusPayload[]) => void): () => void;
  getQuizState(quizId: string): Promise<QuizState | null>;
  setQuizState(quizId: string, state: Omit<QuizState, 'id'>): Promise<QuizState>;
  subscribeQuizState(quizId: string, callback: (state: QuizState | null) => void): () => void;
  getSubjectSubmissions(subjectId: string, sessionId: string, studentUid: string): Promise<SubjectSubmissions | null>;
  submitQuizAnswer(subjectId: string, sessionId: string, studentUid: string, studentInfo: { name: string; reg: string }, questionId: string, answer: string, isCorrect: boolean): Promise<void>;
  overrideQuizAnswer(subjectId: string, sessionId: string, studentUid: string, quizId: string, isCorrect: boolean, score: number, isOverridden: boolean): Promise<void>;
  getAllSubmissions(subjectId: string, sessionId: string): Promise<SubjectSubmissions[]>;
  subscribeAllSubmissions(subjectId: string, sessionId: string, callback: (submissions: SubjectSubmissions[]) => void): () => void;
  getPlaygroundCanvas(id: string): Promise<PlaygroundCanvasPayload | null>;
  setPlaygroundCanvas(id: string, payload: Omit<PlaygroundCanvasPayload, 'id'>): Promise<PlaygroundCanvasPayload>;
}

