import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import type { IFirebaseService, QuizResponsePayload, FeedbackPayload, UserPayload, ThemeConfigPayload, SessionStatusPayload } from './IFirebaseService';
import { SubmissionsRepository } from './repositories/submissions/SubmissionsRepository';
import { FeedbackRepository } from './repositories/feedback/FeedbackRepository';
import { UsersRepository } from './repositories/users/UsersRepository';
import { ThemesRepository } from './repositories/themes/ThemesRepository';
import { SessionStatusRepository } from './repositories/lectures/SessionStatusRepository';
import { firestoreService } from './firestoreService';
import { SessionStatusDefinition } from './firebase.definitions';

export class FirebaseService implements IFirebaseService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  
  private submissionsRepository: SubmissionsRepository | null = null;
  private feedbackRepository: FeedbackRepository | null = null;
  private usersRepository: UsersRepository | null = null;
  private themesRepository: ThemesRepository | null = null;
  private sessionStatusRepository: SessionStatusRepository | null = null;
  private isOfflineMode = false;


  public initializeFirebase(): void {
    // Retrieve configuration from env variables, or default to mock fields if empty.
    const apiKey = import.meta.env['VITE_FIREBASE_API_KEY'] || 'MOCK_API_KEY';
    if (apiKey === 'MOCK_API_KEY') {
      this.isOfflineMode = true;
      console.warn('[FirebaseService] Running in offline mock mode (MOCK_API_KEY detected).');
    }

    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'] || 'mock-app.firebaseapp.com',
      projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] || 'mock-app',
      storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'] || 'mock-app.appspot.com',
      messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'] || '000000000000',
      appId: import.meta.env['VITE_FIREBASE_APP_ID'] || '1:0000:web:mock'
    };

    try {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      
      // Initialize Repositories
      this.submissionsRepository = new SubmissionsRepository();
      this.feedbackRepository = new FeedbackRepository();
      this.usersRepository = new UsersRepository();
      this.themesRepository = new ThemesRepository();
      this.sessionStatusRepository = new SessionStatusRepository();
    } catch (e) {
      console.warn('[FirebaseService] Firebase failed to initialize. Running in mock/offline mode:', e);
      this.isOfflineMode = true;
    }
  }

  public async anonymousSignIn(): Promise<string> {
    if (this.isOfflineMode || !this.auth) {
      console.warn('[FirebaseService] Firebase Auth is in offline/mock mode. Returning offline mock UID.');
      return 'offline_mock_uid';
    }
    try {
      const userCredential = await signInAnonymously(this.auth);
      return userCredential.user?.uid || 'anonymous_uid';
    } catch (error) {
      console.warn('[FirebaseService] Anonymous auth failed, falling back to offline mock mode:', error);
      this.isOfflineMode = true;
      return 'offline_mock_uid';
    }
  }

  public async submitQuizResponse(payload: QuizResponsePayload): Promise<void> {
    if (this.isOfflineMode || !this.submissionsRepository) {
      console.warn('[FirebaseService] [Offline Mode] Simulation logging submission:', payload);
      const submissions = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
      submissions.push(payload);
      localStorage.setItem('offline_submissions', JSON.stringify(submissions));
      return;
    }
    try {
      // Delegate to the decoupled repository layer
      await this.submissionsRepository.create(payload);
    } catch (error) {
      console.warn('[FirebaseService] Failed to submit quiz response to repository, logging offline:', error);
      const submissions = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
      submissions.push(payload);
      localStorage.setItem('offline_submissions', JSON.stringify(submissions));
    }
  }

  public async submitFeedback(payload: FeedbackPayload): Promise<void> {
    if (this.isOfflineMode || !this.feedbackRepository) {
      console.warn('[FirebaseService] [Offline Mode] Simulation logging feedback:', payload);
      const feedback = JSON.parse(localStorage.getItem('offline_feedback') || '[]');
      feedback.push(payload);
      localStorage.setItem('offline_feedback', JSON.stringify(feedback));
      return;
    }
    try {
      // Delegate to the decoupled repository layer
      await this.feedbackRepository.create(payload);
    } catch (error) {
      console.warn('[FirebaseService] Failed to submit feedback to repository, logging offline:', error);
      const feedback = JSON.parse(localStorage.getItem('offline_feedback') || '[]');
      feedback.push(payload);
      localStorage.setItem('offline_feedback', JSON.stringify(feedback));
    }
  }

  public async getUserProfile(uid: string): Promise<UserPayload | null> {
    if (this.isOfflineMode || !this.usersRepository || uid === 'offline_mock_uid') {
      console.warn('[FirebaseService] [Offline Mode] Fetching profile for UID:', uid);
      const cached = localStorage.getItem('offline_student_profile');
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    }
    try {
      return await this.usersRepository.getById(uid);
    } catch (error) {
      console.warn('[FirebaseService] Failed to fetch user profile, trying offline cache:', error);
      const cached = localStorage.getItem('offline_student_profile');
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    }
  }

  public async setUserProfile(uid: string, profile: Omit<UserPayload, 'id'>): Promise<UserPayload> {
    if (this.isOfflineMode || !this.usersRepository || uid === 'offline_mock_uid') {
      console.warn('[FirebaseService] [Offline Mode] Saving profile locally:', profile);
      const userProfile = { id: uid, ...profile };
      localStorage.setItem('offline_student_profile', JSON.stringify(userProfile));
      return userProfile;
    }
    try {
      return await this.usersRepository.set(uid, profile);
    } catch (error) {
      console.warn('[FirebaseService] Failed to set user profile in Firestore, saving locally:', error);
      const userProfile = { id: uid, ...profile };
      localStorage.setItem('offline_student_profile', JSON.stringify(userProfile));
      return userProfile;
    }
  }

  public async getThemeConfig(id: string): Promise<ThemeConfigPayload | null> {
    if (this.isOfflineMode || !this.themesRepository) {
      console.warn('[FirebaseService] [Offline Mode] Loading theme config locally:', id);
      const saved = localStorage.getItem(`offline_theme_${id}`);
      if (saved) {
        return JSON.parse(saved) as ThemeConfigPayload;
      }
      return null;
    }
    try {
      return await this.themesRepository.getById(id);
    } catch (error) {
      console.warn('[FirebaseService] Failed to load theme config, trying offline cache:', error);
      const saved = localStorage.getItem(`offline_theme_${id}`);
      if (saved) {
        return JSON.parse(saved) as ThemeConfigPayload;
      }
      return null;
    }
  }

  public async setThemeConfig(id: string, config: Omit<ThemeConfigPayload, 'id'>): Promise<ThemeConfigPayload> {
    if (this.isOfflineMode || !this.themesRepository) {
      console.warn('[FirebaseService] [Offline Mode] Saving theme config locally:', id, config);
      const payload = { id, ...config };
      localStorage.setItem(`offline_theme_${id}`, JSON.stringify(payload));
      return payload;
    }
    try {
      return await this.themesRepository.set(id, config);
    } catch (error) {
      console.warn('[FirebaseService] Failed to save theme config in Firestore, saving locally:', error);
      const payload = { id, ...config };
      localStorage.setItem(`offline_theme_${id}`, JSON.stringify(payload));
      return payload;
    }
  }

  public async deleteThemeConfig(id: string): Promise<void> {
    if (this.isOfflineMode || !this.themesRepository) {
      console.warn('[FirebaseService] [Offline Mode] Deleting theme config locally:', id);
      localStorage.removeItem(`offline_theme_${id}`);
      return;
    }
    try {
      await this.themesRepository.delete(id);
    } catch (error) {
      console.warn('[FirebaseService] Failed to delete theme config in Firestore, deleting locally:', error);
      localStorage.removeItem(`offline_theme_${id}`);
    }
  }

  public async getSessionStatus(id: string): Promise<SessionStatusPayload | null> {
    if (this.isOfflineMode || !this.sessionStatusRepository) {
      console.warn('[FirebaseService] [Offline Mode] Loading session status locally:', id);
      const saved = localStorage.getItem(`offline_status_${id}`);
      if (saved) {
        return { id, ...JSON.parse(saved) } as SessionStatusPayload;
      }
      return null;
    }
    try {
      return await this.sessionStatusRepository.getById(id);
    } catch (error) {
      console.warn('[FirebaseService] Failed to load session status, trying offline cache:', error);
      const saved = localStorage.getItem(`offline_status_${id}`);
      if (saved) {
        return { id, ...JSON.parse(saved) } as SessionStatusPayload;
      }
      return null;
    }
  }

  public async setSessionStatus(id: string, payload: Omit<SessionStatusPayload, 'id'>): Promise<SessionStatusPayload> {
    if (this.isOfflineMode || !this.sessionStatusRepository) {
      console.warn('[FirebaseService] [Offline Mode] Saving session status locally:', id, payload);
      localStorage.setItem(`offline_status_${id}`, JSON.stringify(payload));
      return { id, ...payload };
    }
    try {
      return await this.sessionStatusRepository.set(id, payload);
    } catch (error) {
      console.warn('[FirebaseService] Failed to save session status in Firestore, saving locally:', error);
      localStorage.setItem(`offline_status_${id}`, JSON.stringify(payload));
      return { id, ...payload };
    }
  }

  public subscribeSessionStatuses(callback: (statuses: SessionStatusPayload[]) => void): () => void {
    if (this.isOfflineMode) {
      const getOfflineStatuses = (): SessionStatusPayload[] => {
        const results: SessionStatusPayload[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('offline_status_')) {
            const docId = key.replace('offline_status_', '');
            try {
              const data = JSON.parse(localStorage.getItem(key) || '{}');
              results.push({ id: docId, ...data });
            } catch (e) {
              console.warn('Failed to parse offline status:', key, e);
            }
          }
        }
        return results;
      };

      callback(getOfflineStatuses());

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key && e.key.startsWith('offline_status_')) {
          callback(getOfflineStatuses());
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }

    return firestoreService.subscribe(SessionStatusDefinition, callback);
  }
}
