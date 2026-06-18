import type { QuizResponsePayload, FeedbackPayload, UserPayload, ThemeConfigPayload, ThemePreferences } from './firebase.schemas';

export type { QuizResponsePayload, FeedbackPayload, UserPayload, ThemeConfigPayload, ThemePreferences };

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
}
