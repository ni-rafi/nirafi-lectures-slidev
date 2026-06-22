import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithCredential, type Auth } from 'firebase/auth';

interface GoogleIdTokenCredential {
  credential: string;
}

interface GoogleAccountsIdInitializeOptions {
  client_id: string;
  callback: (response: GoogleIdTokenCredential) => void;
  auto_select?: boolean;
}

interface GoogleAccountsId {
  initialize(options: GoogleAccountsIdInitializeOptions): void;
  prompt(callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void): void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface WindowWithGoogle extends Window {
  google?: {
    accounts: GoogleAccounts;
  };
}

export class FirebaseAuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;

  public initialize(): void {
    const apiKey = import.meta.env['VITE_FIREBASE_API_KEY'];
    if (!apiKey) {
      console.error('[FirebaseAuthService] VITE_FIREBASE_API_KEY is not defined.');
    }

    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'],
      projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'],
      storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'],
      messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'],
      appId: import.meta.env['VITE_FIREBASE_APP_ID']
    };

    try {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
    } catch (e) {
      console.error('[FirebaseAuthService] Firebase failed to initialize:', e);
    }
  }

  public getAuthInstance(): Auth | null {
    return this.auth;
  }

  public async signInWithGoogle(): Promise<{ uid: string; email: string | null; name: string | null }> {
    if (!this.auth) {
      throw new Error('Firebase Auth is not initialized.');
    }
    const provider = new GoogleAuthProvider();
    // Configure custom parameters if needed, e.g. prompt select_account
    provider.setCustomParameters({ prompt: 'select_account' });
    
    const result = await signInWithPopup(this.auth, provider);
    return {
      uid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
    };
  }

  public async signOut(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
  }

  public onAuthStateChanged(callback: (user: { uid: string; email: string | null } | null) => void): () => void {
    if (!this.auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        callback({ uid: user.uid, email: user.email });
      } else {
        callback(null);
      }
    });
  }

  public initializeGoogleOneTap(clientId: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    const customWindow = window as unknown as WindowWithGoogle;
    if (!customWindow.google?.accounts?.id) {
      console.warn('[FirebaseAuthService] Google Identity Services script not loaded yet.');
      return;
    }

    try {
      customWindow.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!this.auth) {
            console.error('[FirebaseAuthService] Auth not initialized.');
            return;
          }
          const credential = GoogleAuthProvider.credential(response.credential);
          signInWithCredential(this.auth, credential).catch((error) => {
            console.error('[FirebaseAuthService] Google One Tap sign in failed:', error);
          });
        },
      });

      customWindow.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.warn('[FirebaseAuthService] Google One Tap prompt not displayed:', notification);
        } else if (notification.isSkippedMoment()) {
          console.warn('[FirebaseAuthService] Google One Tap prompt skipped:', notification);
        }
      });
    } catch (e) {
      console.error('[FirebaseAuthService] Failed to initialize Google One Tap:', e);
    }
  }
}


