import type { SessionStatusPayload, QuizState } from './IFirebaseService';
import { SessionStatusRepository } from './repositories/lectures/SessionStatusRepository';
import { QuizStatesRepository } from './repositories/quiz-states/QuizStatesRepository';
import { firestoreService } from './firestoreService';
import { SessionStatusDefinition, QuizStatesDefinition } from './firebase.definitions';

export class FirebaseSessionService {
  private sessionStatusRepo: SessionStatusRepository | null = null;
  private quizStatesRepo: QuizStatesRepository | null = null;

  constructor(private authService: { isOfflineMode: boolean }) {}

  public initialize(): void {
    if (!this.authService.isOfflineMode) {
      try {
        this.sessionStatusRepo = new SessionStatusRepository();
        this.quizStatesRepo = new QuizStatesRepository();
      } catch (e) {
        console.warn('[FirebaseSessionService] Failed to initialize repositories:', e);
      }
    }
  }

  public async getSessionStatus(id: string): Promise<SessionStatusPayload | null> {
    if (this.authService.isOfflineMode || !this.sessionStatusRepo) {
      const saved = localStorage.getItem(`offline_status_${id}`);
      return saved ? { id, ...JSON.parse(saved) } : null;
    }
    try {
      return await this.sessionStatusRepo.getById(id);
    } catch (error) {
      console.warn('[FirebaseSessionService] Failed to load session status, trying offline cache:', error);
      const saved = localStorage.getItem(`offline_status_${id}`);
      return saved ? { id, ...JSON.parse(saved) } : null;
    }
  }

  public async setSessionStatus(id: string, payload: Omit<SessionStatusPayload, 'id'>): Promise<SessionStatusPayload> {
    if (this.authService.isOfflineMode || !this.sessionStatusRepo) {
      localStorage.setItem(`offline_status_${id}`, JSON.stringify(payload));
      return { id, ...payload };
    }
    try {
      return await this.sessionStatusRepo.set(id, payload);
    } catch (error) {
      console.warn('[FirebaseSessionService] Failed to save session status in Firestore, saving locally:', error);
      localStorage.setItem(`offline_status_${id}`, JSON.stringify(payload));
      return { id, ...payload };
    }
  }

  public subscribeSessionStatuses(callback: (statuses: SessionStatusPayload[]) => void): () => void {
    if (this.authService.isOfflineMode) {
      const getOfflineStatuses = (): SessionStatusPayload[] => {
        const results: SessionStatusPayload[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('offline_status_')) {
            const docId = key.replace('offline_status_', '');
            try {
              results.push({ id: docId, ...JSON.parse(localStorage.getItem(key) || '{}') });
            } catch {}
          }
        }
        return results;
      };
      callback(getOfflineStatuses());
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key && e.key.startsWith('offline_status_')) callback(getOfflineStatuses());
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    return firestoreService.subscribe(SessionStatusDefinition, callback);
  }

  public async getQuizState(quizId: string): Promise<QuizState | null> {
    if (this.authService.isOfflineMode || !this.quizStatesRepo) {
      const saved = localStorage.getItem(`offline_quiz_state_${quizId}`);
      return saved ? { id: quizId, ...JSON.parse(saved) } : null;
    }
    try {
      return await this.quizStatesRepo.getById(quizId);
    } catch (error) {
      console.warn('[FirebaseSessionService] Failed to load quiz state, trying offline cache:', error);
      const saved = localStorage.getItem(`offline_quiz_state_${quizId}`);
      return saved ? { id: quizId, ...JSON.parse(saved) } : null;
    }
  }

  public async setQuizState(quizId: string, state: Omit<QuizState, 'id'>): Promise<QuizState> {
    if (this.authService.isOfflineMode || !this.quizStatesRepo) {
      localStorage.setItem(`offline_quiz_state_${quizId}`, JSON.stringify(state));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', { key: `offline_quiz_state_${quizId}`, newValue: JSON.stringify(state) }));
      }
      return { id: quizId, ...state };
    }
    try {
      return await this.quizStatesRepo.set(quizId, state);
    } catch (error) {
      console.warn('[FirebaseSessionService] Failed to save quiz state in Firestore, saving locally:', error);
      localStorage.setItem(`offline_quiz_state_${quizId}`, JSON.stringify(state));
      return { id: quizId, ...state };
    }
  }

  public subscribeQuizState(quizId: string, callback: (state: QuizState | null) => void): () => void {
    if (this.authService.isOfflineMode) {
      const getOfflineState = (): QuizState | null => {
        const saved = localStorage.getItem(`offline_quiz_state_${quizId}`);
        return saved ? { id: quizId, ...JSON.parse(saved) } : null;
      };
      callback(getOfflineState());
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === `offline_quiz_state_${quizId}`) callback(getOfflineState());
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    return firestoreService.subscribe(QuizStatesDefinition, (items) => {
      callback(items.find((item) => item.id === quizId) || null);
    });
  }
}
