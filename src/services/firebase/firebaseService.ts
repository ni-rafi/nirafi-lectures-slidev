import type { IFirebaseService, QuizResponsePayload, FeedbackPayload, UserPayload, ThemeConfigPayload, SessionStatusPayload, QuizState, SubjectSubmissions, PlaygroundCanvasPayload } from './IFirebaseService';
import { FirebaseAuthService } from './firebaseAuthService';
import { FirebaseUserService } from './firebaseUserService';
import { FirebaseFeedbackService } from './firebaseFeedbackService';
import { FirebaseThemeService } from './firebaseThemeService';
import { FirebaseSessionService } from './firebaseSessionService';
import { FirebaseSubmissionsService } from './firebaseSubmissionsService';
import { FirebasePlaygroundService } from './firebasePlaygroundService';

export class FirebaseService implements IFirebaseService {
  private authService = new FirebaseAuthService();
  private userService = new FirebaseUserService(this.authService);
  private feedbackService = new FirebaseFeedbackService(this.authService);
  private themeService = new FirebaseThemeService(this.authService);
  private sessionService = new FirebaseSessionService(this.authService);
  private submissionsService = new FirebaseSubmissionsService(this.authService);
  private playgroundService = new FirebasePlaygroundService(this.authService);

  public initializeFirebase(): void {
    this.authService.initialize();
    this.userService.initialize();
    this.feedbackService.initialize();
    this.themeService.initialize();
    this.sessionService.initialize();
    this.submissionsService.initialize();
    this.playgroundService.initialize();
  }

  public anonymousSignIn(): Promise<string> {
    return this.authService.anonymousSignIn();
  }

  public submitQuizResponse(payload: QuizResponsePayload): Promise<void> {
    return this.submissionsService.submitQuizResponse(payload);
  }

  public submitFeedback(payload: FeedbackPayload): Promise<void> {
    return this.feedbackService.submitFeedback(payload);
  }

  public getUserProfile(uid: string): Promise<UserPayload | null> {
    return this.userService.getUserProfile(uid);
  }

  public setUserProfile(uid: string, profile: Omit<UserPayload, 'id'>): Promise<UserPayload> {
    return this.userService.setUserProfile(uid, profile);
  }

  public getThemeConfig(id: string): Promise<ThemeConfigPayload | null> {
    return this.themeService.getThemeConfig(id);
  }

  public setThemeConfig(id: string, config: Omit<ThemeConfigPayload, 'id'>): Promise<ThemeConfigPayload> {
    return this.themeService.setThemeConfig(id, config);
  }

  public deleteThemeConfig(id: string): Promise<void> {
    return this.themeService.deleteThemeConfig(id);
  }

  public getSessionStatus(id: string): Promise<SessionStatusPayload | null> {
    return this.sessionService.getSessionStatus(id);
  }

  public setSessionStatus(id: string, payload: Omit<SessionStatusPayload, 'id'>): Promise<SessionStatusPayload> {
    return this.sessionService.setSessionStatus(id, payload);
  }

  public subscribeSessionStatuses(callback: (statuses: SessionStatusPayload[]) => void): () => void {
    return this.sessionService.subscribeSessionStatuses(callback);
  }

  public getQuizState(quizId: string): Promise<QuizState | null> {
    return this.sessionService.getQuizState(quizId);
  }

  public setQuizState(quizId: string, state: Omit<QuizState, 'id'>): Promise<QuizState> {
    return this.sessionService.setQuizState(quizId, state);
  }

  public subscribeQuizState(quizId: string, callback: (state: QuizState | null) => void): () => void {
    return this.sessionService.subscribeQuizState(quizId, callback);
  }

  public getSubjectSubmissions(subjectId: string, sessionId: string, studentUid: string): Promise<SubjectSubmissions | null> {
    return this.submissionsService.getSubjectSubmissions(subjectId, sessionId, studentUid);
  }

  public submitQuizAnswer(
    subjectId: string,
    sessionId: string,
    studentUid: string,
    studentInfo: { name: string; reg: string },
    questionId: string,
    answer: string,
    isCorrect: boolean
  ): Promise<void> {
    return this.submissionsService.submitQuizAnswer(subjectId, sessionId, studentUid, studentInfo, questionId, answer, isCorrect);
  }

  public overrideQuizAnswer(
    subjectId: string,
    sessionId: string,
    studentUid: string,
    quizId: string,
    isCorrect: boolean,
    score: number,
    isOverridden: boolean
  ): Promise<void> {
    return this.submissionsService.overrideQuizAnswer(subjectId, sessionId, studentUid, quizId, isCorrect, score, isOverridden);
  }

  public getAllSubmissions(subjectId: string, sessionId: string): Promise<SubjectSubmissions[]> {
    return this.submissionsService.getAllSubmissions(subjectId, sessionId);
  }

  public subscribeAllSubmissions(
    subjectId: string,
    sessionId: string,
    callback: (submissions: SubjectSubmissions[]) => void
  ): () => void {
    return this.submissionsService.subscribeAllSubmissions(subjectId, sessionId, callback);
  }

  public getPlaygroundCanvas(id: string): Promise<PlaygroundCanvasPayload | null> {
    return this.playgroundService.getPlaygroundCanvas(id);
  }

  public setPlaygroundCanvas(id: string, payload: Omit<PlaygroundCanvasPayload, 'id'>): Promise<PlaygroundCanvasPayload> {
    return this.playgroundService.setPlaygroundCanvas(id, payload);
  }
}
