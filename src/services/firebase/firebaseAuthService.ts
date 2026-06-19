import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';

export class FirebaseAuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private isOffline = false;

  public initialize(): void {
    const apiKey = import.meta.env['VITE_FIREBASE_API_KEY'] || 'MOCK_API_KEY';
    if (apiKey === 'MOCK_API_KEY') {
      this.isOffline = true;
      console.warn('[FirebaseAuthService] Running in offline mock mode (MOCK_API_KEY detected).');
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
    } catch (e) {
      console.warn('[FirebaseAuthService] Firebase failed to initialize. Running in mock/offline mode:', e);
      this.isOffline = true;
    }
  }

  public get isOfflineMode(): boolean {
    return this.isOffline;
  }

  public setOfflineMode(value: boolean): void {
    this.isOffline = value;
  }

  public getAuthInstance(): Auth | null {
    return this.auth;
  }

  public async anonymousSignIn(): Promise<string> {
    if (this.isOffline || !this.auth) {
      console.warn('[FirebaseAuthService] Firebase Auth is in offline/mock mode. Returning offline mock UID.');
      return 'offline_mock_uid';
    }
    try {
      const userCredential = await signInAnonymously(this.auth);
      return userCredential.user?.uid || 'anonymous_uid';
    } catch (error) {
      console.warn('[FirebaseAuthService] Anonymous auth failed, falling back to offline mock mode:', error);
      this.isOffline = true;
      return 'offline_mock_uid';
    }
  }
}
